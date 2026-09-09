import { useConfirm } from '../../components/admin/ConfirmProvider.jsx'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useWow from '../../hooks/useWow.js'
import { adminApi } from '../../services'

export default function AdminUsers() {
  const confirm = useConfirm()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  useWow()

  useEffect(() => {
    fetchUsers()
  }, [pagination.page, search, roleFilter])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await adminApi.getUsers({
        page: pagination.page,
        limit: pagination.limit,
        search: search || undefined,
        role: roleFilter || undefined,
      })
      setUsers(response.data)
      setPagination(prev => ({ ...prev, total: response.pagination.total, totalPages: response.pagination.totalPages }))
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // Modal logic has been moved to AdminUserForm.jsx

  const handleDelete = async (id) => {
    if (!await confirm('Are you sure you want to delete this user?')) return
    try {
      await adminApi.deleteUser(id)
      fetchUsers()
    } catch (error) {
      toast.error(error.data?.message || 'Failed to delete user')
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
          <span style={{ fontFamily: "Outfit", fontWeight: "800", fontSize: "24px" }}>Users</span>
        </h4>
        <button className="btn btn-primary" onClick={() => navigate('/admin/users/add')}>
          <i className="fas fa-plus me-2"></i> Add User
        </button>
      </div>

      <div className="bg-white rounded shadow-sm mb-4">
        <div className="p-4 border-bottom">
          <div className="row g-3">
            <div className="col-md-4">
              <input type="text" className="form-control" placeholder="Search users..." value={search} onChange={handleSearch} />
            </div>
            <div className="col-md-3">
              <select className="form-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="">All Roles</option>
                <option value="CUSTOMER">Customer</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>NAME</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>EMAIL</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>PHONE</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>ROLE</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>ORDERS</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>REGISTERED</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-4"><div className="spinner-border text-primary" role="status"></div></td></tr>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || '-'}</td>
                    <td><span className={`badge bg-${user.role === 'ADMIN' ? 'danger' : 'secondary'}`}>{user.role}</span></td>
                    <td>{user._count?.orders || 0}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-primary" onClick={() => navigate(`/admin/users/edit/${user.id}`)} title="Edit"><i className="fas fa-edit"></i></button>
                        <button className="btn btn-outline-danger" onClick={() => handleDelete(user.id)} title="Delete"><i className="fas fa-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" className="text-center py-4 text-muted">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {pagination.totalPages > 1 && (
          <div className="p-4 border-top">
            <nav aria-label="Users pagination">
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

      {/* User Modal moved to AdminUserForm.jsx */}
    </div>
  )
}
