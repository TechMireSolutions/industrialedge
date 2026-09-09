import { useState, useEffect, useRef } from 'react'
import useWow from '../../hooks/useWow.js'
import { adminApi } from '../../services'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [lowStockProducts, setLowStockProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [pendingOrderCount, setPendingOrderCount] = useState(0)
  const [lastOrderCount, setLastOrderCount] = useState(0)
  const [showNotification, setShowNotification] = useState(false)
  const [lastNotificationOrder, setLastNotificationOrder] = useState(null)
  const audioRef = useRef(null)
  const intervalRef = useRef(null)

  useWow()

  // Audio context for notification sound
  useEffect(() => {
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUDA7bw0fFjRSmx5sLZdYgHVYDgyPgMAAA==')
    audioRef.current.volume = 0.5
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [statsResponse, ordersResponse, lowStockResponse] = await Promise.all([
          adminApi.getDashboard(),
          adminApi.getRecentOrders(5),
          adminApi.getLowStockProducts(10),
        ])
        setStats(statsResponse.data || null)
        setRecentOrders(ordersResponse.data || [])
        setLowStockProducts(lowStockResponse.data || [])

        // Check for new orders
        const currentPendingCount = statsResponse.data?.pendingOrders || 0
        setPendingOrderCount(currentPendingCount)

        // Check for new orders (compare with last known count)
        if (lastOrderCount > 0 && currentPendingCount > lastOrderCount) {
          // Play notification sound
          if (audioRef.current) {
            audioRef.current.play().catch(() => { })
          }
          // Show notification
          setShowNotification(true)
          setLastNotificationOrder(Date.now())
          // Auto-hide notification after 5 seconds
          setTimeout(() => setShowNotification(false), 5000)
        }
        setLastOrderCount(currentPendingCount)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Poll for new orders every 30 seconds
  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      try {
        // Fetch all polling data in a single Promise.all call
        const [statsResponsePoll, ordersResponsePoll, lowStockResponsePoll] = await Promise.all([
          adminApi.getDashboard(),
          adminApi.getRecentOrders(5),
          adminApi.getLowStockProducts(10),
        ])

        const currentPendingCount = statsResponsePoll.data?.pendingOrders || 0
        setPendingOrderCount(currentPendingCount)

        // Check for new orders
        if (lastOrderCount > 0 && currentPendingCount > lastOrderCount) {
          if (audioRef.current) {
            audioRef.current.play().catch(() => { })
          }
          setShowNotification(true)
          setLastNotificationOrder(Date.now())
          setTimeout(() => setShowNotification(false), 5000)
        }
        setLastOrderCount(currentPendingCount)

        // Update state with polled data
        setStats(statsResponsePoll.data || null)
        setRecentOrders(ordersResponsePoll.data || [])
        setLowStockProducts(lowStockResponsePoll.data || [])
      } catch (error) {
        console.error('Failed to fetch dashboard data during polling:', error)
      }
    }, 30000) // Poll every 30 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [lastOrderCount])

  // Hide notification after 5 seconds
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => setShowNotification(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [showNotification])

  // Initialize audio context on user interaction
  useEffect(() => {
    const initAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => { })
        document.removeEventListener('click', initAudio)
        document.removeEventListener('keydown', initAudio)
      }
    }
    document.addEventListener('click', initAudio)
    document.addEventListener('keydown', initAudio)
    return () => {
      document.removeEventListener('click', initAudio)
      document.removeEventListener('keydown', initAudio)
    }
  }, [])

  if (loading) {
    return (
      <div className="container-fluid py-5">
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {showNotification && (
        <div className="alert alert-success alert-dismissible fade show border-0 shadow-sm" role="alert">
          <i className="fas fa-check-circle me-2"></i>
          <strong>New Order Alert!</strong> You have new pending orders.
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowNotification(false)}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Greeting Banner */}
      <div className="mb-4 rounded-4 bg-primary" style={{ padding: '3rem 2.5rem', position: 'relative', overflow: 'hidden' }}>
        <div className="position-relative" style={{ zIndex: 1 }}>
          <p className="text-white-50 mb-1 fs-5">Good evening,</p>
          <h2 className="text-white fw-bold mb-3 display-6">Admin</h2>
          <p className="text-white-50 mb-0">Here's what's happening with your store today.</p>
        </div>
        <div className="position-absolute" style={{ right: '-50px', top: '-50px', width: '250px', height: '250px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.03)', zIndex: 0 }}></div>
        <div className="position-absolute" style={{ right: '150px', bottom: '-50px', width: '150px', height: '150px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.03)', zIndex: 0 }}></div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        {/* Total Orders */}
        <div className="col-12 col-md-6 col-xl-3">
          <div className="admin-card border-top-primary h-100">
            <div className="admin-card-body d-flex justify-content-between align-items-start">
              <div>
                <p className="text-muted small fw-bold text-uppercase mb-2">Total Orders</p>
                <h3 className="fw-bold mb-3 text-dark">{stats?.totalOrders ?? 0}</h3>
                <span className="badge bg-success-subtle text-success rounded-pill px-2 py-1 me-2"><i className="fas fa-arrow-up me-1"></i>+10%</span>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>vs last period</span>
              </div>
              <div className="admin-stat-icon bg-light text-primary">
                <i className="fas fa-shopping-bag"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="col-12 col-md-6 col-xl-3">
          <div className="admin-card border-top-warning h-100">
            <div className="admin-card-body d-flex justify-content-between align-items-start">
              <div>
                <p className="text-muted small fw-bold text-uppercase mb-2">Pending Orders</p>
                <h3 className="fw-bold mb-3 text-dark">{pendingOrderCount}</h3>
                <span className="badge bg-success-subtle text-success rounded-pill px-2 py-1 me-2"><i className="fas fa-arrow-up me-1"></i>+5%</span>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>vs last period</span>
              </div>
              <div className="admin-stat-icon bg-warning-subtle text-warning">
                <i className="fas fa-clock"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="col-12 col-md-6 col-xl-3">
          <div className="admin-card border-top-success h-100">
            <div className="admin-card-body d-flex justify-content-between align-items-start">
              <div>
                <p className="text-muted small fw-bold text-uppercase mb-2">Total Revenue</p>
                <h3 className="fw-bold mb-3 text-dark">Rs {stats?.totalRevenue ?? 0}</h3>
                <span className="badge bg-success-subtle text-success rounded-pill px-2 py-1 me-2"><i className="fas fa-arrow-up me-1"></i>+15%</span>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>vs last period</span>
              </div>
              <div className="admin-stat-icon bg-success-subtle text-success">
                <i className="fas fa-dollar-sign"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="col-12 col-md-6 col-xl-3">
          <div className="admin-card border-top-danger h-100">
            <div className="admin-card-body d-flex justify-content-between align-items-start">
              <div>
                <p className="text-muted small fw-bold text-uppercase mb-2">Low Stock Alerts</p>
                <h3 className="fw-bold mb-3 text-dark">{lowStockProducts.length}</h3>
                <span className="badge bg-danger-subtle text-danger rounded-pill px-2 py-1 me-2"><i className="fas fa-exclamation me-1"></i>Action Req</span>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>inventory</span>
              </div>
              <div className="admin-stat-icon bg-danger-subtle text-danger">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="row g-4">
        {/* Recent Orders */}
        <div className="col-lg-8">
          <div className="admin-card h-100">
            <div className="admin-card-header d-flex justify-content-between align-items-center">
              <h6 className="m-0 fw-bold text-dark">Recent Orders</h6>
              <button className="btn btn-sm btn-light border">View All</button>
            </div>
            <div className="admin-card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light text-muted small text-uppercase" style={{ letterSpacing: '0.05em' }}>
                    <tr>
                      <th className="px-4 py-3 border-0">Order ID</th>
                      <th className="py-3 border-0">Customer</th>
                      <th className="py-3 border-0">Status</th>
                      <th className="px-4 py-3 border-0 text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order) => (
                        <tr key={order.id || order._id}>
                          <td className="px-4 py-3 text-primary fw-medium">#{order.id || order._id}</td>
                          <td className="py-3 text-dark">{order.customerName || order.user?.name || 'N/A'}</td>
                          <td className="py-3">
                            <span className={`badge rounded-pill bg-${order.status === 'completed' ? 'success' : order.status === 'pending' ? 'warning' : 'secondary'}-subtle text-${order.status === 'completed' ? 'success' : order.status === 'pending' ? 'warning' : 'secondary'} px-3 py-2 border border-${order.status === 'completed' ? 'success' : order.status === 'pending' ? 'warning' : 'secondary'}-subtle`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-end fw-bold text-dark">Rs {order.totalAmount || order.total}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-5 text-muted">No recent orders</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="col-lg-4">
          <div className="admin-card h-100">
            <div className="admin-card-header">
              <h6 className="m-0 fw-bold text-dark">Low Stock Warnings</h6>
            </div>
            <div className="admin-card-body p-0">
              {lowStockProducts.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {lowStockProducts.map((product) => (
                    <li key={product.id || product._id} className="list-group-item px-4 py-3 d-flex justify-content-between align-items-center hover-bg-light transition">
                      <div>
                        <div className="fw-medium text-dark">{product.name || product.title}</div>
                        <small className="text-muted">ID: {product.id || product._id}</small>
                      </div>
                      <span className="badge rounded-pill bg-danger-subtle text-danger px-3 py-2 border border-danger-subtle">
                        {product.stock} left
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-5 text-muted">
                  <div className="bg-success-subtle text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 64, height: 64 }}>
                    <i className="fas fa-check fs-3"></i>
                  </div>
                  <div className="fw-medium">All stock levels healthy</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
