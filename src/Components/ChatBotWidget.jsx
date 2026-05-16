import { useEffect } from 'react'

export default function ChatbotWidget() {
  useEffect(() => {
    // Avoid duplicate script injection
    if (document.querySelector('script[data-bot-id="6a08e7b149817a300a14881d"]')) return

    const script = document.createElement('script')
    script.src = 'https://commitbot-ws0p.onrender.com/widget/widget.js'
    script.setAttribute('data-bot-id', '6a08e7b149817a300a14881d')
    script.setAttribute('data-api-url', 'https://commitbot-ws0p.onrender.com')
    document.body.appendChild(script)

    return () => {
      // Optional cleanup on unmount
      const el = document.querySelector('script[data-bot-id="6a08e7b149817a300a14881d"]')
      if (el) el.remove()
    }
  }, [])

  return null
}