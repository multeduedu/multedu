# 🚀 Fluxo de Desenvolvimento - MultEdu

Para manter o projeto organizado e evitar conflitos de código, todos os colaboradores devem seguir este fluxo base:

## 1. Sincronização Inicial

Antes de começar qualquer tarefa, atualize sua branch local com o que há de mais novo no servidor:
```bash
git checkout develop
git pull origin develop
npm install


## 2. Criação das Funcionalidade (Branching)
Nunca trabalhe diretamente na 'develop' ou na 'main'.crie uma branch especifica:


git checkout -b feat/nome-da-sua-tarefa

Exemplos: feat/login-supabase, feat/regra-trachtenberg-11, feat/ajuste-css-home.

3. Desenvolvimento e Testes
Execute o ambiente de desenvolvimento para validar suas alterações em tempo real:

npm run dev

O projeto estará disponível em: http://localhost:3000

4. Envio de Código (Commit e Push)

Após finalizar e testar a funcionalidade:

Adicione os arquivos: git add .

Crie o commit: git commit -m "tipo: descrição curta"

(Tipos comuns: feat para novas funções, fix para correções, docs para documentação)

Suba para o GitHub: git push origin feat/nome-da-sua-tarefa

5. Consolidação (Pull Request)

Vá para o repositório no GitHub.

Clique em "Compare & pull request".

Destino (Base): develop | Origem (Compare): sua-branch 

Aguarde a revisão do (Eduardo) antes do merge.