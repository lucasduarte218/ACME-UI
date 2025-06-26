# ACME Clínica – Sistema de Gestão de Pacientes e Atendimentos

## Visão Geral

Este projeto é um sistema web moderno para gestão de pacientes e atendimentos, desenvolvido com React, Vite e TypeScript. O objetivo é proporcionar uma experiência visual inspirada em sistemas de clínicas/saúde, com foco em usabilidade, responsividade e integração com API.

## Funcionalidades

- **Dashboard**: Visão geral com cards de métricas (total de pacientes, pacientes ativos, total de atendimentos, atendimentos do dia) e lista de atendimentos ativos das últimas 2 horas.
- **Gestão de Pacientes**:
  - Listagem com filtros (nome, CPF, status).
  - Cadastro e edição via modal com validação de formulário.
  - Inativação de pacientes com confirmação.
  - Visual moderno, responsivo e com feedbacks visuais (toasts).
- **Gestão de Atendimentos**:
  - Listagem com filtros (data inicial/final, paciente, status).
  - Cadastro e edição via modal, com seleção de paciente ativo.
  - Inativação de atendimentos com confirmação.
  - Exibição de descrições longas com tooltip.
- **Experiência Visual**:
  - Sidebar colorida com ícones.
  - Cards, tabelas e modais estilizados.
  - Skeleton loaders durante carregamento.
  - Responsividade total para desktop e mobile.
- **Integração com API**:
  - Consumo centralizado de endpoints REST.
  - Filtros e listagens dinâmicas.
  - Mensagens de erro amigáveis.

## Tecnologias Utilizadas

- [React](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/) para estilização
- [shadcn/ui](https://ui.shadcn.com/) para componentes visuais
- [react-hook-form](https://react-hook-form.com/) + [zod](https://zod.dev/) para formulários e validação
- [tanstack/react-query](https://tanstack.com/query/latest) para gerenciamento de dados
- [sonner](https://sonner.emilkowal.ski/) para toasts
- [lucide-react](https://lucide.dev/) para ícones

## Estrutura de Pastas

```
src/
  components/
    appointments/   # Componentes de atendimentos
    patients/       # Componentes de pacientes
    ui/             # Componentes visuais reutilizáveis
  hooks/            # Hooks customizados
  pages/            # Páginas principais (Home, Patients, Appointments)
  services/         # Serviços de API
  types/            # Tipos TypeScript globais
  config/           # Configurações (ex: API)
  App.tsx           # Layout principal
  main.tsx          # Bootstrap do app
```

## Como rodar localmente

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Configure a URL da API no arquivo `.env`:
   ```env
   VITE_API_BASE_URL=https://localhost:7147/api
   ```
3. Rode o projeto:
   ```bash
   npm run dev
   ```

## Como fazer deploy no Firebase Hosting

1. Instale o Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Faça login:
   ```bash
   firebase login
   ```
3. Inicialize o Firebase Hosting:
   ```bash
   firebase init
   ```
   - Escolha "Hosting"
   - Selecione ou crie um projeto
   - Defina `dist` como pasta de deploy
   - Configure como SPA (redirecionamento para index.html)
4. Build do projeto:
   ```bash
   npm run build
   ```
5. Deploy:
   ```bash
   firebase deploy
   ```

## Diferenciais

- Visual moderno e responsivo
- Skeleton loaders para melhor UX
- Tooltips para textos longos
- Acessibilidade básica (aria-labels)
- Código limpo, tipado e organizado

---

Desenvolvido para fins de teste técnico.

Lucas Duarte
