import { useState, useEffect, useRef, useCallback } from 'react'
import { cmsApi } from '../services'
import './Services.css'

const DEFAULT_SERVICES = [
  {
    id: 'service-1',
    title: 'Free Return',
    description: '30 days money back guarantee on all equipment orders.',
    icon: 'fa fa-sync-alt',
    featureTag: 'RISK-FREE TRIAL'
  },
  {
    id: 'service-2',
    title: 'Free Shipping',
    description: 'Free express shipping on all orders over $99 nationwide.',
    icon: 'fab fa-telegram-plane',
    featureTag: 'FAST LOGISTICS'
  },
  {
    id: 'service-3',
    title: 'Support 24/7',
    description: 'Direct engineer support available around the clock.',
    icon: 'fas fa-life-ring',
    featureTag: 'EXPERT ASSISTANCE'
  },
  {
    id: 'service-4',
    title: 'Receive Gift Card',
    description: 'Earn points and gift reward vouchers on repeat orders.',
    icon: 'fas fa-credit-card',
    featureTag: 'LOYALTY REWARDS'
  },
  {
    id: 'service-5',
    title: 'Secure Payment',
    description: 'End-to-end encrypted 256-bit secure checkout protection.',
    icon: 'fas fa-lock',
    featureTag: 'VERIFIED SECURITY'
  },
  {
    id: 'service-6',
    title: 'Certified Quality',
    description: 'All industrial equipment rigorously tested and certified.',
    icon: 'fas fa-certificate',
    featureTag: 'OEM CERTIFIED'
  }
]

