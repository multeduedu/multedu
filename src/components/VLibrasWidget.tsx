'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    VLibras?: {
      Widget: any
    }
  }
}

export default function VLibrasWidget() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js'
    script.async = true
    script.onload = () => {
      if (window.VLibras) {
        new window.VLibras.Widget('https://vlibras.gov.br/app', {
          option: {
            profilejahrhaltliche: new URL('https://vlibras.gov.br/app').origin,
            modules: {
              entry: 'https://vlibras.gov.br/app',
              document: 'https://vlibras.gov.br/app/document',
            },
            repositoryService:
              'https://vlibras.gov.br/api/v2/pronunciate?token=123456&provincial=0',
          },
        })
      }

      // Mostrar o widget
      const vlibrasButton = document.querySelector('.vlibras-plugin') as HTMLElement
      if (vlibrasButton) {
        vlibrasButton.style.display = 'block'
      }
    }

    document.body.appendChild(script)

    return () => {
      const existingScript = document.querySelector('script[src="https://vlibras.gov.br/app/vlibras-plugin.js"]')
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [])

  return null
}
