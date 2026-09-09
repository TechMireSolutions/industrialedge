import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminFormLayout from '../../components/admin/AdminFormLayout'
import { adminApi } from '../../services'

export default function AdminOrderDetails() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [activeTab, setActiveTab] = useState('summary')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [globalError, setGlobalError] = useState('')
  
  const [order, setOrder] = useState(null)
  
  // Editable fields for an order (usually just status)
  const [formData, setFormData] = useState({
    status: 'PENDING'
  })

  useEffect(() => {
    fetchOrder()
  }, [id])

  const fetchOrder = async () => {
    try {
      const response = await adminApi.getOrder(id)
      setOrder(response.data)
      setFormData({
        status: response.data.status || 'PENDING'
      })
    } catch (error) {
      console.error('Failed to fetch order:', error)
      setGlobalError('Failed to load order details.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setGlobalError('')
    setSubmitting(true)
    try {
      await adminApi.updateOrderStatus(id, formData.status)
      navigate('/admin/orders')
    } catch (error) {
      setGlobalError(error.data?.message || 'Failed to update order status')
      setSubmitting(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = { PENDING: 'warning', CONFIRMED: 'info', PROCESSING: 'primary', SHIPPED: 'info', DELIVERED: 'success', CANCELLED: 'danger', REFUNDED: 'secondary' }
    return colors[status] || 'secondary'
  }

  const getPaymentColor = (status) => {
    const colors = { PENDING: 'warning', PAID: 'success', FAILED: 'danger', REFUNDED: 'secondary', PARTIALLY_REFUNDED: 'info' }
    return colors[status] || 'secondary'
  }

  const tabs = [
    { id: 'summary', label: 'Order Summary' },
    { id: 'items', label: 'Order Items' },
    { id: 'billing', label: 'Billing & Shipping' }
  ]

  if (loading || !order) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    )
  }

  return (
    <AdminFormLayout
      title={`Order ${order.orderNumber}`}
      subtitle="View order details and update fulfillment status"
      onBack={() => navigate('/admin/orders')}
      onSave={handleSave}
      onCancel={() => navigate('/admin/orders')}
      isSaving={submitting}
      saveText="Update Status"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      error={globalError}
    >
      <form onSubmit={(e) => e.preventDefault()}>
        {/* Summary Tab */}
        <div style={{ display: activeTab === 'summary' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-md-6">
              <h5 className="mb-3">Order Information</h5>
              <table className="table table-borderless table-sm">
                <tbody>
                  <tr><th className="ps-0" style={{width: '40%'}}>Order Number</th><td>{order.orderNumber}</td></tr>
                  <tr><th className="ps-0">Date Placed</th><td>{new Date(order.createdAt).toLocaleString()}</td></tr>
                  <tr><th className="ps-0">Payment Method</th><td>{order.paymentMethod?.replace('_', ' ')}</td></tr>
                  <tr><th className="ps-0">Payment Status</th><td><span className={`badge bg-${getPaymentColor(order.paymentStatus)}`}>{order.paymentStatus}</span></td></tr>
                </tbody>
              </table>
            </div>
            
            <div className="col-md-6">
              <h5 className="mb-3">Update Status</h5>
              <div className="mb-3">
                <label className="form-label fw-bold">Order Fulfillment Status</label>
                <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
                <div className="form-text mt-2">
                  Current Status: <span className={`badge bg-${getStatusColor(order.status)}`}>{order.status}</span>
                </div>
              </div>
            </div>

            <div className="col-12 mt-4 border-top pt-4">
              <h5 className="mb-3">Financial Summary</h5>
              <div className="row">
                <div className="col-md-4">
                  <div className="card bg-light border-0">
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Subtotal:</span>
                        <span>${Number(order.subtotal).toFixed(2)}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="d-flex justify-content-between mb-2 text-success">
                          <span>Discount:</span>
                          <span>-${Number(order.discount).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="d-flex justify-content-between mb-2">
                        <span>Shipping:</span>
                        <span>${Number(order.shipping).toFixed(2)}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="d-flex justify-content-between fw-bold fs-5">
                        <span>Total:</span>
                        <span>${Number(order.total).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items Tab */}
        <div style={{ display: activeTab === 'items' ? 'block' : 'none' }}>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="fw-bold">{item.productName}</div>
                      {item.sku && <small className="text-muted">SKU: {item.sku}</small>}
                    </td>
                    <td>${Number(item.price).toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td className="fw-bold">${Number(item.total).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Billing Tab */}
        <div style={{ display: activeTab === 'billing' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-md-6">
              <h5 className="mb-3">Customer Account</h5>
              <div className="card border-0 bg-light p-3">
                <div className="fw-bold">{order.user?.name || 'Guest User'}</div>
                <div>{order.user?.email}</div>
                {order.user?.phone && <div>Phone: {order.user.phone}</div>}
              </div>
            </div>
            <div className="col-md-6">
              <h5 className="mb-3">Billing Address</h5>
              {order.billingAddress ? (
                <div className="card border-0 bg-light p-3">
                  <div className="fw-bold">{order.billingAddress.firstName} {order.billingAddress.lastName}</div>
                  {order.billingAddress.company && <div>{order.billingAddress.company}</div>}
                  <div>{order.billingAddress.address}</div>
                  <div>{order.billingAddress.city}, {order.billingAddress.country} {order.billingAddress.postalCode}</div>
                  <div className="mt-2 text-muted">
                    <div>Phone: {order.billingAddress.phone}</div>
                    <div>Email: {order.billingAddress.email}</div>
                  </div>
                </div>
              ) : (
                <div className="text-muted fst-italic">No billing address provided.</div>
              )}
            </div>
          </div>
        </div>
      </form>
    </AdminFormLayout>
  )
}
