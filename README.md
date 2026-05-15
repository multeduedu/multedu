# 🚀 MULTEDU - Plataforma de Ensino de Matemática para Crianças

Bem-vindo ao **MULTEDU**, a plataforma inovadora que ensina matemática para crianças utilizando a metodologia de **Trachtenberg** de uma forma lúdica, interativa e gamificada. 

## 🌟 O que é o MULTEDU?

O **MULTEDU** transforma o cálculo mental rápido em uma experiência cativante. Focamos no desenvolvimento de habilidades matemáticas intuitivas, utilizando uma interface moderna e um sistema de progressão que incentiva o aluno a aprender praticando.

## ✨ Novidades da Versão (Branch: develop)

Esta versão traz a fundação tecnológica da plataforma totalmente integrada e **deployed em produção**:

- **Sessão do Aluno**: Identificação real do estudante via Supabase Auth.
- **Gamificação (XP)**: Sistema de experiência dinâmico onde cada atividade iniciada ou concluída soma pontos ao perfil do aluno.
- **Infraestrutura Supabase**: Persistência de dados na tabela `profiles` (Nome, XP, Nível Atual).
- **Segurança de Dados (OpSec)**: Implementação de Row Level Security (RLS) para garantir que cada aluno acesse apenas seu próprio progresso.
- **Avatares Personalizados**: Integração com DiceBear para geração de robôs dinâmicos baseados no perfil do usuário.
- **♿ Acessibilidade WCAG 2.1 AA**: Sistema completo de acessibilidade com suporte a deficiências visuais, auditivas e neurodiferentes.
- **📱 Otimização Mobile**: Layout responsivo compacto sem comprometer a lógica de cálculo - scroll eliminado em telas pequenas.

### 🌐 Deploy & Integrações Ativas

- **Vercel**: Plataforma deployada e online com DNS configurado.
- **Resend**: Integração de email funcionando perfeitamente.
  - **Cadastro**: Enviando e-mail de boas-vindas aos novos usuários. ✅
  - **Contato**: Enviando mensagens de contato para o administrador. ✅
- **DNS/Vercel**: Domínio verificado e totalmente operacional. ✅

## 🏗️ Melhorias de Infraestrutura Implementadas

Esta versão inclui **4 melhorias fundamentais** que elevam a qualidade, manutenibilidade e escalabilidade da plataforma:

### 1️⃣ Logger Estruturado 📊
- **Padrão**: Singleton com context propagation
- **Níveis**: `debug` (dev only), `info`, `warn`, `error`
- **Saída**: JSON estruturado com timestamp, environment e contexto
- **Métodos**: `setContext()`, `getContext()`, `clearContext()` para rastreamento de usuário
- **Ambiente**: Detecção automática (browser vs Node.js)
- **Uso**: Integrado em auth.ts, useAuth.ts e todas as API routes

### 2️⃣ Validação Zod Centralizada ✅
- **Schemas**: SignUp, SignIn, AddXP, ContactForm, UpdateProfile, AccessibilityPreferences
- **Reutilizáveis**: Campos padronizados (`emailField`, `passwordField`, `nameField`, etc.)
- **Helpers**: `validateData()` e `isValidationSuccess()` para type-safety
- **Constantes**: `ErrorMessages` com mensagens de erro padronizadas
- **Aplicação**: Validação em todas as API routes (400 para dados inválidos)
- **Tipagem**: Type extraction automática com `z.infer<typeof Schema>`

### 3️⃣ React Query com Cache Strategy 🚀
- **Timings**:
  - Perfil: 5 minutos (atualização frequente)
  - Atividades: 1 hora (dados estáticos)
  - Busca por ID: 1 hora
- **RetryConfig**: Smart retry (skip 4xx, 2x retry para 5xx)
- **Deduplicação**: Queries automáticas entre componentes
- **Invalidação**: Automática após mutations (signUp, addXP, updateProfile)
- **Componente**: `QueryProvider` integrado no root layout

### 4️⃣ APIs Centralizadas 🔌
**GET /api/users/profile** - Perfil autenticado
- Validação de autenticação (401)
- Retorna: `{ id, nome, xp, nivel_atual, created_at }`

**POST /api/users/xp** - Adicionar XP
- Validação Zod: `xpGain` (1-100), `activity`, metadata opcional
- Audit logging em `activity_log`
- Retorna: `{ success, newXP, xpGain }`

**GET /api/activities** - Listar atividades
- Dados cacheados por 1 hora
- Retorna: `{ success, data: activities[], count }`

