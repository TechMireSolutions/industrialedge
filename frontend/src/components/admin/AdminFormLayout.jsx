import React from 'react'

export default function AdminFormLayout({
  title,
  subtitle,
  onBack,
  onSave,
  onCancel,
  isSaving,
  saveText = 'Save',
  tabs = [],
  activeTab,
  onTabChange,
  children,
  error
}) {
  return (
    <div className="admin-form-page bg-light" style={{ minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Header */}
      <div className="container-fluid px-4 py-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div>
          <h2 className="mb-1 fw-bold text-primary" style={{ fontFamily: "'Outfit', sans-serif", fontSize: '24px' }}>{title}</h2>
          <p className="text-muted mb-0" style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>{subtitle}</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={onBack}>
          <i className="fas fa-arrow-left me-2"></i> Back
        </button>
      </div>

      {/* Tabs */}
      {tabs.length > 0 && (
        <div className="container-fluid px-4 mb-4" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
          <ul className="nav nav-tabs flex-nowrap" style={{ borderBottom: '2px solid #000000' }}>
            {tabs.map(tab => (
              <li className="nav-item" key={tab.id}>
                <button
                  className={`nav-link fw-bold px-4 py-3 ${activeTab === tab.id ? 'active' : ''}`}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '13px',
                    whiteSpace: 'nowrap',
                    ...(activeTab === tab.id
                      ? { color: 'var(--primary-color)', borderBottom: '2px solid #237B39', marginBottom: '-2px', backgroundColor: 'transparent', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }
                      : { color: '#6c757d', border: 'none', backgroundColor: 'transparent' })
                  }}
                  onClick={(e) => { e.preventDefault(); onTabChange(tab.id); }}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Content Card */}
      <div className="container-fluid px-4">
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
          <div className="card-body p-4 p-md-5">
            {error && <div className="alert alert-danger mb-4">{error}</div>}
            <div className="admin-form-content" style={{ fontFamily: "'Inter', sans-serif" }}>
              <style>
                {`
                   .admin-form-content label {font-family: 'Inter', sans-serif; font-size: 13px; color: black;}
                   .admin-form-content input, .admin-form-content select, .admin-form-content textarea { 
                    font-family: 'Inter', sans-serif; 
                    color: #000000;
                    border: 1px solid #000000; 
                    border-radius: 4px;
                    padding: 8px 12px;
                    outline: none;
                    transition: border-color 0.2s ease-in-out;
                  }
                   .admin-form-content .btn { font-family: 'Inter', sans-serif; }
                 `}
              </style>
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="position-fixed bottom-0 start-0 w-100 bg-white shadow-sm p-3 d-flex justify-content-end align-items-center" style={{ zIndex: 1000, borderTop: '1px solid #eee' }}>
        <button className="btn btn-light me-3 px-4" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary px-5" onClick={onSave} disabled={isSaving}>
          {isSaving ? (
            <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Saving...</>
          ) : saveText}
        </button>
      </div>
    </div>
  )
}
