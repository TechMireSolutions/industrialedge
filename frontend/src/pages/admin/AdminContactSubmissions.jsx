import { useConfirm } from '../../components/admin/ConfirmProvider.jsx'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useWow from '../../hooks/useWow.js'
import { adminApi } from '../../services'

export default function AdminContactSubmissions() {
  const confirm = useConfirm()
  const navigate = useNavigate()
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  useWow()

  useEffect(() => {
    fetchSubmissions()
  }, [pagination.page])

  const fetchSubmissions = async () => {
    setLoading(true)
    try {
      const response = await adminApi.getContactSubmissions(pagination.page, pagination.limit)
      setSubmissions(response.data)
      setPagination(prev => ({ ...prev, total: response.pagination.total, totalPages: response.pagination.totalPages }))
    } catch (error) {
      console.error('Failed to fetch submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!await confirm('Are you sure you want to delete this submission?')) return
    try {
      await adminApi.deleteContactSubmission(id)
      fetchSubmissions()
    } catch (error) {
      toast.error(error.data?.message || 'Failed to delete submission')
    }
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page }))
    }
  }

  return (
    <div className="container-fluid p-4">
      <h4 className="mb-4">
        <span style={{ fontFamily: "Outfit", fontWeight: "800", fontSize: "24px" }}>Contact Submissions</span>
      </h4>

      <div className="bg-white rounded shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>NAME</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>EMAIL</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>SUBJECT</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>DATE</th>
                <th style={{ fontFamily: "Inter", fontWeight: "600", fontSize: "12px" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-4"><div className="spinner-border text-primary" role="status"></div></td></tr>
              ) : submissions.length > 0 ? (
                submissions.map((submission) => (
                  <tr key={submission.id}>
                    <td>{submission.name}</td>
                    <td>{submission.email}</td>
                    <td>{submission.subject}</td>
                    <td>{new Date(submission.createdAt).toLocaleString()}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-primary" onClick={() => navigate(`/admin/contact-submissions/${submission.id}`)} title="View Details"><i className="fas fa-eye"></i></button>
                        <button className="btn btn-outline-danger" onClick={() => handleDelete(submission.id)} title="Delete"><i className="fas fa-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="text-center py-4 text-muted">No submissions found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {pagination.totalPages > 1 && (
          <div className="p-4 border-top">
            <nav aria-label="Submissions pagination">
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

      {/* Submission Detail Modal moved to AdminContactDetails.jsx */}
    </div>
  )
}
