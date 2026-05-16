import { useEffect } from 'react'

export default function ChatbotWidget() {
  useEffect(() => {
    // Avoid duplicate injection
    if (document.getElementById('commitbot-script')) return

    // Pass config as globals BEFORE script loads (document.currentScript is null for dynamic scripts)
    window.__commitbot_id__ = '6a08f54dd176280ef5365073'
    window.__commitbot_api__ = 'https://commitbot-ws0p.onrender.com'

    const script = document.createElement('script')
    script.id = 'commitbot-script'
    script.src = 'https://commitbot-ws0p.onrender.com/widget/widget.js'
    document.body.appendChild(script)

    return () => {
      document.getElementById('commitbot-script')?.remove()
      document.getElementById('sitebot-bubble')?.remove()
      document.getElementById('sitebot-window')?.remove()
      delete window.__commitbot_id__
      delete window.__commitbot_api__
    }
  }, [])

  return null
}