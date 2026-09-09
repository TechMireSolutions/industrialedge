import { getImageUrl } from '../../utils/getImageUrl';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { adminApi } from '../../services';
import AdminFormLayout from '../../components/admin/AdminFormLayout';
import AdminImageUpload from '../../components/admin/AdminImageUpload';

export default function AdminPartners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    websiteUrl: '',
    description: '',
    active: true,
    displayOrder: 0,
    logoId: null,
    darkLogoId: null,
    logo: null,
    darkLogo: null
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setLoading(true);

    try {
      const res = await adminApi.getPartners(false);
      const partnersData = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data?.partners)
            ? res.data.partners
            : [];

      setPartners(partnersData);
    } catch (err) {
      console.error('Failed to load partners:', err);
      setPartners([]);
      toast.error(
        err.data?.message ||
        'Failed to load partners'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      slug: partner.slug,
      websiteUrl: partner.websiteUrl || '',
      description: partner.description || '',
      active: partner.active,
      displayOrder: partner.displayOrder,
      logoId: partner.logoId,
      darkLogoId: partner.darkLogoId,
      logo: partner.logo,
      darkLogo: partner.darkLogo
    });
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingPartner(null);
    setFormData({
      name: '',
      slug: '',
      websiteUrl: '',
      description: '',
      active: true,
      displayOrder: partners.length,
      logoId: null,
      darkLogoId: null,
      logo: null,
      darkLogo: null
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        websiteUrl: formData.websiteUrl,
        description: formData.description,
        active: formData.active,
        displayOrder: parseInt(formData.displayOrder) || 0,
        logoId: formData.logoId,
        darkLogoId: formData.darkLogoId
      };

      if (editingPartner) {
        await adminApi.updatePartner(editingPartner.id, payload);
        toast.success('Partner updated');
      } else {
        await adminApi.createPartner(payload);
        toast.success('Partner created');
      }
      setShowForm(false);
      fetchPartners();
    } catch (err) {
      toast.error(err.data?.message || 'Failed to save partner');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this partner?')) return;
    try {
      await adminApi.deletePartner(id);
      toast.success('Partner deleted');
      fetchPartners();
    } catch (err) {
      toast.error(err.data?.message || 'Failed to delete partner');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (showForm) {
    return (
      <AdminFormLayout
        title={editingPartner ? "Edit Partner" : "Add Partner"}
        subtitle="Manage partner details and logos"
        onBack={() => setShowForm(false)}
        onSave={handleSave}
        onCancel={() => setShowForm(false)}
        isSaving={false}
      >
        <div className="row g-4">
          <div className="col-md-6">
            <label>Partner Name *</label>
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label>Slug (auto-generated if empty)</label>
            <input type="text" className="form-control" name="slug" value={formData.slug} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label>Website URL</label>
            <input type="url" className="form-control" name="websiteUrl" value={formData.websiteUrl} onChange={handleChange} />
          </div>
          <div className="col-md-3">
            <label>Display Order</label>
            <input type="number" className="form-control" name="displayOrder" value={formData.displayOrder} onChange={handleChange} />
          </div>
          <div className="col-md-3 d-flex align-items-end">
            <div className="form-check form-switch mb-2">
              <input className="form-check-input" type="checkbox" name="active" checked={formData.active} onChange={handleChange} id="activeSwitch" />
              <label className="form-check-label" htmlFor="activeSwitch">Active Status</label>
            </div>
          </div>
          <div className="col-md-12">
            <label>Description</label>
            <textarea className="form-control" rows="3" name="description" value={formData.description} onChange={handleChange}></textarea>
          </div>

          <div className="col-md-6">
            <label>Standard Logo</label>
            <AdminImageUpload
              value={formData.logo?.storagePath || formData.logo || ''}
              onChange={(url, id) => setFormData(prev => ({ ...prev, logoId: id || prev.logoId, logo: { storagePath: url } }))}
            />
          </div>
          <div className="col-md-6">
            <label>Dark Mode Logo</label>
            <AdminImageUpload
              value={formData.darkLogo?.storagePath || formData.darkLogo || ''}
              onChange={(url, id) => setFormData(prev => ({ ...prev, darkLogoId: id || prev.darkLogoId, darkLogo: { storagePath: url } }))}
            />
          </div>
        </div>
      </AdminFormLayout>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1" style={{ fontFamily: "Outfit", fontWeight: "800", fontSize: "24px" }}>Partners</h4>
          <p className="text-muted mb-0">Manage trusted partners and their logos.</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          <i className="fas fa-plus me-2"></i> Add Partner
        </button>
      </div>

      <div className="bg-white rounded shadow-sm p-4">
        {loading ? (
          <div className="text-center py-5"><span className="spinner-border text-primary"></span></div>
        ) : partners.length === 0 ? (
          <div className="text-center py-5 text-muted">No partners found. Add some!</div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Logo</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {partners.map(partner => (
                  <tr key={partner.id}>
                    <td>
                      {partner.logo ? (
                        <img src={getImageUrl(partner.logo.storagePath)} alt={partner.name} style={{ height: '40px', objectFit: 'contain' }} />
                      ) : (
                        <span className="text-muted">No Logo</span>
                      )}
                    </td>
                    <td>
                      <div className="fw-bold">{partner.name}</div>
                      <small className="text-muted">{partner.websiteUrl}</small>
                    </td>
                    <td>
                      <span className={`badge bg-${partner.active ? 'success' : 'secondary'}`}>
                        {partner.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{partner.displayOrder}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(partner)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(partner.id)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

