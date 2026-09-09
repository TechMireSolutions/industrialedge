import { useConfirm } from '../../components/admin/ConfirmProvider.jsx'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useWow from '../../hooks/useWow.js'
import { adminApi } from '../../services'

export default function AdminReviews() {
  const confirm = useConfirm()
  const navigate = useNavigate()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [filters, setFilters] = useState({ approved: 'all' })
  useWow()

  useEffect(() => {
    fetchReviews()
  }, [pagination.page, filters.approved])

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const response = await adminApi.getReviews({
        page: pagination.page,
        limit: pagination.limit,
        approved: filters.approved !== 'all' ? filters.approved : undefined,
      })
      setReviews(response.data)
      setPagination(prev => ({ ...prev, total: response.pagination.total, totalPages: response.pagination.totalPages }))
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // Inline approve/reject removed, use AdminReviewForm to edit

  const handleDelete = async (id) => {
    if (!await confirm('Are you sure you want to delete this review?')) return
    try {
      // Would need delete endpoint
      fetchReviews()
    } catch (error) {
      toast.error(error.data?.message || 'Failed to delete review')
    }
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page }))
    }
  }

  return (
    <div className="container-fluid p-4">
      <h4 className="mb-4">
        <span style={{ fontFamily: "Outfit", fontWeight: "800", fontSize: "24px" }}>Reviews</span>
      </h4>

      <div className="bg-white rounded shadow-sm mb-4">
        <div className="p-4 border-bottom">
          <div className="row g-3">
            <div className="col-md-3">
              <select className="form-select" value={filters.approved} onChange={(e) => handleFilterChange('approved', e.target.value)}>
                <option value="all">All Reviews</option>
                <option value="true">Approved</option>
                <option value="false">Pending</option>
              </select>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>PRODUCT</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>USER</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>RATING</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>TITLE</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>COMMENT</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>DATE</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>STATUS</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="text-center py-4"><div className="spinner-border text-primary" role="status"></div></td></tr>
              ) : reviews.length > 0 ? (
                reviews.map((review) => (
                  <tr key={review.id}>
                    <td>{review.product?.name || 'Unknown Product'}</td>
                    <td>{review.user?.name || 'Unknown User'}</td>
                    <td>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</td>
                    <td>{review.title}</td>
                    <td className="text-truncate" style={{ maxWidth: 300 }}>{review.comment}</td>
                    <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge bg-${review.approved ? 'success' : 'warning'}`}>
                        {review.approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-primary" onClick={() => navigate(`/admin/reviews/${review.id}`)} title="View Details"><i className="fas fa-eye"></i></button>
                        <button className="btn btn-outline-danger" onClick={() => handleDelete(review.id)} title="Delete"><i className="fas fa-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="8" className="text-center py-4 text-muted">No reviews found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {pagination.totalPages > 1 && (
          <div className="p-4 border-top">
            <nav aria-label="Reviews pagination">
              <ul className="pagination justify-content-center mb-0">
                <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(pagination.page - 1)}>&laquo;</button>
                </li>
                {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                  let pageNum
                  if (pagination.totalPages <= 5) pageNum = i + 1
                  else if (pagination.page <= 3) pageNum = i + 1
                  else if (pagination.page >= pagination.totalPages - 2) pageNum = pagination.totalPages - 4 + i
                  else pageNum = pagination.page - 2 + i
                  return (
                    <li key={pageNum} className={`page-item ${pagination.page === pageNum ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => handlePageChange(pageNum)}>{pageNum}</button>
                    </li>
                  )
                })}
                <li className={`page-item ${pagination.page === pagination.totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(pagination.page + 1)}>&raquo;</button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}
