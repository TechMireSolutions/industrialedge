import { getImageUrl } from '../../utils/getImageUrl';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { adminApi } from '../../services';

export default function MediaPicker({ value, onChange, label = 'Select Image' }) {
  const [showModal, setShowModal] = useState(false);
  const [mediaAssets, setMediaAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (showModal) {
      fetchMedia();
    }
  }, [showModal]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getMediaAssets();
      setMediaAssets(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await adminApi.uploadImage(formData);
      if (res?.data || res?.storagePath || res?.url) {
        toast.success('Image uploaded');
        fetchMedia(); // refresh list
      }
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSelect = (asset) => {
    onChange(asset.id, asset.storagePath);
    setShowModal(false);
  };

  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <div className="d-flex align-items-center gap-3">
        {value ? (
          <img src={getImageUrl(value.storagePath || value)} alt="Preview" style={{ height: '60px', width: 'auto', objectFit: 'contain', background: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '4px' }} />
        ) : (
          <div style={{ height: '60px', width: '60px', background: '#f8f9fa', border: '1px dashed #dee2e6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fas fa-image text-muted"></i>
          </div>
        )}
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowModal(true)}>
          {value ? 'Change Image' : 'Select Image'}
        </button>
        {value && (
          <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => onChange(null, null)}>
            Remove
          </button>
        )}
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Media Library</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="d-flex justify-content-between mb-4">
                  <input type="file" className="form-control w-auto" onChange={handleUpload} disabled={uploading} />
                  {uploading && <span className="spinner-border spinner-border-sm mt-2"></span>}
                </div>

                {loading ? (
                  <div className="text-center py-5"><span className="spinner-border"></span></div>
                ) : (
                  <div className="row g-3">
                    {mediaAssets.map(asset => (
                      <div key={asset.id} className="col-md-2 col-sm-3 col-4">
                        <div
                          className="card h-100 cursor-pointer"
                          style={{ cursor: 'pointer', transition: '0.2s' }}
                          onClick={() => handleSelect(asset)}
                          onMouseOver={(e) => e.currentTarget.style.borderColor = '#0d6efd'}
                          onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(0,0,0,.125)'}
                        >
                          <img src={getImageUrl(asset.storagePath)} className="card-img-top" alt={asset.altText || asset.filename} style={{ height: '100px', objectFit: 'cover' }} />
                          <div className="card-body p-2 text-center">
                            <small className="text-truncate d-block" style={{ fontSize: '0.75rem' }}>{asset.filename}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                    {mediaAssets.length === 0 && (
                      <div className="col-12 text-center text-muted py-5">
                        No media assets found. Upload one to get started.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

