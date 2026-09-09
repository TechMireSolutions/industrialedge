import { useEffect } from 'react'

export default function useCarousel(selector, options = {}, dependencies = []) {
  useEffect(() => {
    // Handle null/undefined selector gracefully
    if (!selector) return
    
    // Handle both string selectors and ref objects
    const element = typeof selector === 'string' 
      ? document.querySelector(selector) 
      : selector?.current
    
    if (!element) return
    
    const $el = window.$(element)
    if (!$el.length || typeof $el.owlCarousel !== 'function') return
    
    $el.owlCarousel({
      autoplay: true,
      smartSpeed: 1500,
      dots: false,
      loop: true,
      margin: 25,
      nav: true,
      navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
      ...options
    })
    
    return () => {
      try {
        $el.trigger('destroy.owl.carousel')
      } catch (e) { /* noop */ }
    }
  }, [selector, JSON.stringify(options), ...dependencies])
}