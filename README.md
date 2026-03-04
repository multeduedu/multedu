# 🚀 MULTEDU - Plataforma de Ensino de Matemática para Crianças

Bem-vindo ao **MULTEDU**, a plataforma inovadora que ensina matemática para crianças utilizando a metodologia de **Trachtenberg** de uma forma lúdica, interativa e gamificada. 

## 🌟 O que é o MULTEDU?

O **MULTEDU** transforma o cálculo mental rápido em uma experiência cativante. Focamos no desenvolvimento de habilidades matemáticas intuitivas, utilizando uma interface moderna e um sistema de progressão que incentiva o aluno a aprender praticando.

## ✨ Novidades da Versão (Branch: develop)

Esta versão traz a fundação tecnológica da plataforma totalmente integrada:

- **Sessão do Aluno**: Identificação real do estudante via Supabase Auth [cite: 23-14-51].
- **Gamificação (XP)**: Sistema de experiência dinâmico onde cada atividade iniciada ou concluída soma pontos ao perfil do aluno [cite: 23-14-51].
- **Infraestrutura Supabase**: Persistência de dados na tabela `profiles` (Nome, XP, Nível Atual) [cite: 14-28-11].
- **Segurança de Dados (OpSec)**: Implementação de Row Level Security (RLS) para garantir que cada aluno acesse apenas seu próprio progresso [cite: 14-32-12].
- **Avatares Personalizados**: Integração com DiceBear para geração de robôs dinâmicos baseados no perfil do usuário [cite: 12-11-54].

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 15+ (App Router), Tailwind CSS e TypeScript [cite: 05-48-02].
- **Backend/Banco de Dados**: Supabase (PostgreSQL) com políticas de RLS [cite: 14-28-11, 14-32-12].
- **Estado/Server Actions**: Gerenciamento de autenticação e progresso via Server Actions nativas do Next.js [cite: 23-14-51].

## 🚀 Como Funciona?

### 1. Cadastro e Perfil Real
Diferente de versões anteriores, o aluno agora cria uma conta real. Ao se cadastrar, um perfil é gerado automaticamente no banco de dados com 0 XP e o nível inicial "Regra do 11" [cite: 14-28-11, 23-14-51].

### 2. Jornada de Aprendizado
O aluno navega pelo Dashboard dinâmico que exibe seu nome real e seu robô personalizado [cite: 12-16-25]. Ao clicar em "Iniciar" em uma atividade como a **Multiplicação por 11**, o sistema registra o engajamento no servidor [cite: 23-14-51].

### 3. Sistema de Recompensas
O feedback é imediato: o XP acumulado é refletido na Sidebar, permitindo que o aluno visualize sua evolução em tempo real através da integração entre o Client e o Supabase [cite: 12-16-25, 14-32-12].

---

## 👨‍💻 Desenvolvimento (Branch develop)
As atualizações de infraestrutura e segurança nesta branch foram implementadas por **figueiredoelizeu**.