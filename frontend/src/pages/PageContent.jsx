import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import useWow from '../hooks/useWow.js'
import { cmsApi } from '../services'

export default function PageContent({ staticSlug }) {
  const params = useParams()
  const slug = staticSlug || params.slug
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useWow()

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await cmsApi.getPage(slug)
        setPage(response.data)
      } catch (err) {
        setError('Page not found')
      } finally {
        setLoading(false)
      }
    }
    fetchPage()
  }, [slug])

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

  if (error || !page) {
    return (
      <>
        <PageHeader title="Page Not Found" crumb="404" />
        <div className="container-fluid py-5">
          <div className="container py-5 text-center">
            <i className="bi bi-exclamation-triangle display-1 text-secondary"></i>
            <h1 className="display-1">404</h1>
            <h1 className="mb-4">Page Not Found</h1>
            <p className="mb-4">The page you're looking for doesn't exist.</p>
            <Link className="btn btn-primary rounded-pill py-3 px-5" to="/">Go Back To Home</Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="page-wrapper" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Cinematic Hero */}
      <div className="container-fluid position-relative overflow-hidden py-6 bg-primary">
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%)' }}></div>
        <div className="container position-relative z-1 py-5 text-center wow fadeInDown" data-wow-delay="0.1s">
          <h1 className="display-3 fw-bold text-white mb-3" style={{ letterSpacing: '-1px' }}>{page.title}</h1>
          <div className="mx-auto" style={{ width: '80px', height: '4px', backgroundColor: '#f8f9fa', opacity: 0.5 }}></div>
        </div>
      </div>

      <div className="container-fluid py-5 mt-n5 position-relative z-2">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="bg-white rounded-4 shadow p-5 p-md-5 border wow fadeInUp" data-wow-delay="0.2s">
                <div className="page-content-body fs-5 text-dark" style={{ lineHeight: '1.8' }} dangerouslySetInnerHTML={{ __html: page.content }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
