'use client'

import { useAccessibility } from '@/hooks/useAccessibility'
import { useEffect, useState } from 'react'

export default function TesteDislexiaPage() {
  const { accessibility, toggleDyslexia } = useAccessibility()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!accessibility || !mounted) return null

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Teste de Modo Dislexia</h1>

      <div className="bg-blue-100 p-4 rounded mb-4">
        <p className="font-bold">
          Estado: {accessibility.dyslexiaFriendly ? '✅ ATIVO' : '❌ DESATIVO'}
        </p>
        <p>Texto em escala: {accessibility.textScale}</p>
        <p>Contraste: {accessibility.contrast}</p>
      </div>

      <button
        onClick={toggleDyslexia}
        className={`px-4 py-2 rounded font-bold text-white mb-6 ${
          accessibility.dyslexiaFriendly ? 'bg-purple-500' : 'bg-gray-500'
        }`}
      >
        {accessibility.dyslexiaFriendly ? 'Desativar' : 'Ativar'} Modo Dislexia
      </button>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-2">📖 Texto para Leitura</h2>
          <p className="text-base leading-relaxed">
            Este é um parágrafo de teste para verificar se o modo dislexia-amigável está
            funcionando corretamente. Com a fonte OpenDyslexic, o espaçamento entre letras
            aumentado, e a altura de linha maior, o texto fica muito mais confortável para
            pessoas com dislexia lerem.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">🔤 Características Visuais</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Fonte:</strong> OpenDyslexic (mais legível para dislexia)
            </li>
            <li>
              <strong>Espaçamento de letras:</strong> 0.05em (aumentado)
            </li>
            <li>
              <strong>Altura de linha:</strong> 1.8 (mais espaço entre linhas)
            </li>
            <li>
              <strong>Espaçamento de palavras:</strong> 0.15em (maior distância entre palavras)
            </li>
            <li>
              <strong>Fundo:</strong> Sepia natural #fef6e4 (menos fadiga ocular)
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">💾 Persistência</h2>
          <p>
            Verifique no localStorage da página (F12 -&gt; Application -&gt; LocalStorage):
          </p>
          <code className="block bg-gray-100 p-3 rounded mt-2 text-sm">
            localStorage.getItem('accessibility')
          </code>
          <p className="text-sm mt-2">
            Você deve ver: <code>{"{ \"textScale\": \"normal\", \"contrast\": \"normal\", \"dyslexiaFriendly\": true }"}</code>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">🧪 Teste de Elementos</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-bold">Input:</label>
              <input
                type="text"
                placeholder="Digite algo aqui..."
                className="w-full px-2 py-1 border rounded mt-1"
              />
            </div>
            <div>
              <label className="font-bold">Button:</label>
              <button className="px-4 py-1 bg-blue-500 text-white rounded mt-1">
                Clique aqui
              </button>
            </div>
            <div>
              <label className="font-bold">Link:</label>
              <a href="#" className="text-blue-600 underline mt-1 block">
                Exemplo de link
              </a>
            </div>
            <div>
              <label className="font-bold">TextArea:</label>
              <textarea
                placeholder="Digite um texto maior..."
                className="w-full px-2 py-1 border rounded mt-1 h-20"
              />
            </div>
          </div>
        </section>

        <section className="bg-yellow-50 p-4 rounded">
          <h3 className="font-bold mb-2">📝 Checklist de Verificação:</h3>
          <ul className="space-y-1 text-sm">
            <li>
              ✓ Classe <code>dyslexia-friendly</code> foi adicionada ao HTML?
            </li>
            <li>
              ✓ Fonte mudou para OpenDyslexic (mais robusta)?
            </li>
            <li>
              ✓ Espaçamento entre letras aumentou notavelmente?
            </li>
            <li>
              ✓ Fundo ficou com tom sepia?
            </li>
            <li>
              ✓ localStorage foi atualizado?
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