export default function Services({ services: initialServices }) {
  const [services, setServices] = useState(initialServices || [])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const lastScrollTimeRef = useRef(0)
  const touchStartYRef = useRef(0)
  const touchStartXRef = useRef(0)
  const stageRef = useRef(null)

  useEffect(() => {
    if (initialServices && initialServices.length > 0) {
      setServices(initialServices)
      return
    }

    const fetchServices = async () => {
      try {
        const response = await cmsApi.getServices()
        if (response.data && response.data.length > 0) {
          setServices(response.data)
        } else {
          setServices(DEFAULT_SERVICES)
        }
      } catch (error) {
        console.error('Failed to fetch services, using default fallback:', error)
        setServices(DEFAULT_SERVICES)
      }
    }
    fetchServices()
  }, [initialServices])

  const totalCards = services.length > 0 ? services.length : DEFAULT_SERVICES.length
  const activeList = services.length > 0 ? services : DEFAULT_SERVICES

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalCards)
  }, [totalCards])

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalCards) % totalCards)
  }, [totalCards])

  // Attach non-passive native wheel listener to isolate scroll to the card stack
  useEffect(() => {
    const stageEl = stageRef.current
    if (!stageEl) return

    const handleWheelNative = (e) => {
      // Prevent the main window/page from scrolling while mouse is over the cards
      e.preventDefault()

      if (Math.abs(e.deltaY) < 15) return

      const now = Date.now()
      // Cooldown lock to prevent skipping multiple cards on a single wheel flick
      if (now - lastScrollTimeRef.current < 320) return

      if (e.deltaY > 0) {
        handleNext()
        lastScrollTimeRef.current = now
      } else {
        handlePrev()
        lastScrollTimeRef.current = now
      }
    }

    stageEl.addEventListener('wheel', handleWheelNative, { passive: false })

    return () => {
      stageEl.removeEventListener('wheel', handleWheelNative)
    }
  }, [handleNext, handlePrev])

  // Touch Swipe for Mobile
  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length > 0) {
      touchStartYRef.current = e.touches[0].clientY
      touchStartXRef.current = e.touches[0].clientX
    }
  }

  const handleTouchEnd = (e) => {
    if (e.changedTouches && e.changedTouches.length > 0) {
      const deltaY = touchStartYRef.current - e.changedTouches[0].clientY
      const deltaX = touchStartXRef.current - e.changedTouches[0].clientX

      // Check vertical or horizontal swipe
      if (Math.abs(deltaY) > 35 || Math.abs(deltaX) > 35) {
        if (deltaY > 35 || deltaX > 35) {
          handleNext()
        } else if (deltaY < -35 || deltaX < -35) {
          handlePrev()
        }
      }
    }
  }

  // Keyboard navigation for accessibility
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      handleNext()
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      handlePrev()
    }
  }

  // Compute 3D Depth Card Stacking Styles
  const getCardStyle = (index) => {
    const N = totalCards
    const relOffset = (index - activeIndex + N) % N

    // Active / Front card
    if (relOffset === 0) {
      return {
        transform: 'translate3d(0, 0px, 0px) scale(1)',
        opacity: 1,
        zIndex: 10,
        pointerEvents: 'auto',
      }
    }

    // 1st Card Behind
    if (relOffset === 1) {
      return {
        transform: 'translate3d(0, 22px, -30px) scale(0.95)',
        opacity: 0.94,
        zIndex: 9,
        pointerEvents: 'auto',
      }
    }

    // 2nd Card Behind
    if (relOffset === 2) {
      return {
        transform: 'translate3d(0, 44px, -60px) scale(0.90)',
        opacity: 0.78,
        zIndex: 8,
        pointerEvents: 'auto',
      }
    }

    // 3rd Card Behind
    if (relOffset === 3) {
      return {
        transform: 'translate3d(0, 66px, -90px) scale(0.85)',
        opacity: 0.55,
        zIndex: 7,
        pointerEvents: 'auto',
      }
    }

    // Hidden cards in background transition
    return {
      transform: 'translate3d(0, 80px, -120px) scale(0.80)',
      opacity: 0,
      zIndex: 1,
      pointerEvents: 'none'
    }
  }

  return (
    <section className="morphing-services-section position-relative">
      <div className="morphing-services-glow" />

      <div className="container position-relative z-1">
        {/* Header */}
        <div className="text-center mb-2">
          <div className="morphing-services-badge">
            <i className="fas fa-shield-alt"></i>
            <span>Our Service Guarantees</span>
          </div>
          <h2 className="morphing-services-title">
            Engineered for Reliability & Service Excellence
          </h2>
          <p className="morphing-services-subtitle">
            Scroll or swipe over the card stack to explore our core commitments.
          </p>
        </div>

        {/* Morphing Card Stack Interactive Area */}
        <div
          ref={stageRef}
          className="morphing-stack-stage"
          tabIndex={0}
          role="region"
          aria-label="Service cards stack"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {activeList.map((service, index) => {
            const isFront = (index - activeIndex + totalCards) % totalCards === 0
            const style = getCardStyle(index)
            const cardNum = String(index + 1).padStart(2, '0')

            return (
              <div
                key={service.id || index}
                className={`morphing-card ${isFront ? 'is-front' : ''}`}
                style={style}
                onClick={() => {
                  if (!isFront) {
                    setActiveIndex(index)
                  }
                }}
                role="article"
                aria-current={isFront ? 'true' : 'false'}
              >
                {/* Top Row: Icon + Card Tag */}
                <div className="morphing-card-top">
                  <div className="morphing-icon-box">
                    <i className={service.icon || 'fas fa-check-circle'}></i>
                  </div>
                  <span className="morphing-card-tag">#{cardNum}</span>
                </div>

                {/* Body Content */}
                <div className="morphing-card-body">
                  <h4 className="morphing-card-title">{service.title}</h4>
                  <p className="morphing-card-desc">{service.description}</p>
                </div>

                {/* Bottom Row */}
                <div className="morphing-card-bottom">
                  <span className="morphing-feature-pill">
                    <i className="fas fa-bolt"></i>
                    {service.featureTag || 'INDUSTRIAL EDGE STANDARD'}
                  </span>
                  <div className="morphing-status-indicator">
                    <span className="morphing-status-dot"></span>
                    <span>{isFront ? 'Active Guarantee' : 'In Stack'}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Controls & Pagination Dots */}
        <div className="morphing-controls-wrapper">
          <button
            type="button"
            className="morphing-nav-btn"
            onClick={handlePrev}
            aria-label="Previous service card"
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          <div className="morphing-dots-list" role="tablist" aria-label="Service navigation">
            {activeList.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                className={`morphing-dot ${dotIdx === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(dotIdx)}
                aria-label={`Jump to service ${dotIdx + 1}`}
                aria-selected={dotIdx === activeIndex}
                role="tab"
              />
            ))}
          </div>

          <button
            type="button"
            className="morphing-nav-btn"
            onClick={handleNext}
            aria-label="Next service card"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        {/* Interactive hint */}
        <div className="morphing-scroll-hint">
          <i className="fas fa-mouse"></i>
          <span>Scroll over cards or use buttons to navigate</span>
        </div>
      </div>
    </section>
  )
}
