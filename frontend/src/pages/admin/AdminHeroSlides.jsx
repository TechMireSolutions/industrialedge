import { useConfirm } from '../../components/admin/ConfirmProvider.jsx'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useWow from '../../hooks/useWow.js'
import { adminApi } from '../../services'

export default function AdminHeroSlides() {
  const confirm = useConfirm()
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useWow()

  useEffect(() => {
    fetchSlides()
  }, [])

  const fetchSlides = async () => {
    setLoading(true)
    try {
      const response = await adminApi.getHeroSlides()
      setSlides(response.data)
    } catch (error) {
      console.error('Failed to fetch hero slides:', error)
    } finally {
      setLoading(false)
    }
  }

  // Modal methods removed since we now use AdminHeroSlideForm

  const handleDelete = async (id) => {
    if (!await confirm('Are you sure you want to delete this hero slide?')) return
    try {
      await adminApi.deleteHeroSlide(id)
      fetchSlides()
    } catch (error) {
      toast.error(error.data?.message || 'Failed to delete hero slide')
    }
  }

  const handleReorder = (e) => {
    if (slides.length <= 1) return

    const ids = Array.from(e.target.querySelectorAll('[data-id]')).map(el => el.dataset.id)
    if (ids.length === 0) return

    adminApi.reorderHeroSlides(ids)
    fetchSlides()
  }

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <span style={{ fontFamily: "Outfit", fontWeight: "800", fontSize: "24px" }}>Hero Slides</span>
        </h4>
        <button className="btn btn-primary" onClick={() => navigate('/admin/hero-slides/add')}>
          <i className="fas fa-plus me-2"></i> Add Slide
        </button>
      </div>

      <div className="bg-white rounded shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>ORDER</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>IMAGE</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>TITLE</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>STATUS</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody onDragEnd={handleReorder}>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-4"><div className="spinner-border text-primary" role="status"></div></td></tr>
              ) : slides.length > 0 ? (
                slides.map((slide, index) => (
                  <tr key={slide.id} data-id={slide.id} draggable={slides.length > 1}>
                    <td>
                      <input type="number" className="form-control form-control-sm" value={slide.ordering} onChange={(e) => {
                        const newOrdering = parseInt(e.target.value)
                        const updated = [...slides]
                        updated[index] = { ...updated[index], ordering: newOrdering }
                        setSlides(updated)
                      }} disabled={slides.length <= 1} />
                    </td>
                    <td>
                      {slide.image ? (
                        <img src={getImageUrl(slide.image)} alt={slide.imageAlt || 'Slide'} style={{ width: 80, height: 50, objectFit: 'cover' }} className="rounded" />
                      ) : (
                        <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: 80, height: 50 }}>
                          <i className="fas fa-image text-muted"></i>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="fw-bold">{slide.titleLine1} {slide.titleLine2}</div>
                      <small className="text-primary">{slide.titleLine3}</small>
                    </td>
                    <td><span className={`badge bg-${slide.active ? 'success' : 'secondary'}`}>{slide.active ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-primary" onClick={() => navigate(`/admin/hero-slides/edit/${slide.id}`)} title="Edit"><i className="fas fa-edit"></i></button>
                        <button className="btn btn-outline-danger" onClick={() => handleDelete(slide.id)} title="Delete"><i className="fas fa-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="text-center py-4 text-muted">No hero slides found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal moved to AdminHeroSlideForm */}
    </div>
  )
}
