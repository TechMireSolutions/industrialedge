import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { adminApi } from '../../services';
import { useSettings } from '../../context/SettingsContext';

export default function AdminImageUpload({
  value,
  onChange,
  label = "Upload Image",
  helperText = "PNG, JPG, WEBP, SVG up to 5MB"
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { settings } = useSettings();
  const maxUploadSizeMB = settings?.system?.uploadSizeLimit || 5;

  const handleImageUpload = async (file) => {
    if (!file) return;

    if (file.size > maxUploadSizeMB * 1024 * 1024) {
      toast.error(`File size exceeds the ${maxUploadSizeMB}MB limit`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);

    try {
      // 1. Wrap raw File object inside FormData
      const formData = new FormData();
      formData.append('image', file); // Ensure field name matches backend expected key ('file' or 'image')

      // 2. Pass FormData to API client
      const response = await adminApi.uploadImage(formData);

      console.log('UPLOAD RESPONSE:', response);

      const asset = response?.data || response;

      const url =
        asset?.storagePath ||
        asset?.url ||
        response?.storagePath ||
        response?.url;

      const id =
        asset?.id ||
        response?.id ||
        null;

      if (!url) {
        console.error('Upload succeeded but no image URL was returned:', response);
        toast.error('Upload failed: No image URL returned from server.');
        return;
      }

      onChange(url, id);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('IMAGE UPLOAD ERROR:', error);

      const serverErrorMessage =
        error?.response?.data?.message ||
        error?.data?.message ||
        error?.message ||
        'Internal server error during image upload';

      toast.error(serverErrorMessage);
    } finally {
      setUploading(false);
      // Reset input value so re-uploading the same file works
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current && !uploading) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="admin-image-upload mb-4">
      <div className="mb-3">
        <h5 className="fw-bold text-dark mb-1">{label}</h5>
        <p className="text-muted small mb-0">
          Upload the {label.toLowerCase()} used by your website.
        </p>
      </div>

      <div
        className="border rounded p-5 text-center mb-3 position-relative"
        style={{
          borderStyle: 'dashed',
          borderWidth: '2px',
          borderColor: '#000000',
          backgroundColor: '#f8f9fa',
          cursor: uploading ? 'not-allowed' : 'pointer',
          transition: 'border-color 0.2s, background-color 0.2s'
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        onMouseEnter={(e) => {
          if (!uploading) {
            e.currentTarget.style.borderColor = '#237B39';
            e.currentTarget.style.backgroundColor = '#f1f8f3';
          }
        }}
        onMouseLeave={(e) => {
          if (!uploading) {
            e.currentTarget.style.borderColor = '#000000';
            e.currentTarget.style.backgroundColor = '#f8f9fa';
          }
        }}
      >
        {uploading ? (
          <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '120px' }}>
            <div className="spinner-border text-primary mb-2" role="status"></div>
            <span className="text-muted">Uploading...</span>
          </div>
        ) : (
          <>
            <i className="fas fa-cloud-upload-alt fa-3x text-secondary mb-3"></i>
            <h5 className="fw-bold mb-1">Drag & drop image here</h5>
            <p className="text-muted small mb-3">or click to browse — {helperText}</p>
            <button type="button" className="btn btn-outline-secondary rounded-pill px-4">Browse Files</button>
          </>
        )}
        <input
          type="file"
          ref={fileInputRef}
          className="d-none"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleImageUpload(e.target.files[0]);
            }
          }}
        />
      </div>

      <div className="input-group mb-2">
        <span className="input-group-text bg-light"><i className="fas fa-link"></i></span>
        <input
          type="text"
          className="form-control"
          value={value || ''}
          onChange={(e) => onChange(e.target.value, null)}
          placeholder="Or paste Image URL here"
        />
      </div>

      {value && (
        <div className="mt-3 bg-white border rounded p-3 text-center position-relative shadow-sm d-inline-block">
          <img
            src={getImageUrl(value)}
            alt="Preview"
            style={{ maxHeight: '150px', maxWidth: '100%', objectFit: 'contain' }}
            className="rounded"
          />
          <button
            type="button"
            className="btn btn-sm btn-danger position-absolute top-0 start-100 translate-middle rounded-circle shadow"
            onClick={(e) => {
              e.stopPropagation();
              onChange('', null);
            }}
            title="Remove Image"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
    </div>
  );
}