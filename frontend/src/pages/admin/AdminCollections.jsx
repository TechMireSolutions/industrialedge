import { getImageUrl } from '../../utils/getImageUrl';
import { useConfirm } from '../../components/admin/ConfirmProvider.jsx'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useWow from '../../hooks/useWow.js'
import { adminApi, collectionApi } from '../../services'

export default function AdminCollections() {
  const confirm = useConfirm()
  const navigate = useNavigate()
  const [Collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  useWow()

  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    setLoading(true)
    try {
      const response = await collectionApi.getAll(false)
      setCollections(response.data)
    } catch (error) {
      console.error('Failed to fetch Collections:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!await confirm('Are you sure you want to delete this Collection?')) return
    try {
      await adminApi.deleteCollection(id)
      fetchCollections()
    } catch (error) {
      toast.error(error.data?.message || 'Failed to delete Collection')
    }
  }

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <span style={{ fontFamily: "Outfit", fontWeight: "800", fontSize: "24px" }}>Collections</span>
        </h4>
        <button className="btn btn-primary" onClick={() => navigate('/admin/Collections/add')}>
          <i className="fas fa-plus me-2"></i> Add Collection
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
              ) : Collections.length > 0 ? (
                Collections.map((Collection) => (
                  <tr key={Collection.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        {Collection.image && <img src={getImageUrl(Collection.image)} alt={Collection.name} style={{ width: 40, height: 40, objectFit: 'cover' }} className="rounded me-2" />}
                        <span>{Collection.name}</span>
                      </div>
                    </td>
                    <td>{Collection.slug}</td>
                    <td>{Collection._count?.products || 0}</td>
                    <td><span className={`badge bg-${Collection.active ? 'success' : 'secondary'}`}>{Collection.active ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-primary" onClick={() => navigate(`/admin/Collections/edit/${Collection.id}`)} title="Edit"><i className="fas fa-edit"></i></button>
                        <button className="btn btn-outline-danger" onClick={() => handleDelete(Collection.id)} title="Delete"><i className="fas fa-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="text-center py-4 text-muted">No Collections found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

