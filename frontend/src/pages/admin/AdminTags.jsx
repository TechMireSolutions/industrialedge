import { useConfirm } from '../../components/admin/ConfirmProvider.jsx'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { adminApi } from '../../services'

export default function AdminTags() {
  const confirm = useConfirm()
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTag, setEditingTag] = useState(null)
  const [formData, setFormData] = useState({ name: '', slug: '' })

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    setLoading(true)
    try {
      const response = await adminApi.getTags()
      setTags(response.data)
    } catch (error) {
      console.error('Failed to fetch tags:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!await confirm('Are you sure you want to delete this tag?')) return
    try {
      await adminApi.deleteTag(id)
      fetchTags()
      toast.success('Tag deleted')
    } catch (error) {
      toast.error(error.data?.message || 'Failed to delete tag')
    }
  }

  const handleOpenModal = (tag = null) => {
    if (tag) {
      setEditingTag(tag)
      setFormData({ name: tag.name, slug: tag.slug })
    } else {
      setEditingTag(null)
      setFormData({ name: '', slug: '' })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingTag(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingTag) {
        await adminApi.updateTag(editingTag.id, formData)
        toast.success('Tag updated')
      } else {
        await adminApi.createTag(formData)
        toast.success('Tag created')
      }
      handleCloseModal()
      fetchTags()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save tag')
    }
  }

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <span style={{ fontFamily: "Outfit", fontWeight: "800", fontSize: "24px" }}>Tags</span>
        </h4>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <i className="fas fa-plus me-2"></i> Add Tag
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
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="text-center py-4"><div className="spinner-border text-primary" role="status"></div></td></tr>
              ) : tags.length > 0 ? (
                tags.map((tag) => (
                  <tr key={tag.id}>
                    <td>{tag.name}</td>
                    <td>{tag.slug}</td>
                    <td>{tag._count?.products || 0}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-primary" onClick={() => handleOpenModal(tag)} title="Edit"><i className="fas fa-edit"></i></button>
                        <button className="btn btn-outline-danger" onClick={() => handleDelete(tag.id)} title="Delete"><i className="fas fa-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="text-center py-4 text-muted">No tags found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">{editingTag ? 'Edit Tag' : 'Add Tag'}</h5>
                  <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formData.name} 
                      onChange={(e) => {
                        const name = e.target.value;
                        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        setFormData({...formData, name, slug});
                      }} 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Slug</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formData.slug} 
                      onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')})} 
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
