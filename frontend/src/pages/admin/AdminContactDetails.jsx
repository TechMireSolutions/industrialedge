import { useConfirm } from '../../components/admin/ConfirmProvider.jsx'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminFormLayout from '../../components/admin/AdminFormLayout'
import { adminApi } from '../../services'

export default function AdminContactDetails() {
  const confirm = useConfirm()
  const navigate = useNavigate()
  const { id } = useParams()

  const [loading, setLoading] = useState(true)
  const [globalError, setGlobalError] = useState('')
  const [submission, setSubmission] = useState(null)

  useEffect(() => {
    fetchSubmission()
  }, [id])

  const fetchSubmission = async () => {
    try {
      // Find submission by fetching list (as there might not be a getById endpoint for contacts)
      const response = await adminApi.getContactSubmissions(1, 1000)
      const found = response.data.find(s => s.id === id)
      if (found) {
        setSubmission(found)
      } else {
        setGlobalError('Contact submission not found.')
      }
    } catch (error) {
      console.error('Failed to fetch contact submission:', error)
      setGlobalError('Failed to load contact submission.')
    } finally {
      setLoading(false)
    }
  }

  const handleReturn = () => {
    navigate('/admin/contact-submissions')
  }

  const handleDelete = async () => {
    if (!await confirm('Are you sure you want to delete this submission?')) return
    try {
      await adminApi.deleteContactSubmission(id)
      navigate('/admin/contact-submissions')
    } catch (error) {
      toast.error(error.data?.message || 'Failed to delete submission')
    }
  }

  if (loading || !submission) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    )
  }

  return (
    <AdminFormLayout
      title="View Contact Submission"
      subtitle={`Subject: ${submission.subject}`}
      onBack={handleReturn}
      onSave={handleReturn}
      onCancel={handleReturn}
      isSaving={false}
      saveText="Return to Inbox"
      tabs={[]} // No tabs needed for this simple view
      activeTab=""
      onTabChange={() => {}}
      error={globalError}
    >
      <div className="row g-4">
        <div className="col-md-6">
          <h5 className="fw-bold mb-3">Sender Details</h5>
          <div className="card bg-light border-0 p-3 mb-4">
            <div className="mb-2"><strong>Name:</strong> {submission.name}</div>
            <div className="mb-2"><strong>Email:</strong> <a href={`mailto:${submission.email}`}>{submission.email}</a></div>
            {submission.phone && <div className="mb-2"><strong>Phone:</strong> <a href={`tel:${submission.phone}`}>{submission.phone}</a></div>}
            {submission.project && <div><strong>Project:</strong> {submission.project}</div>}
          </div>
        </div>

        <div className="col-md-6">
          <h5 className="fw-bold mb-3">Submission Details</h5>
          <div className="card bg-light border-0 p-3 mb-4">
            <div className="mb-2"><strong>Date Received:</strong> {new Date(submission.createdAt).toLocaleString()}</div>
            <div className="mb-2"><strong>Status:</strong> Unread/Inbox</div>
          </div>
          <button className="btn btn-outline-danger w-100" onClick={handleDelete}>
            <i className="fas fa-trash me-2"></i> Delete this Submission
          </button>
        </div>

        <div className="col-12 mt-4 pt-4 border-top">
          <h5 className="fw-bold mb-3">Message</h5>
          <div className="card border-0 shadow-sm p-4">
            <p className="mb-0" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
              {submission.message}
            </p>
          </div>
        </div>
      </div>
    </AdminFormLayout>
  )
}
