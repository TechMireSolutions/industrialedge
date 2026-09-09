import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useWow from '../../hooks/useWow.js'
import { adminApi, productApi, categoryApi } from '../../services'

export default function AdminProducts() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [search, setSearch] = useState('')
  const [showImportModal, setShowImportModal] = useState(false)
  const [importFile, setImportFile] = useState(null)
  const [importing, setImporting] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)
  useWow()

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [pagination.page, search])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await productApi.getAll({
        page: pagination.page,
        limit: pagination.limit,
        search: search || undefined,
      })
      setProducts(response.data)
      setPagination(prev => ({ ...prev, total: response.pagination.total, totalPages: response.pagination.totalPages }))
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAll(true)
      setCategories(response.data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      await adminApi.deleteProduct(id)
      toast.success('Product deleted successfully')
      fetchProducts()
    } catch (error) {
      toast.error(error.data?.message || 'Failed to delete product')
    }
  }

  const handleFileSelect = (file) => {
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv' && file.type !== 'application/vnd.ms-excel') {
      toast.error('Please select a valid .csv file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds the 5MB limit')
      return
    }
    setImportFile(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleDownloadTemplate = () => {
    const csvContent = [
      'name,slug,description,shortDescription,category,price,oldPrice,shippingPrice,sku,stock,badge,images',
      '"Industrial Pro Drill","industrial-pro-drill","High durability industrial brushless drill","Brushless Drill","Tools",149.99,179.99,0,"SKU-DRL-001",45,"new","https://images.unsplash.com/photo-1504148455328-c376907d081c"',
      '"Safety Goggles Pro","safety-goggles-pro","ANSI Z87.1 certified eye protection","Safety Goggles","Safety",24.99,29.99,0,"SKU-SFT-002",120,"sale","https://images.unsplash.com/photo-1584308666744-24d5c474f2ae"'
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'products_template.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('Template CSV downloaded')
  }

  const handleImportSubmit = async (e) => {
    e.preventDefault()
    if (!importFile) return
    setImporting(true)
    try {
      const formData = new FormData()
      formData.append('file', importFile)
      const res = await adminApi.importProducts(formData)
      const successCount = res.data?.successCount ?? 0
      const failureCount = res.data?.failureCount ?? 0
      toast.success(`Import complete: ${successCount} succeeded, ${failureCount} failed.`)
      setShowImportModal(false)
      fetchProducts()
    } catch (error) {
      toast.error(error.data?.message || 'Failed to import CSV')
    } finally {
      setImporting(false)
      setImportFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
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
          <span style={{ fontFamily: "Outfit", fontWeight: "800", fontSize: "24px" }}>Products</span>
        </h4>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={() => { setImportFile(null); setShowImportModal(true); }}>
            <i className="fas fa-file-import me-2"></i> Import CSV
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/admin/products/add')}>
            <i className="fas fa-plus me-2"></i> Add Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow-sm mb-4">
        <div className="p-4 border-bottom">
          <div className="input-group" style={{ maxWidth: 400 }}>
            <input type="text" className="form-control" placeholder="Search products..." value={search} onChange={handleSearch} />
            <span className="input-group-text"><i className="fas fa-search"></i></span>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>IMAGE</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>NAME</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>CATEGORY</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>PRICE</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>STOCK</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>STATUS</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-4"><div className="spinner-border text-primary" role="status"></div></td></tr>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id}>
                    <td><img src={getImageUrl(product.images?.[0] || '')} alt={product.name} style={{ width: 50, height: 50, objectFit: 'cover' }} className="rounded" /></td>
                    <td>{product.name}</td>
                    <td>{product.category?.name}</td>
                    <td>${Number(product.price).toFixed(2)}</td>
                    <td><span className={product.stock > 10 ? 'text-success' : product.stock > 0 ? 'text-warning' : 'text-danger'}>{product.stock}</span></td>
                    <td><span className={`badge bg-${product.active ? 'success' : 'secondary'}`}>{product.active ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-primary" onClick={() => navigate(`/admin/products/edit/${product.id}`)} title="Edit"><i className="fas fa-edit"></i></button>
                        <button className="btn btn-outline-danger" onClick={() => handleDelete(product.id)} title="Delete"><i className="fas fa-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" className="text-center py-4 text-muted">No products found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {pagination.totalPages > 1 && (
          <div className="p-4 border-top">
            <nav aria-label="Products pagination">
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

      {showImportModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleImportSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Import Products from CSV</h5>
                  <button type="button" className="btn-close" onClick={() => { setShowImportModal(false); setImportFile(null); }}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <h5 className="fw-bold text-dark mb-1">Product CSV File</h5>
                    <p className="text-muted small mb-0">
                      Upload your product CSV for bulk import.
                    </p>
                  </div>

                  {!importFile ? (
                    <div
                      className="border rounded p-5 text-center mb-4 position-relative"
                      style={{
                        borderStyle: 'dashed',
                        borderWidth: '2px',
                        borderColor: isDragOver ? '#237B39' : '#000000',
                        backgroundColor: isDragOver ? '#f1f8f3' : '#f8f9fa',
                        cursor: importing ? 'not-allowed' : 'pointer',
                        transition: 'border-color 0.2s, background-color 0.2s'
                      }}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => !importing && fileInputRef.current?.click()}
                      onMouseEnter={(e) => {
                        if (!importing && !isDragOver) {
                          e.currentTarget.style.borderColor = '#237B39';
                          e.currentTarget.style.backgroundColor = '#f1f8f3';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!importing && !isDragOver) {
                          e.currentTarget.style.borderColor = '#000000';
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                        }
                      }}
                    >
                      {importing ? (
                        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '120px' }}>
                          <div className="spinner-border text-primary mb-2" role="status"></div>
                          <span className="text-muted">Importing products, please wait...</span>
                        </div>
                      ) : (
                        <>
                          <i className="fas fa-file-csv fa-3x text-secondary mb-3"></i>
                          <h5 className="fw-bold mb-1">Drag & drop CSV file here</h5>
                          <p className="text-muted small mb-3">or click to browse — CSV files up to 5MB</p>
                          <button type="button" className="btn btn-outline-secondary rounded-pill px-4">Browse Files</button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="border rounded p-3 mb-4 bg-light d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className="bg-success text-white rounded p-3 me-3 d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
                          <i className="fas fa-file-csv fa-2x"></i>
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{importFile.name}</div>
                          <div className="text-muted small">{(importFile.size / 1024).toFixed(1)} KB</div>
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={importing}
                        >
                          <i className="fas fa-redo me-1"></i> Replace
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => { setImportFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                          disabled={importing}
                        >
                          <i className="fas fa-times me-1"></i> Remove
                        </button>
                      </div>
                    </div>
                  )}

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="d-none"
                    accept=".csv,text/csv"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileSelect(e.target.files[0]);
                      }
                    }}
                  />

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fw-bold text-dark small">Format Requirements:</span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={handleDownloadTemplate}
                    >
                      <i className="fas fa-download me-1"></i> Download Template CSV
                    </button>
                  </div>

                  <div className="alert alert-info py-2 px-3 small mb-0">
                    <div><strong>Required columns:</strong> <code>name, price, category</code></div>
                    <div><strong>Optional columns:</strong> <code>description, shortDescription, oldPrice, shippingPrice, sku, slug, stock, badge, images</code></div>
                    <div className="text-muted mt-1">Multiple images should be separated by commas.</div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => { setShowImportModal(false); setImportFile(null); }} disabled={importing}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={!importFile || importing}>
                    {importing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Importing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-upload me-1"></i> Upload & Import
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

