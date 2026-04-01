# 🚀 MULTEDU - Plataforma de Ensino de Matemática para Crianças

Bem-vindo ao **MULTEDU**, a plataforma inovadora que ensina matemática para crianças utilizando a metodologia de **Trachtenberg** de uma forma lúdica, interativa e gamificada. 

## 🌟 O que é o MULTEDU?

O **MULTEDU** transforma o cálculo mental rápido em uma experiência cativante. Focamos no desenvolvimento de habilidades matemáticas intuitivas, utilizando uma interface moderna e um sistema de progressão que incentiva o aluno a aprender praticando.

## ✨ Novidades da Versão (Branch: develop)

Esta versão traz a fundação tecnológica da plataforma totalmente integrada:

- **Sessão do Aluno**: Identificação real do estudante via Supabase Auth .
- **Gamificação (XP)**: Sistema de experiência dinâmico onde cada atividade iniciada ou concluída soma pontos ao perfil do aluno.
- **Infraestrutura Supabase**: Persistência de dados na tabela `profiles` (Nome, XP, Nível Atual).
- **Segurança de Dados (OpSec)**: Implementação de Row Level Security (RLS) para garantir que cada aluno acesse apenas seu próprio progresso
- - **Avatares Personalizados**: Integração com DiceBear para geração de robôs dinâmicos baseados no perfil do usuário.

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
