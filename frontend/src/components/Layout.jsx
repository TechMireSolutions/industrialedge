import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import useGlobalBehavior from '../hooks/useGlobalBehavior.js'

export default function Layout() {
  const { pathname } = useLocation()
  useGlobalBehavior()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  const scrollToTop = (e) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <div id="spinner" className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>

      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />

      <button className="btn btn-primary btn-lg-square back-to-top" style={{ display: 'none' }} onClick={scrollToTop} aria-label="Back to top"><i className="fa fa-arrow-up"></i></button>
    </>
  )
}
