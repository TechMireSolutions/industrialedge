import { useEffect } from 'react'
import { useSettings } from '../context/SettingsContext'

export default function useWow() {
  const { settings } = useSettings()

  useEffect(() => {
    if (settings?.featureFlags?.enableAnimations === false) return
    if (typeof WOW === 'undefined') return
    if (!window.__wow) {
      window.__wow = new WOW({ live: true, offset: 40 })
      window.__wow.init()
    }
  }, [settings?.featureFlags?.enableAnimations])
}
