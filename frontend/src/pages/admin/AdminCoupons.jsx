import { useConfirm } from '../../components/admin/ConfirmProvider.jsx'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useWow from '../../hooks/useWow.js'
import { adminApi } from '../../services'

export default function AdminCoupons() {
  const confirm = useConfirm()
  const navigate = useNavigate()
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  useWow()

  useEffect(() => {
    fetchCoupons()
  }, [pagination.page])

  const fetchCoupons = async () => {
    setLoading(true)
    try {
      const response = await adminApi.getCoupons(pagination.page, pagination.limit)
      setCoupons(response.data)
      setPagination(prev => ({ ...prev, total: response.pagination.total, totalPages: response.pagination.totalPages }))
    } catch (error) {
      console.error('Failed to fetch coupons:', error)
    } finally {
      setLoading(false)
    }
  }

  // Modal logic has been moved to AdminCouponForm.jsx

  const handleDelete = async (id) => {
    if (!await confirm('Are you sure you want to delete this coupon?')) return
    try {
      await adminApi.deleteCoupon(id)
      fetchCoupons()
    } catch (error) {
      toast.error(error.data?.message || 'Failed to delete coupon')
    }
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page }))
    }
  }

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <span style={{ fontFamily: "Outfit", fontWeight: "800", fontSize: "24px" }}>Coupons</span>
        </h4>
        <button className="btn btn-primary" onClick={() => navigate('/admin/coupons/add')}>
          <i className="fas fa-plus me-2"></i> Add Coupon
        </button>
      </div>

      <div className="bg-white rounded shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>CODE</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>TYPE</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>VALUE</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>MIN ORDER</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>MAX DISCOUNT</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>USAGE</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>EXPIRY</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>STATUS</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="9" className="text-center py-4"><div className="spinner-border text-primary" role="status"></div></td></tr>
              ) : coupons.length > 0 ? (
                coupons.map((coupon) => (
                  <tr key={coupon.id}>
                    <td><code>{coupon.code}</code></td>
                    <td>{coupon.type === 'PERCENTAGE' ? '%' : '$'}</td>
                    <td>{coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : `$${Number(coupon.value).toFixed(2)}`}</td>
                    <td>{coupon.minimumOrder ? `$${Number(coupon.minimumOrder).toFixed(2)}` : '-'}</td>
                    <td>{coupon.maximumDiscount ? `$${Number(coupon.maximumDiscount).toFixed(2)}` : '-'}</td>
                    <td>{coupon.usageCount}/{coupon.usageLimit || '∞'}</td>
                    <td>{coupon.expiry ? new Date(coupon.expiry).toLocaleDateString() : 'Never'}</td>
                    <td><span className={`badge bg-${coupon.active ? 'success' : 'secondary'}`}>{coupon.active ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-primary" onClick={() => navigate(`/admin/coupons/edit/${coupon.id}`)} title="Edit"><i className="fas fa-edit"></i></button>
                        <button className="btn btn-outline-danger" onClick={() => handleDelete(coupon.id)} title="Delete"><i className="fas fa-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="9" className="text-center py-4 text-muted">No coupons found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {pagination.totalPages > 1 && (
          <div className="p-4 border-top">
            <nav aria-label="Coupons pagination">
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
