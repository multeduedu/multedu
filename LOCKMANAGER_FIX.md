# Correção do Erro "Navigator LockManager Lock Timeout"

## Problema Identificado

O erro `Acquiring an exclusive Navigator LockManager lock "lock:sb-hqwrwiekyckihjokbrmz-auth-token" timed out waiting 10000ms` é um problema comum do Supabase que ocorre quando há conflitos no acesso ao token de autenticação.

## Soluções Implementadas

### 1. Cliente Supabase Melhorado (`src/lib/supabase.ts`)

- **Singleton Pattern**: Evita criação de múltiplas instâncias do cliente
- **Configurações Otimizadas**: 
  - `persistSession: true` - Mantém sessão persistente
  - `autoRefreshToken: true` - Refresh automático de tokens
  - `detectSessionInUrl: false` - Evita detecção desnecessária de URLs
  - `flowType: 'pkce'` - Usa fluxo PKCE mais seguro
- **Retry com Backoff Exponencial**: Função `retryWithBackoff` para tentar novamente em caso de timeout
- **Função Wrapper**: `getUserWithRetry()` encapsula `getUser()` com retry automático

### 2. Hook de Autenticação Robusto (`src/hooks/useAuth.ts`)

- **Tratamento de Erros Centralizado**: Gerencia todos os tipos de erros de autenticação
- **Retry Inteligente**: Até 3 tentativas para erros de LockManager
- **Estado de Carregamento**: Controla loading states adequadamente
- **Listener de Auth**: Monitora mudanças no estado de autenticação
- **Funções Utilitárias**: `signOut()`, `refreshUser()`

### 3. Página Dashboard Otimizada (`src/app/dashboard/page.tsx`)

- **Uso do Hook useAuth**: Substitui lógica manual por hook robusto
- **Interface de Erro**: Exibe erros amigáveis ao usuário
- **Botão de Retry**: Permite tentar novamente em caso de erro

### 4. Middleware Melhorado (`middleware.ts`)

- **Autenticação Server-Side**: Verifica autenticação antes da renderização
- **Tratamento de Rotas**: Protege rotas sensíveis e redireciona adequadamente
- **Cookies Management**: Gerencia cookies de sessão corretamente

### 5. Configurações Next.js (`next.config.ts`)

- **Otimizações de Pacote**: Melhora importação do Supabase
- **Headers de Segurança**: Adiciona proteções extras
- **Performance**: Configurações para reduzir conflitos de concorrência

## Como Monitorar e Debug

### Logs no Console

O sistema agora registra logs detalhados:

```javascript
// Tentativas de retry
'Tentativa 1 falhou, tentando novamente em 1000ms...'

// Erros específicos
'Erro de LockManager detectado, redirecionando para login...'

// Status de autenticação
'Erro ao carregar usuário:', error
```

### Verificação no DevTools

1. **Network Tab**: Monitore requests do Supabase
2. **Console**: Visualize logs de erro e retry
3. **Application → Storage**: Verifique persistência de sessão
4. **Application → Cookies**: Confirme cookies de auth

### Indicadores Visuais

- **Loading Spinner**: Durante carregamento de autenticação
- **Mensagem de Erro**: Interface amigável para erros
- **Botão "Tentar Novamente"**: Permite retry manual

## Cenários de Erro e Resoluções

### Erro: LockManager Timeout

**Causa**: Múltiplas tentativas simultâneas de acesso ao token
**Resolução**: Retry automático com backoff exponencial (1s, 2s, 4s)
**Fallback**: Redirecionamento para login após 3 tentativas

### Erro: Sessão Expirada

**Causa**: Token de refresh expirado
**Resolução**: Redirecionamento automático para login
**Prevenção**: AutoRefreshToken habilitado

### Erro: Perfil não Encontrado

**Causa**: Usuário autenticado sem perfil na tabela 'profiles'
**Resolução**: Criação de usuário temporário com dados básicos
**Ação**: Log de erro para investigação

## Troubleshooting

### Se o Problema Persistir

1. **Limpar Storage do Browser**:
   ```javascript
   // No console do browser
   localStorage.clear();
   sessionStorage.clear();
   ```

2. **Verificar Configurações Supabase**:
   - Conferir URLs e chaves no `.env.local`
   - Verificar se projeto Supabase está ativo
   - Confirmar configurações de auth no dashboard

3. **Restart da Aplicação**:
   ```bash
   npm run dev
   ```

4. **Verificar Rede**:
   - Conexão estável com internet
   - Firewall não bloqueando Supabase
   - DNS resolvendo domínio Supabase

### Configurações de Desenvolvimento

Para evitar problemas durante desenvolvimento:

```bash
# Limpar cache do Next.js
rm -rf .next

# Reinstalar dependências se necessário
rm -rf node_modules package-lock.json
npm install

# Restart do servidor
npm run dev
```

## Prevenção Futura

1. **Evitar Múltiplas Instâncias**: Sempre usar o singleton do Supabase
2. **Gerenciar Estado**: Usar hooks centralizados para auth
3. **Monitorar Logs**: Acompanhar console para detectar problemas cedo
4. **Testes Regulares**: Testar fluxo de autenticação em diferentes browsers
5. **Updates**: Manter Supabase SDK atualizado

## Contato para Suporte

Se problemas persistirem após essas implementações:

- Verificar logs detalhados no console
- Documentar passos para reproduzir o erro  
- Considerar contatar suporte do Supabase se o problema for sistemático