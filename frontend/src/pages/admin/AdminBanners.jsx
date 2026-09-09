import { getImageUrl } from '../../utils/getImageUrl';
import { useConfirm } from '../../components/admin/ConfirmProvider.jsx'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useWow from '../../hooks/useWow.js'
import { adminApi } from '../../services'

export default function AdminBanners() {
  const confirm = useConfirm()
  const navigate = useNavigate()
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  useWow()

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    setLoading(true)
    try {
      const response = await adminApi.getBanners()
      setBanners(response.data)
    } catch (error) {
      console.error('Failed to fetch banners:', error)
    } finally {
      setLoading(false)
    }
  }

  // Modal logic has been moved to AdminBannerForm.jsx

  const handleDelete = async (id) => {
    if (!await confirm('Are you sure you want to delete this banner?')) return
    try {
      await adminApi.deleteBanner(id)
      fetchBanners()
    } catch (error) {
      toast.error(error.data?.message || 'Failed to delete banner')
    }
  }

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <span style={{ fontFamily: "Outfit", fontWeight: "800", fontSize: "24px" }}>Banners</span>
        </h4>
        <button className="btn btn-primary" onClick={() => navigate('/admin/banners/add')}>
          <i className="fas fa-plus me-2"></i> Add Banner
        </button>
      </div>

      <div className="bg-white rounded shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>IMAGE</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>TITLE</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>DISCOUNT</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>CTA</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>STATUS</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-4"><div className="spinner-border text-primary" role="status"></div></td></tr>
              ) : banners.length > 0 ? (
                banners.map((banner) => (
                  <tr key={banner.id}>
                    <td><img src={getImageUrl(banner.image)} alt={banner.title} style={{ width: 80, height: 50, objectFit: 'cover' }} className="rounded" /></td>
                    <td>{banner.title}</td>
                    <td>{banner.discount ? `${banner.discount}%` : '-'}</td>
                    <td>{banner.ctaText || '-'}</td>
                    <td><span className={`badge bg-${banner.active ? 'success' : 'secondary'}`}>{banner.active ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-primary" onClick={() => navigate(`/admin/banners/edit/${banner.id}`)} title="Edit"><i className="fas fa-edit"></i></button>
                        <button className="btn btn-outline-danger" onClick={() => handleDelete(banner.id)} title="Delete"><i className="fas fa-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="text-center py-4 text-muted">No banners found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Banner Modal moved to AdminBannerForm.jsx */}
    </div>
  )
}

