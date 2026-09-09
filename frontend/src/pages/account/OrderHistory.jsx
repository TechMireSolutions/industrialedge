import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/PageHeader.jsx'
import useWow from '../../hooks/useWow.js'
import { useAuth } from '../../context/AuthContext'
import { orderApi } from '../../services'

export default function OrderHistory() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [error, setError] = useState('')
  useWow()

  useEffect(() => {
    fetchOrders()
  }, [pagination.page])

  const fetchOrders = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await orderApi.getUserOrders(pagination.page, pagination.limit)
      setOrders(response.data)
      if (response.pagination) {
        setPagination(prev => ({ ...prev, total: response.pagination.total, totalPages: response.pagination.totalPages }))
      }
    } catch (err) {
      setError(err.data?.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: 'bg-warning',
      CONFIRMED: 'bg-info',
      PROCESSING: 'bg-primary',
      SHIPPED: 'bg-info',
      DELIVERED: 'bg-success',
      CANCELLED: 'bg-danger',
      REFUNDED: 'bg-secondary',
    }
    return badges[status] || 'bg-secondary'
  }

  const getPaymentStatusBadge = (status) => {
    const badges = {
      PENDING: 'bg-warning',
      PAID: 'bg-success',
      FAILED: 'bg-danger',
      REFUNDED: 'bg-secondary',
      PARTIALLY_REFUNDED: 'bg-info',
    }
    return badges[status] || 'bg-secondary'
  }

  return (
    <>
      <PageHeader title="Order History" crumb="Orders" />

      <div className="container-fluid bg-light py-5">
        <div className="container py-5">
          <div className="bg-white rounded p-4">
            {error && <div className="alert alert-danger alert-dismissible fade show" role="alert">{error}<button type="button" className="btn-close" data-bs-dismiss="alert"></button></div>}

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : orders.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Order Number</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Payment</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td><strong>{order.orderNumber}</strong></td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>{order.items?.length || 0} items</td>
                        <td className="fw-bold">${Number(order.total).toFixed(2)}</td>
                        <td><span className={`badge ${getStatusBadge(order.status)}`}>{order.status}</span></td>
                        <td><span className={`badge ${getPaymentStatusBadge(order.paymentStatus)}`}>{order.paymentStatus}</span></td>
                        <td>
                          <Link to={`/account/orders/${order.id}`} className="btn btn-sm btn-outline-primary">View</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5">
                <i className="fas fa-shopping-bag fa-3x text-muted mb-3"></i>
                <h5>No orders yet</h5>
                <p className="text-muted">Start shopping to see your order history</p>
                <Link to="/shop" className="btn btn-primary mt-3">Start Shopping</Link>
              </div>
            )}

            {pagination.totalPages > 1 && (
              <nav className="mt-4" aria-label="Order pagination">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                    <Link className="page-link" to={`?page=${pagination.page - 1}`} aria-label="Previous">
                      <span aria-hidden="true">&laquo;</span>
                    </Link>
                  </li>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <li key={page} className={`page-item ${pagination.page === page ? 'active' : ''}`}>
                      <Link className="page-link" to={`?page=${page}`}>{page}</Link>
                    </li>
                  ))}
                  <li className={`page-item ${pagination.page === pagination.totalPages ? 'disabled' : ''}`}>
                    <Link className="page-link" to={`?page=${pagination.page + 1}`} aria-label="Next">
                      <span aria-hidden="true">&raquo;</span>
                    </Link>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
