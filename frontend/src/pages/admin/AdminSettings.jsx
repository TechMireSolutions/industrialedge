import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { api } from '../../services/api';
import AdminFormLayout from '../../components/admin/AdminFormLayout';
import AdminImageUpload from '../../components/admin/AdminImageUpload';
import { useSettings } from '../../context/SettingsContext';

const TABS = [
  { id: 'general', label: 'General' },
  { id: 'branding', label: 'Branding' },
  { id: 'theme', label: 'Theme' },
  { id: 'seo', label: 'SEO & Meta' },
  { id: 'contact', label: 'Contact & Social' },
  { id: 'features', label: 'Feature Flags' },
  { id: 'system', label: 'System Configuration' },
];

const normalizeColor = (value, fallback = '#000000') => {
  if (typeof value !== 'string') return fallback;

  const color = value.trim();

  if (/^#[0-9a-fA-F]{6}$/.test(color)) {
    return color;
  }

  if (/^#[0-9a-fA-F]{3}$/.test(color)) {
    return color;
  }

  return fallback;
};

/**
 * Safely recursively sanitizes string inputs without mutating object shapes, 
 * destroying nulls needed by database foreign keys, or replacing booleans/numbers.
 */
const sanitizePayload = (obj) => {
  if (obj === undefined) return undefined;
  if (obj === null) return null;

  if (typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizePayload);
  }

  const cleaned = {};

  for (const key of Object.keys(obj)) {
    const value = obj[key];

    if (value === undefined) {
      continue;
    }

    cleaned[key] = sanitizePayload(value);
  }

  return cleaned;
};