**POST /api/contact** - Formulário de contato
- Validação Zod com name, email, subject, message
- Integrado com Resend para envio
- Retorna: `{ success, message }`

**GET /api/health** - Health check
- Monitoramento Vercel
- Retorna: `{ status: 'ok'|'error', timestamp, environment }`

### 🎨 Melhorias UX/UI
- **Login**: Indicação visual melhorada com texto + ícone em Desktop e Mobile
- **Logout**: Chama `signOut()` corretamente, força nova autenticação
- **Build**: ✅ TypeScript sem erros (14.4s)

## ♿ Acessibilidade e Recursos Inclusivos

O MULTEDU é desenvolvido com foco em **inclusão digital** e atende aos padrões **WCAG 2.1 AA**:

### 🔤 Escalas de Texto
- **Aumentar/Diminuir**: 3 níveis de zoom (87.5% a 112.5%)
- **Atalho**: `Alt + Shift + ↑` (aumentar) | `Alt + Shift + ↓` (diminuir) | `Alt + Shift + 0` (normal)
- **Persistência**: Preferência salva em `localStorage`

### 🌞 Modo Contraste Alto
- **Cores de Alto Contraste**: Melhora legibilidade para usuários com baixa visão
- **Modo Claro e Escuro**: Suporte a preferências do sistema
- **Atalho**: `Alt + Shift + C`
- **Persistência**: Preferência salva automaticamente

### 📖 Modo Dislexia-Amigável
- **Fonte OpenDyslexic**: Fonte otimizada para pessoas com dislexia
- **Espaçamento Aumentado**:
  - Letra: 0.05em (aumentado)
  - Linha: 1.8 (mais espaço entre linhas)
  - Palavras: 0.15em (maior distância)
- **Fundo Sepia**: #fef6e4 (reduz fadiga ocular)
- **Atalho**: `Alt + Shift + D`
- **Persistência**: Preferência salva automaticamente

### ⌨️ Atalhos Globais
| Atalho | Ação |
|--------|------|
| `Alt + Shift + ↑` | Aumentar texto |
| `Alt + Shift + ↓` | Diminuir texto |
| `Alt + Shift + 0` | Resetar texto |
| `Alt + Shift + C` | Alternar contraste alto |
| `Alt + Shift + D` | Modo dislexia-amigável |
| `Alt + Shift + L` | Abrir painel de acessibilidade |

### 📊 Barra de Acessibilidade
Localizada no topo de todas as páginas, com botões intuitivos para:
- **A − / A / A +** - Controle de tamanho do texto
- **◐ Contraste** - Modo alto contraste
- **ⓓ Dislexia** - Modo dislexia-amigável
 - **📖 Acessibilidade** - Painel de acessibilidade e atalhos
- **⌨️ Atalhos** - Tabela de atalhos rápidos

## 📱 Responsividade e Otimização Mobile

O MULTEDU foi otimizado para funcionar perfeitamente em dispositivos móveis:

- **Breakpoints Tailwind**: Adaptação automática para `sm` (640px), `md` (768px) e `lg` (1024px)
- **Compactação Vertical**: Layout reduzido no mobile com gaps e padding mínimos, mas sem scroll desnecessário
- **Telas de até 320px**: Suporte completo com inputs compactos e vídeos responsivos
- **Lógica Preservada**: Zero impacto no algoritmo de Trachtenberg - apenas ajustes visuais

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 15+ (App Router), Tailwind CSS e TypeScript.
- **Backend/Banco de Dados**: Supabase (PostgreSQL) com políticas de RLS.
- **Estado/Server Actions**: Gerenciamento de autenticação e progresso via Server Actions nativas do Next.js.

## 🚀 Como Funciona?

### 1. Cadastro e Perfil Real
Diferente de versões anteriores, o aluno agora cria uma conta real. Ao se cadastrar, um perfil é gerado automaticamente no banco de dados com 0 XP e o nível inicial "Regra do 11" .

### 2. Jornada de Aprendizado
O aluno navega pelo Dashboard dinâmico que exibe seu nome real e seu robô personalizado. Ao clicar em "Iniciar" em uma atividade como a **Multiplicação por 11**, o sistema registra o engajamento no servidor.

### 3. Sistema de Recompensas
O feedback é imediato: o XP acumulado é refletido na Sidebar, permitindo que o aluno visualize sua evolução em tempo real através da integração entre o Client e o Supabase.

---
