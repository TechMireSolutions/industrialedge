import { useEffect } from 'react'

export default function useGlobalBehavior() {
  useEffect(() => {
    // Spinner
    const spinner = document.getElementById('spinner')
    const spinnerTimer = setTimeout(() => {
      if (spinner) spinner.classList.remove('show')
    }, 1)

    // Sticky navbar
    const onScroll = () => {
      const bar = document.querySelector('.nav-bar')
      if (!bar) return
      if (window.scrollY > 45) {
        bar.classList.add('sticky-top', 'shadow-sm')
      } else {
        bar.classList.remove('sticky-top', 'shadow-sm')
      }
    }
    window.addEventListener('scroll', onScroll)

    // Back to top
    const backTop = document.querySelector('.back-to-top')
    const onScroll2 = () => {
      if (!backTop) return
      if (window.scrollY > 300) {
        backTop.style.display = 'flex'
      } else {
        backTop.style.display = 'none'
      }
    }
    onScroll2()
    window.addEventListener('scroll', onScroll2)
    if (backTop) {
      backTop.addEventListener('click', function (e) {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
    }

    // Quantity buttons (delegated so it works on pages mounted later)
    const onQuantityClick = (e) => {
      const btn = e.target.closest('.quantity button')
      if (!btn) return
      const input = btn.closest('.quantity').querySelector('input')
      if (!input) return
      let val = parseFloat(input.value) || 0
      if (btn.classList.contains('btn-plus')) {
        input.value = val + 1
      } else if (val > 0) {
        input.value = val - 1
      }
    }
    document.addEventListener('click', onQuantityClick)

    return () => {
      clearTimeout(spinnerTimer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scroll', onScroll2)
      document.removeEventListener('click', onQuantityClick)
    }
  }, [])
}
