import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { adminApi } from '../../services';
import AdminFormLayout from '../../components/admin/AdminFormLayout';

export default function AdminHomepageBuilder() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const availableSectionTypes = [
    { type: 'Hero', label: 'Hero Slideshow' },
    { type: 'Partners', label: 'Partners Marquee' },
    { type: 'Categories', label: 'Featured Categories' },
    { type: 'Products', label: 'Product Grid' },
    { type: 'Banners', label: 'Promotional Banners' },
    { type: 'Testimonials', label: 'Testimonials' }
  ];

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getHomepageSections(false);
      const data = Array.isArray(res.data) ? res.data : [];
      const mappedSections = data.map((s) => {
        let config = {};
        let title = `${s.sectionName} Section`;
        let subtitle = '';
        if (s.settings) {
          try {
            const parsed = typeof s.settings === 'string' ? JSON.parse(s.settings) : s.settings;
            config = parsed.config || {};
            title = parsed.title || title;
            subtitle = parsed.subtitle || '';
          } catch (e) { }
        }
        return {
          id: s.id,
          type: s.sectionName,
          title,
          subtitle,
          active: s.enabled !== undefined ? Boolean(s.enabled) : true,
          order: s.displayOrder || 0,
          config
        };
      });
      setSections(mappedSections);
    } catch (err) {
      console.error('Failed to fetch sections:', err);
      toast.error('Failed to fetch sections');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateHomepageSections(sections);
      toast.success('Homepage layout saved');
      fetchSections();
    } catch (err) {
      console.error('Failed to save layout:', err);
      toast.error('Failed to save layout');
    } finally {
      setSaving(false);
    }
  };

  const addSection = (type) => {
    const newSection = {
      id: `new_${Date.now()}`,
      type,
      title: `${type} Section`,
      subtitle: '',
      active: true,
      order: sections.length,
      config: {}
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (index) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
    setSections(newSections.map((s, i) => ({ ...s, order: i })));
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index - 1];
    newSections[index - 1] = temp;
    setSections(newSections.map((s, i) => ({ ...s, order: i })));
  };

  const moveDown = (index) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index + 1];
    newSections[index + 1] = temp;
    setSections(newSections.map((s, i) => ({ ...s, order: i })));
  };

  const updateSection = (index, field, value) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    setSections(newSections);
  };

  if (loading) return <div className="text-center p-5"><span className="spinner-border text-primary"></span></div>;

  return (
    <AdminFormLayout
      title="Homepage Builder"
      subtitle="Drag, drop, and configure sections for your storefront homepage."
      onBack={() => window.history.back()}
      onSave={handleSave}
      onCancel={() => fetchSections()}
      isSaving={saving}
    >
      <div className="row g-4">
        <div className="col-md-3">
          <div className="bg-light border rounded p-3 sticky-top" style={{ top: '100px' }}>
            <h6 className="mb-3">Available Sections</h6>
            <div className="d-grid gap-2">
              {availableSectionTypes.map(st => (
                <button key={st.type} className="btn btn-outline-secondary text-start" onClick={() => addSection(st.type)}>
                  <i className="fas fa-plus me-2"></i> {st.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-9">
          {sections.length === 0 ? (
            <div className="text-center py-5 text-muted border border-dashed rounded bg-light">
              <i className="fas fa-puzzle-piece fs-1 mb-3"></i>
              <p>Your homepage is empty. Add sections from the left.</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {sections.map((section, idx) => (
                <div key={section.id} className="card shadow-sm border-0">
                  <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center cursor-move border-bottom">
                    <h6 className="mb-0 fw-bold">
                      <span className="badge bg-primary me-2">{idx + 1}</span>
                      {section.type}
                    </h6>
                    <div>
                      <button className="btn btn-sm btn-light me-1" onClick={() => moveUp(idx)} disabled={idx === 0}><i className="fas fa-arrow-up"></i></button>
                      <button className="btn btn-sm btn-light me-3" onClick={() => moveDown(idx)} disabled={idx === sections.length - 1}><i className="fas fa-arrow-down"></i></button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => removeSection(idx)}><i className="fas fa-trash"></i></button>
                    </div>
                  </div>
                  <div className="card-body bg-light">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small">Section Title</label>
                        <input type="text" className="form-control form-control-sm" value={section.title} onChange={e => updateSection(idx, 'title', e.target.value)} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small">Subtitle</label>
                        <input type="text" className="form-control form-control-sm" value={section.subtitle || ''} onChange={e => updateSection(idx, 'subtitle', e.target.value)} />
                      </div>
                      <div className="col-md-12">
                        <div className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" id={`active_${idx}`} checked={section.active} onChange={e => updateSection(idx, 'active', e.target.checked)} />
                          <label className="form-check-label" htmlFor={`active_${idx}`}>Visible on Storefront</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminFormLayout>
  );
}
