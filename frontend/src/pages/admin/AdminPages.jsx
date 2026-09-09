import { useConfirm } from '../../components/admin/ConfirmProvider.jsx'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useWow from '../../hooks/useWow.js'
import { adminApi } from '../../services'

export default function AdminPages() {
  const confirm = useConfirm()
  const navigate = useNavigate()
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  useWow()

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    setLoading(true)
    try {
      const response = await adminApi.getPages()
      setPages(response.data)
    } catch (error) {
      console.error('Failed to fetch pages:', error)
    } finally {
      setLoading(false)
    }
  }

  // Modal logic has been moved to AdminPageForm.jsx

  const handleDelete = async (id) => {
    if (!await confirm('Are you sure you want to delete this page?')) return
    try {
      await adminApi.deletePage(id)
      fetchPages()
    } catch (error) {
      toast.error(error.data?.message || 'Failed to delete page')
    }
  }

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <span style={{ fontFamily: "Outfit", fontWeight: "800", fontSize: "24px" }}>Pages</span>
        </h4>
        <button className="btn btn-primary" onClick={() => navigate('/admin/pages/add')}>
          <i className="fas fa-plus me-2"></i> Add Page
        </button>
      </div>

      <div className="bg-white rounded shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>TITLE</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>SLUG</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>STATUS</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>CREATED</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-4"><div className="spinner-border text-primary" role="status"></div></td></tr>
              ) : pages.length > 0 ? (
                pages.map((page) => (
                  <tr key={page.id}>
                    <td>{page.title}</td>
                    <td><code>{page.slug}</code></td>
                    <td><span className={`badge bg-${page.active ? 'success' : 'secondary'}`}>{page.active ? 'Active' : 'Inactive'}</span></td>
                    <td>{new Date(page.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-primary" onClick={() => navigate(`/admin/pages/edit/${page.id}`)} title="Edit"><i className="fas fa-edit"></i></button>
                        <button className="btn btn-outline-danger" onClick={() => handleDelete(page.id)} title="Delete"><i className="fas fa-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="text-center py-4 text-muted">No pages found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Page Modal moved to AdminPageForm.jsx */}
    </div>
  )
}