export default function AdminSettings() {
  const { updateSettings } = useSettings();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    general: {},
    branding: {},
    theme: {},
    seo: {},
    contact: {},
    featureFlags: {},
    system: {}
  });

  useEffect(() => {
    fetchAdminSettings();
  }, []);

  const fetchAdminSettings = async () => {
    setLoading(true);

    try {
      const response = await api.get('/settings/admin');

      console.log('RAW ADMIN SETTINGS RESPONSE:', response);

      // api.ts already returns response.json().
      // Backend may return either:
      // { success: true, data: {...} }
      // OR:
      // { theme: {...}, general: {...}, ... }
      const data =
        response?.data?.data ??
        response?.data ??
        response ??
        {};

      console.log('NORMALIZED ADMIN SETTINGS:', data);
      console.log('THEME LOADED:', data?.theme);

      setFormData({
        general: data?.general ?? {},
        branding: data?.branding ?? {},
        theme: data?.theme ?? {},
        seo: data?.seo ?? {},
        contact: data?.contact ?? {},
        featureFlags: data?.featureFlags ?? {},
        system: data?.system ?? {},
      });
    } catch (err) {
      console.error('Failed to fetch admin settings:', err);

      setError(
        err?.data?.message ||
        err?.message ||
        'Failed to fetch settings'
      );

      toast.error(
        err?.data?.message ||
        err?.message ||
        'Failed to load configuration'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');

    // 1. Shallow copy branding to prevent mutating formData state
    const getCleanFk = (id) => {
      if (typeof id === 'string' && id.trim() !== '') {
        return id.trim();
      }

      return null;
    };

    const {
      mainLogo,
      darkLogo,
      navbarLogo,
      footerLogo,
      favicon,
      ...brandingFields
    } = formData.branding || {};

    const cleanedBranding = {
      ...brandingFields,
      mainLogoId: getCleanFk(formData.branding?.mainLogoId),
      darkLogoId: getCleanFk(formData.branding?.darkLogoId),
      navbarLogoId: getCleanFk(formData.branding?.navbarLogoId),
      footerLogoId: getCleanFk(formData.branding?.footerLogoId),
      faviconId: getCleanFk(formData.branding?.faviconId),
    };

    const rawCleaned = sanitizePayload(formData);

    const cleanUrl = (val) => {
      if (!val || typeof val !== 'string' || val.trim() === '') return null;
      const trimmed = val.trim();
      return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    };

    const parseNumber = (val, fallback) => {
      if (val === '' || val === null || val === undefined) return fallback;
      const num = Number(val);
      return Number.isNaN(num) ? fallback : num;
    };

    const cleanedPayload = {
      ...rawCleaned,

      branding: cleanedBranding,

      seo: {
        ...rawCleaned.seo,

        canonicalUrl: cleanUrl(rawCleaned.seo?.canonicalUrl),

        robotsTxt: rawCleaned.seo?.robotsTxt ?? '',
        ogTitle: rawCleaned.seo?.ogTitle ?? '',
        ogDescription: rawCleaned.seo?.ogDescription ?? '',
        schemaOrg: rawCleaned.seo?.schemaOrg ?? '',
        googleAnalytics: rawCleaned.seo?.googleAnalytics ?? '',
        googleTagManager: rawCleaned.seo?.googleTagManager ?? '',
        metaPixel: rawCleaned.seo?.metaPixel ?? '',
        bingWebmaster: rawCleaned.seo?.bingWebmaster ?? '',
        googleSearchConsole: rawCleaned.seo?.googleSearchConsole ?? '',
      },

      general: {
        ...rawCleaned.general,
        websiteUrl: cleanUrl(rawCleaned.general?.websiteUrl),
      },

      system: {
        ...rawCleaned.system,
        defaultCurrency:
          rawCleaned.system?.defaultCurrency?.trim() || 'USD',

        timeZone:
          rawCleaned.system?.timeZone?.trim() || 'UTC',

        uploadSizeLimit:
          parseNumber(rawCleaned.system?.uploadSizeLimit, 5),

        maintenanceMode:
          Boolean(rawCleaned.system?.maintenanceMode),

        allowRegistration:
          Boolean(rawCleaned.system?.allowRegistration),
      },
    };

    try {
      await updateSettings(cleanedPayload);
      toast.success('Configuration saved successfully');
    } catch (err) {
      console.error('========== SETTINGS SAVE ERROR ==========');
      console.error(
        'Full Error Payload:',
        JSON.stringify(err?.data ?? err, null, 2)
      );

      const valErrors = err?.data?.errors;

      let message =
        err?.data?.message ||
        err?.message ||
        'Failed to save settings';

      if (Array.isArray(valErrors) && valErrors.length > 0) {
        message = `Validation Error: ${valErrors
          .map((e) => `${e.path?.join('.') || e.field || 'field'}: ${e.message}`)
          .join('; ')}`;
      }

      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    fetchAdminSettings();
  };

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value
      }
    }));
  };

  const renderTabContent = () => {
    const general = formData.general || {};
    const branding = formData.branding || {};
    const theme = formData.theme || {};
    const seo = formData.seo || {};
    const contact = formData.contact || {};
    const featureFlags = formData.featureFlags || {};
    const system = formData.system || {};

    switch (activeTab) {
      case 'general':
        return (
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label">Store Name</label>
              <input type="text" className="form-control" value={general.siteName || ''} onChange={e => handleChange('general', 'siteName', e.target.value)} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Tagline</label>
              <input type="text" className="form-control" value={general.tagline || ''} onChange={e => handleChange('general', 'tagline', e.target.value)} />
            </div>
            <div className="col-md-12">
              <label className="form-label">Website URL</label>
              <input type="url" className="form-control" value={general.websiteUrl || ''} onChange={e => handleChange('general', 'websiteUrl', e.target.value)} />
            </div>
            <div className="col-md-12">
              <label className="form-label">Store Description</label>
              <textarea className="form-control" rows="4" value={general.siteDescription || ''} onChange={e => handleChange('general', 'siteDescription', e.target.value)}></textarea>
            </div>
          </div>
        );
      case 'branding':
        return (
          <div className="row g-4">
            <div className="col-md-6">
              <AdminImageUpload
                label="Main Logo"
                value={
                  branding.mainLogo?.storagePath ||
                  branding.mainLogo?.url ||
                  branding.mainLogoUrl ||
                  ''
                }
                onChange={(url, id) => {
                  handleChange('branding', 'mainLogoId', id || null);
                  handleChange('branding', 'mainLogo', {
                    storagePath: url || '',
                  });
                  handleChange('branding', 'mainLogoUrl', url || '');
                }}
              />
            </div>

            <div className="col-md-6">
              <AdminImageUpload
                label="Dark Mode Logo"
                value={
                  branding.darkLogo?.storagePath ||
                  branding.darkLogo?.url ||
                  branding.darkLogoUrl ||
                  ''
                }
                onChange={(url, id) => {
                  handleChange('branding', 'darkLogoId', id || null);
                  handleChange('branding', 'darkLogo', {
                    storagePath: url || '',
                  });
                  handleChange('branding', 'darkLogoUrl', url || '');
                }}
              />
            </div>

            <div className="col-md-4">
              <AdminImageUpload
                label="Navbar Logo"
                value={
                  branding.navbarLogo?.storagePath ||
                  branding.navbarLogo?.url ||
                  branding.navbarLogoUrl ||
                  ''
                }
                onChange={(url, id) => {
                  handleChange('branding', 'navbarLogoId', id || null);
                  handleChange('branding', 'navbarLogo', {
                    storagePath: url || '',
                  });
                  handleChange('branding', 'navbarLogoUrl', url || '');
                }}
              />
            </div>

            <div className="col-md-4">
              <AdminImageUpload
                label="Footer Logo"
                value={
                  branding.footerLogo?.storagePath ||
                  branding.footerLogo?.url ||
                  branding.footerLogoUrl ||
                  ''
                }
                onChange={(url, id) => {
                  handleChange('branding', 'footerLogoId', id || null);
                  handleChange('branding', 'footerLogo', {
                    storagePath: url || '',
                  });
                  handleChange('branding', 'footerLogoUrl', url || '');
                }}
              />
            </div>

            <div className="col-md-4">
              <AdminImageUpload
                label="Favicon"
                value={
                  branding.favicon?.storagePath ||
                  branding.favicon?.url ||
                  branding.faviconUrl ||
                  ''
                }
                onChange={(url, id) => {
                  handleChange('branding', 'faviconId', id || null);
                  handleChange('branding', 'favicon', {
                    storagePath: url || '',
                  });
                  handleChange('branding', 'faviconUrl', url || '');
                }}
              />
            </div>
          </div>
        );
      case 'theme':
        return (
          <div className="row g-4">
            {['primaryColor', 'secondaryColor', 'accentColor', 'successColor', 'warningColor', 'dangerColor', 'infoColor', 'backgroundColor', 'cardColor', 'textColor'].map(color => (
              <div className="col-md-3" key={color}>
                <label className="form-label">{color.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                <input
                  type="color"
                  className="form-control form-control-color w-100"
                  value={normalizeColor(theme[color])}
                  onChange={e =>
                    handleChange('theme', color, e.target.value.toUpperCase())
                  }
                />
              </div>
            ))}
            <div className="col-md-6 mt-4">
              <label className="form-label">Border Radius</label>
              <input type="text" className="form-control" value={theme.borderRadius || '0.375rem'} onChange={e => handleChange('theme', 'borderRadius', e.target.value)} />
            </div>
            <div className="col-md-6 mt-4">
              <label className="form-label">Heading Font Family</label>
              <input type="text" className="form-control" value={theme.headingFont || 'Outfit, sans-serif'} onChange={e => handleChange('theme', 'headingFont', e.target.value)} />
            </div>
          </div>
        );
      case 'seo':
        return (
          <div className="row g-4">
            <div className="col-md-12">
              <label className="form-label">Meta Title</label>
              <input type="text" className="form-control" value={seo.metaTitle || ''} onChange={e => handleChange('seo', 'metaTitle', e.target.value)} />
            </div>
            <div className="col-md-12">
              <label className="form-label">Meta Description</label>
              <textarea className="form-control" rows="3" value={seo.metaDescription || ''} onChange={e => handleChange('seo', 'metaDescription', e.target.value)}></textarea>
            </div>
            <div className="col-md-6">
              <label className="form-label">Google Analytics ID</label>
              <input type="text" className="form-control" value={seo.googleAnalytics || ''} onChange={e => handleChange('seo', 'googleAnalytics', e.target.value)} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Meta Pixel ID</label>
              <input type="text" className="form-control" value={seo.metaPixel || ''} onChange={e => handleChange('seo', 'metaPixel', e.target.value)} />
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label">Emails</label>
              <input type="text" className="form-control" value={contact.emails || ''} onChange={e => handleChange('contact', 'emails', e.target.value)} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Phones</label>
              <input type="text" className="form-control" value={contact.phones || ''} onChange={e => handleChange('contact', 'phones', e.target.value)} />
            </div>
            <div className="col-md-12">
              <label className="form-label">Addresses</label>
              <textarea className="form-control" rows="3" value={contact.addresses || ''} onChange={e => handleChange('contact', 'addresses', e.target.value)}></textarea>
            </div>
            <div className="col-md-12">
              <label className="form-label">Working Hours</label>
              <input type="text" className="form-control" value={contact.workingHours || ''} onChange={e => handleChange('contact', 'workingHours', e.target.value)} />
            </div>
            <div className="col-md-12">
              <label className="form-label">Social Links</label>
              <textarea className="form-control font-monospace" rows="3" value={contact.socialLinks || ''} onChange={e => handleChange('contact', 'socialLinks', e.target.value)} placeholder='{"facebook": "url"}'></textarea>
            </div>
          </div>
        );
      case 'features':
        return (
          <div className="row g-4">
            {['enableWishlist', 'enableCompare', 'enableReviews', 'enableCoupons', 'enableNewsletter', 'enablePartners', 'enableBlog', 'enableTestimonials', 'enableAnimations', 'enableSmokeEffect'].map(flag => (
              <div className="col-md-4" key={flag}>
                <div className="form-check form-switch p-3 border rounded bg-light">
                  <input className="form-check-input ms-0 me-3" type="checkbox" id={flag}
                    checked={Boolean(featureFlags[flag])}
                    onChange={e => handleChange('featureFlags', flag, e.target.checked)} />
                  <label className="form-check-label ms-1" htmlFor={flag}>
                    {flag.replace('enable', '').replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                </div>
              </div>
            ))}
          </div>
        );
      case 'system':
        return (
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label">Maintenance Mode</label>
              <select className="form-select" value={system.maintenanceMode ? 'true' : 'false'} onChange={e => handleChange('system', 'maintenanceMode', e.target.value === 'true')}>
                <option value="false">Off (Live)</option>
                <option value="true">On (Maintenance)</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Allow Registration</label>
              <select className="form-select" value={system.allowRegistration ? 'true' : 'false'} onChange={e => handleChange('system', 'allowRegistration', e.target.value === 'true')}>
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Default Currency</label>
              <input type="text" className="form-control" value={system.defaultCurrency || 'USD'} onChange={e => handleChange('system', 'defaultCurrency', e.target.value)} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Time Zone</label>
              <input type="text" className="form-control" value={system.timeZone || 'UTC'} onChange={e => handleChange('system', 'timeZone', e.target.value)} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Max Upload Size (MB)</label>
              <input type="number" className="form-control" value={system.uploadSizeLimit ?? 5} onChange={e => handleChange('system', 'uploadSizeLimit', e.target.value === '' ? '' : parseInt(e.target.value, 10))} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="text-center p-5"><span className="spinner-border text-primary"></span></div>;
  }

  return (
    <AdminFormLayout
      title="Global Configuration"
      subtitle="Manage your store's general settings, branding, themes, and configuration."
      onBack={() => window.history.back()}
      onSave={handleSave}
      onCancel={handleCancel}
      isSaving={saving}
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      error={error}
    >
      {renderTabContent()}
    </AdminFormLayout>
  );
}