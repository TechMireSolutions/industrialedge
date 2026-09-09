import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminFormLayout from '../../components/admin/AdminFormLayout'
import { adminApi } from '../../services'

export default function AdminReviewForm() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [activeTab, setActiveTab] = useState('details')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [globalError, setGlobalError] = useState('')
  
  const [review, setReview] = useState(null)
  const [formData, setFormData] = useState({
    approved: false
  })

  useEffect(() => {
    fetchReview()
  }, [id])

  const fetchReview = async () => {
    try {
      const response = await adminApi.getReview(id)
      setReview(response.data)
      setFormData({
        approved: Boolean(response.data.approved)
      })
    } catch (error) {
      console.error('Failed to fetch review:', error)
      setGlobalError('Failed to load review details.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const handleSave = async () => {
    setGlobalError('')
    setSubmitting(true)
    try {
      if (formData.approved && !review.approved) {
        await adminApi.approveReview(id)
      } else if (!formData.approved && review.approved) {
        await adminApi.rejectReview(id)
      }
      navigate('/admin/reviews')
    } catch (error) {
      setGlobalError(error.data?.message || 'Failed to update review status')
      setSubmitting(false)
    }
  }

  const tabs = [
    { id: 'details', label: 'Review Details' },
    { id: 'status', label: 'Moderation' }
  ]

  if (loading || !review) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    )
  }

  return (
    <AdminFormLayout
      title="View Review"
      subtitle="Read customer review and manage approval status"
      onBack={() => navigate('/admin/reviews')}
      onSave={handleSave}
      onCancel={() => navigate('/admin/reviews')}
      isSaving={submitting}
      saveText="Save Changes"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      error={globalError}
    >
      <form onSubmit={(e) => e.preventDefault()}>
        {/* Details Tab */}
        <div style={{ display: activeTab === 'details' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-md-6">
              <h6 className="fw-bold mb-3">Product Information</h6>
              <div className="card bg-light border-0 p-3 mb-4">
                <div className="fw-bold">{review.product?.name || 'Unknown Product'}</div>
                {review.product?.sku && <div className="text-muted small">SKU: {review.product.sku}</div>}
              </div>

              <h6 className="fw-bold mb-3">Customer Information</h6>
              <div className="card bg-light border-0 p-3">
                <div className="fw-bold">{review.user?.name || 'Unknown User'}</div>
                <div className="text-muted small">{review.user?.email}</div>
              </div>
            </div>

            <div className="col-md-6">
              <h6 className="fw-bold mb-3">Review Content</h6>
              <div className="card border-0 shadow-sm p-4 h-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="text-warning fs-5">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </div>
                  <small className="text-muted">{new Date(review.createdAt).toLocaleDateString()}</small>
                </div>
                <h5 className="fw-bold">{review.title}</h5>
                <p style={{ whiteSpace: 'pre-wrap' }}>{review.comment}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Tab */}
        <div style={{ display: activeTab === 'status' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-md-12">
              <div className="form-check form-switch fs-5">
                <input type="checkbox" className="form-check-input" name="approved" checked={formData.approved} onChange={handleChange} id="approved" />
                <label className="form-check-label text-success fw-bold ms-2" htmlFor="approved">Review is Approved</label>
              </div>
              <div className="form-text mt-2">
                Approved reviews will be visible to all customers on the product page.
                Pending (unapproved) reviews are hidden.
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminFormLayout>
  )
}
