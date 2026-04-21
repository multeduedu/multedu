'use client'

import Script from 'next/script'

export default function VLibrasWidget() {
  return (
    <Script
      src="https://vlibras.gov.br/app/vlibras-plugin.js"
      strategy="afterInteractive"
      onLoad={() => {
        console.log('✅ VLibras script carregado - widget deve aparecer no canto inferior direito')
      }}
      onError={() => {
        console.error('❌ Erro ao carregar VLibras script')
      }}
    />
  )
}

