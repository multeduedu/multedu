'use client'

import Script from 'next/script'

export default function VLibrasWidget() {
  return (
    <Script
      src="https://vlibras.gov.br/app/vlibras-plugin.js"
      strategy="afterInteractive"
      async
      onLoad={() => {
        console.log('✅ VLibras script carregado - boneco deve estar visível no canto inferior direito')
        // Debugar: verificar se elementos foram criados
        setTimeout(() => {
          const plugin = document.querySelector('.vlibras-plugin')
          const wrapper = document.querySelector('#vw-plugin-wrapper')
          console.log('🔍 VLibras Debug:', {
            'wrapper existe': !!wrapper,
            'plugin criado': !!plugin,
            'wrapper innerHTML': wrapper?.innerHTML.substring(0, 100) || 'vazio'
          })
        }, 2000)
      }}
      onError={() => {
        console.error('❌ Erro ao carregar VLibras script')
      }}
    />
  )
}

