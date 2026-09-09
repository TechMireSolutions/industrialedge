import { getImageUrl } from '../../utils/getImageUrl';
import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader.jsx'
import useWow from '../../hooks/useWow.js'
import { orderApi } from '../../services'

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useWow()

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await orderApi.getOrder(id)
        setOrder(response.data)
      } catch (err) {
        setError(err.data?.message || 'Order not found')
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id])

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

  if (error) {
    return (
      <>
        <PageHeader title="Order Not Found" crumb="Order" />
        <div className="container-fluid py-5">
          <div className="container py-5 text-center">
            <div className="alert alert-danger">{error}</div>
            <Link to="/account/orders" className="btn btn-primary">Back to Orders</Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader title={`Order ${order.orderNumber}`} crumb="Order Detail" />

      <div className="container-fluid bg-light py-5">
        <div className="container py-5">
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="bg-white rounded p-4 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="mb-0">Order Summary</h4>
                  <div>
                    <span className={`badge ${getStatusBadge(order.status)} me-2`}>{order.status}</span>
                    <span className={`badge ${getPaymentStatusBadge(order.paymentStatus)}`}>{order.paymentStatus}</span>
                  </div>
                </div>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Order Number:</strong> {order.orderNumber}</p>
                    <p className="mb-1"><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p className="mb-1"><strong>Payment Method:</strong> {order.paymentMethod?.replace('_', ' ')}</p>
                  </div>
                  <div className="col-md-6">
                    {order.paidAt && <p className="mb-1"><strong>Paid At:</strong> {new Date(order.paidAt).toLocaleString()}</p>}
                    {order.notes && <p className="mb-1"><strong>Notes:</strong> {order.notes}</p>}
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items?.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <img src={getImageUrl(item.product?.images?.[0] || `${import.meta.env.BASE_URL}img/product-1.png`)} alt={item.productName} style={{ width: 50, height: 50, objectFit: 'cover' }} className="rounded me-3" />
                              <Link to={`/product/${item.product?.slug}`}>{item.productName}</Link>
                            </div>
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

              <div className="bg-white rounded p-4 mb-4">
                <h4 className="mb-3">Billing Address</h4>
                <address className="mb-0">
                  {order.billingAddress?.firstName} {order.billingAddress?.lastName}<br />
                  {order.billingAddress?.company && `${order.billingAddress.company}<br />`}
                  {order.billingAddress?.address}<br />
                  {order.billingAddress?.city}, {order.billingAddress?.country} {order.billingAddress?.postalCode}<br />
                  Phone: {order.billingAddress?.phone}<br />
                  Email: {order.billingAddress?.email}
                </address>
              </div>

              {order.shippingAddress && (
                <div className="bg-white rounded p-4 mb-4">
                  <h4 className="mb-3">Shipping Address</h4>
                  <address className="mb-0">
                    {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}<br />
                    {order.shippingAddress?.company && `${order.shippingAddress.company}<br />`}
                    {order.shippingAddress?.address}<br />
                    {order.shippingAddress?.city}, {order.shippingAddress?.country} {order.shippingAddress?.postalCode}<br />
                    Phone: {order.shippingAddress?.phone}
                  </address>
                </div>
              )}
            </div>

            <div className="col-lg-4">
              <div className="bg-white rounded p-4 sticky-top" style={{ top: 100 }}>
                <h4 className="mb-3">Order Totals</h4>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal ({order.items?.length || 0} items)</span>
                  <span>${Number(order.subtotal).toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="d-flex justify-content-between mb-2 text-success">
                    <span>Discount</span>
                    <span>-${Number(order.discount).toFixed(2)}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping</span>
                  <span>${Number(order.shipping).toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold fs-5">
                  <span>Total</span>
                  <span>${Number(order.total).toFixed(2)}</span>
                </div>
                <Link to="/account/orders" className="btn btn-outline-primary w-100 mt-3 mb-4">
                  <i className="fas fa-arrow-left me-2"></i> Back to Orders
                </Link>

                <h5 className="mb-3">Order Timeline</h5>
                {order.statusHistory && order.statusHistory.length > 0 ? (
                  <div className="position-relative border-start border-2 border-primary ms-3">
                    {order.statusHistory.map((history, index) => (
                      <div key={history.id} className="position-relative mb-3 ps-4">
                        <div className="position-absolute top-0 start-0 translate-middle p-2 bg-primary rounded-circle" style={{ width: 15, height: 15, marginLeft: '-1px' }}></div>
                        <div className="fw-bold">{history.status}</div>
                        <div className="text-muted small">{new Date(history.createdAt).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted small">No timeline available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

