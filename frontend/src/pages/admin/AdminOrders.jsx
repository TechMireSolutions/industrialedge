import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useWow from '../../hooks/useWow.js'
import { adminApi, orderApi } from '../../services'

export default function AdminOrders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [filters, setFilters] = useState({ status: '', paymentStatus: '', search: '' })
  useWow()

  useEffect(() => {
    fetchOrders()
  }, [pagination.page, filters.status, filters.paymentStatus, filters.search])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await adminApi.getOrders({
        page: pagination.page,
        limit: pagination.limit,
        status: filters.status || undefined,
        paymentStatus: filters.paymentStatus || undefined,
        search: filters.search || undefined,
      })
      setOrders(response.data)
      setPagination(prev => ({ ...prev, total: response.pagination.total, totalPages: response.pagination.totalPages }))
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminApi.updateOrderStatus(orderId, newStatus)
      fetchOrders()
    } catch (error) {
      toast.error(error.data?.message || 'Failed to update order status')
    }
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page }))
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'warning',
      CONFIRMED: 'info',
      PROCESSING: 'primary',
      SHIPPED: 'info',
      DELIVERED: 'success',
      CANCELLED: 'danger',
      REFUNDED: 'secondary',
    }
    return colors[status] || 'secondary'
  }

  const getPaymentColor = (status) => {
    const colors = {
      PENDING: 'warning',
      PAID: 'success',
      FAILED: 'danger',
      REFUNDED: 'secondary',
      PARTIALLY_REFUNDED: 'info',
    }
    return colors[status] || 'secondary'
  }

  return (
    <div className="container-fluid p-4">
      <h4 className="mb-4">
        <span style={{ fontFamily: "Outfit", fontWeight: "800", fontSize: "24px" }}>Orders</span>
      </h4>

      <div className="bg-white rounded shadow-sm mb-4">
        <div className="p-4 border-bottom">
          <div className="row g-3">
            <div className="col-md-3">
              <select className="form-select" value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select" value={filters.paymentStatus} onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}>
                <option value="">All Payment Status</option>
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="FAILED">Failed</option>
                <option value="REFUNDED">Refunded</option>
                <option value="PARTIALLY_REFUNDED">Partially Refunded</option>
              </select>
            </div>
            <div className="col-md-4">
              <input type="text" className="form-control" placeholder="Search orders..." value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} />
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>ORDER #</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>CUSTOMER</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>DATE</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>STATUS</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>PAYMENT</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>TOTAL</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-4"><div className="spinner-border text-primary" role="status"></div></td></tr>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td><strong>{order.orderNumber}</strong></td>
                    <td>{order.user?.name || 'Guest'}<br /><small className="text-muted">{order.user?.email}</small></td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <select className="form-select form-select-sm" value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)}>
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="REFUNDED">Refunded</option>
                      </select>
                    </td>
                    <td><span className={`badge bg-${getPaymentColor(order.paymentStatus)}`}>{order.paymentStatus}</span></td>
                    <td className="fw-bold">{Number(order.total).toFixed(2)}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/admin/orders/${order.id}`)} title="View Details">
                        <i className="fas fa-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" className="text-center py-4 text-muted">No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {pagination.totalPages > 1 && (
          <div className="p-4 border-top">
            <nav aria-label="Orders pagination">
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

      {/* Order Detail Modal moved to AdminOrderDetails.jsx */}
    </div>
  )
}
