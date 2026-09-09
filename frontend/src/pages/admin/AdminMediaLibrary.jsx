import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { adminApi } from '../../services';

export default function AdminMediaLibrary() {
  const [mediaAssets, setMediaAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getMediaAssets();
      setMediaAssets(res.data || []);
    } catch (err) {
      console.error('Failed to fetch media assets:', err);
      toast.error('Failed to load media assets');
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
        toast.success('Image uploaded successfully');
        fetchMedia();
      }
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this asset?')) return;
    try {
      await adminApi.deleteMediaAsset(id);
      toast.success('Asset deleted');
      fetchMedia();
    } catch (err) {
      console.error('Failed to delete asset:', err);
      toast.error('Failed to delete asset');
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1" style={{ fontFamily: "Outfit", fontWeight: "800", fontSize: "24px" }}>Media Library</h4>
          <p className="text-muted mb-0">Manage all images and assets in one place.</p>
        </div>
        <div>
          <label className="btn btn-primary">
            {uploading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="fas fa-upload me-2"></i>}
            Upload Image
            <input type="file" hidden onChange={handleUpload} disabled={uploading} accept="image/*" />
          </label>
        </div>
      </div>

      <div className="bg-white rounded shadow-sm p-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : mediaAssets.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="fas fa-images fs-1 mb-3"></i>
            <h5>No Media Found</h5>
            <p>Upload some images to get started.</p>
          </div>
        ) : (
          <div className="row g-4">
            {mediaAssets.map((asset) => (
              <div key={asset.id} className="col-lg-2 col-md-3 col-sm-4 col-6">
                <div className="card h-100 border shadow-sm">
                  <div className="position-relative" style={{ paddingTop: '100%' }}>
                    <img 
                      src={getImageUrl(asset.storagePath)} 
                      alt={asset.altText || asset.filename} 
                      className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
                    />
                  </div>
                  <div className="card-body p-2 text-center">
                    <p className="card-text text-truncate small mb-2" title={asset.filename}>{asset.filename}</p>
                    <button onClick={() => handleDelete(asset.id)} className="btn btn-outline-danger btn-sm w-100">
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
