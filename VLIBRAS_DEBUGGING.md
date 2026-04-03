# 🔧 Debugging VLibras Widget

## Verificações no Navegador (DevTools)

### 1. Verificar se o Script Foi Carregado
```javascript
// Console (F12)
console.log(window.VLibras)
// Resultado esperado: Object { Widget: function }

// Se undefined, execute:
console.log(document.querySelector('script[src*="vlibras-plugin.js"]'))
// Deve retornar: <script> element
```

### 2. Verificar se a Div Wrapper Existe
```javascript
console.log(document.querySelector('#vw-plugin-wrapper'))
// Deve retornar: <div id="vw-plugin-wrapper" ...>

// Verificar visibilidade
const wrapper = document.querySelector('#vw-plugin-wrapper')
console.log({
  display: getComputedStyle(wrapper).display,
  visibility: getComputedStyle(wrapper).visibility,
  opacity: getComputedStyle(wrapper).opacity,
  zIndex: getComputedStyle(wrapper).zIndex,
})
```

### 3. Verificar se o Plugin foi Criado
```javascript
console.log(document.querySelector('.vlibras-plugin'))
// Deve retornar: <div class="vlibras-plugin">

// Se não existir, execute no console:
new window.VLibras.Widget('https://vlibras.gov.br/app')
// Isso forçará a criação do widget
```

### 4. Monitorar os Logs do Componente
```javascript
// Os logs aparecem no Console com prefixo "VLibras:"
// - "VLibras: Script carregado pelo onLoad"
// - "VLibras: Objeto detectado, inicializando..."
// - "VLibras: Widget inicializado com sucesso"
```

---

## Checklist de Debugging

- [ ] Script `https://vlibras.gov.br/app/vlibras-plugin.js` carregado (Network tab)
- [ ] `window.VLibras` definido (Console)
- [ ] Div `#vw-plugin-wrapper` existe (Inspector)
- [ ] `.vlibras-plugin` criado dentro da div (Inspector)
- [ ] Avatar visível no canto inferior direito
- [ ] Logs aparecem no Console

---

## Se o Avatar Ainda Não Aparecer

### Problema 1: Script Bloqueado
**Sintoma:** Script status 0 ou erro de CORS
**Solução:**
```javascript
// Verifica if VLibras carregou
if (!window.VLibras) {
  console.error('VLibras não foi carregado. Verifique:')
  console.log('1. Conexão de internet')
  console.log('2. BlockAds ou extensões bloqueando')
  console.log('3. Firewall corporativo')
}
```

### Problema 2: Widget Oculto por CSS
**Sintoma:** Div existe mas avatar não aparece
**Solução:**
```javascript
// Force visibilidade no console:
document.querySelectorAll('.vlibras-plugin, #vw-plugin-wrapper').forEach(el => {
  el.style.cssText = `
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 9998;
  `
})
```

### Problema 3: window.VLibras Indefinido Após Script Carregar
**Sintoma:** Script carrega mas window.VLibras não existe
**Solução:** Aumentar delay ou usar `requestAnimationFrame`:
```javascript
// No console, força a reinicialização:
requestAnimationFrame(() => {
  if (window.VLibras) {
    new window.VLibras.Widget('https://vlibras.gov.br/app')
    console.log('Widget criado manualmente')
  }
})
```

---

## Código de Teste Completo

Copie e cole no Console do DevTools para teste completo:

```javascript
(function debugVLibras() {
  console.log('=== DEBUG VLIBRAS ===')
  
  // 1. Verificar window
  console.log('1. window.VLibras:', window.VLibras ? '✅ Definido' : '❌ Indefinido')
  
  // 2. Verificar div
  const wrapper = document.querySelector('#vw-plugin-wrapper')
  console.log('2. Div wrapper:', wrapper ? '✅ Encontrada' : '❌ Não encontrada')
  
  // 3. Verificar plugin criado
  const plugin = document.querySelector('.vlibras-plugin')
  console.log('3. Plugin criado:', plugin ? '✅ Existe' : '❌ Não existe')
  
  // 4. se tudo OK, iniciar
  if (window.VLibras && wrapper && !plugin) {
    console.log('4. Inicializando widget...')
    try {
      new window.VLibras.Widget('https://vlibras.gov.br/app')
      console.log('✅ Widget inicializado com sucesso!')
    } catch (e) {
      console.error('❌ Erro ao inicializar:', e)
    }
  } else if (plugin) {
    console.log('✅ Widget já existe na página')
  }
})()
```

---

## Logs Esperados no Console

### ✅ Funcionando Corretamente
```
VLibras: Inicializando widget...
VLibras: Widget inicializado com sucesso
VLibras: Objeto detectado, inicializando...
```

### ❌ Problemas
```
VLibras: Ambiente não é o navegador
  → Significa SSR, OK, esperado em primeira renderização

VLibras: Objeto window.VLibras ainda não está disponível
  → Script ainda carregando, aguarde

VLibras: Erro ao inicializar widget: TypeError...
  → Network error ou plugin incompatível
```

---

## Referências

- **Endpoint VLibras:** https://vlibras.gov.br/app
- **Script:** https://vlibras.gov.br/app/vlibras-plugin.js
- **Documentação:** https://github.com/locaweb/vlibras
