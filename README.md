# Sistema de Gestão de Pacientes e Atendimentos

Este projeto é um sistema web para gerenciar pacientes e atendimentos, desenvolvido com React, Vite e TypeScript.

## Estrutura
- **src/types**: Tipos TypeScript globais
- **src/services**: Serviços de API
- **src/components**: Componentes reutilizáveis (Layout, Pacientes, Atendimentos)
- **src/pages**: Páginas principais (Home, Pacientes, Atendimentos)

## Como rodar
1. Instale as dependências:
   ```
npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```
npm run dev
   ```

Acesse `http://localhost:5173` no navegador.

## Observações
- Configure a URL base da API em `src/services/api.ts` conforme seu backend.
- O projeto utiliza `react-router-dom` para navegação.
