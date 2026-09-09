import { getImageUrl } from '../../utils/getImageUrl';
import { useConfirm } from '../../components/admin/ConfirmProvider.jsx'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useWow from '../../hooks/useWow.js'
import { adminApi, categoryApi } from '../../services'

export default function AdminCategories() {
  const confirm = useConfirm()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  useWow()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await categoryApi.getAll(false)
      setCategories(response.data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!await confirm('Are you sure you want to delete this category?')) return
    try {
      await adminApi.deleteCategory(id)
      fetchCategories()
    } catch (error) {
      toast.error(error.data?.message || 'Failed to delete category')
    }
  }

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <span style={{ fontFamily: "Outfit", fontWeight: "800", fontSize: "24px" }}>Categories</span>
        </h4>
        <button className="btn btn-primary" onClick={() => navigate('/admin/categories/add')}>
          <i className="fas fa-plus me-2"></i> Add Category
        </button>
      </div>

      <div className="bg-white rounded shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>NAME</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>SLUG</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>PRODUCTS</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>STATUS</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-4"><div className="spinner-border text-primary" role="status"></div></td></tr>
              ) : categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        {category.image && <img src={getImageUrl(category.image)} alt={category.name} style={{ width: 40, height: 40, objectFit: 'cover' }} className="rounded me-2" />}
                        <span>{category.name}</span>
                      </div>
                    </td>
                    <td>{category.slug}</td>
                    <td>{category._count?.products || 0}</td>
                    <td><span className={`badge bg-${category.active ? 'success' : 'secondary'}`}>{category.active ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-primary" onClick={() => navigate(`/admin/categories/edit/${category.id}`)} title="Edit"><i className="fas fa-edit"></i></button>
                        <button className="btn btn-outline-danger" onClick={() => handleDelete(category.id)} title="Delete"><i className="fas fa-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="text-center py-4 text-muted">No categories found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

