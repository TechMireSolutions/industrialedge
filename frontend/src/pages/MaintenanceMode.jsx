import { getImageUrl } from '../utils/getImageUrl';
import { useSettings } from '../context/SettingsContext';

export default function MaintenanceMode() {
  const { settings } = useSettings();
  const siteName = settings?.general?.siteName || 'Our Store';
  const logoUrl = settings?.branding?.mainLogo?.storagePath || settings?.branding?.mainLogoId;

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light text-center px-4">
      <div className="mb-4">
        {logoUrl ? (
          <img src={getImageUrl(logoUrl)} alt={siteName} style={{ maxHeight: '80px', objectFit: 'contain' }} />
        ) : (
          <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: 80, height: 80 }}>
            <i className="fas fa-bolt text-white fa-2x"></i>
          </div>
        )}
      </div>
      <h1 className="display-4 fw-bold text-dark mb-3">We'll be back soon!</h1>
      <p className="fs-5 text-muted mb-5" style={{ maxWidth: '600px' }}>
        {siteName} is currently undergoing scheduled maintenance to improve your experience. We apologize for the inconvenience and appreciate your patience.
      </p>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

