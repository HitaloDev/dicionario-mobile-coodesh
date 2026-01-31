# Dicionário Mobile

Aplicativo mobile para consulta de palavras em inglês, desenvolvido com React Native e Expo Router.

## Sobre o Projeto

Este é um app de dicionário que consome a [Free Dictionary API](https://dictionaryapi.dev/) para exibir palavras em inglês, suas definições, fonética e exemplos de uso. O app permite salvar palavras como favoritas e manter um histórico das palavras já visualizadas.

![App Screenshot](./assets/mockup-app.png)

## Tecnologias Utilizadas

- React Native
- Expo (SDK 54)
- Expo Router (navegação file-based)
- TypeScript
- React Navigation (Material Top Tabs)
- Supabase (banco de dados PostgreSQL e autenticação)
- AsyncStorage (persistência local e cache)
- Context API (gerenciamento de estado)
- Expo Audio (player de áudio para pronúncia)
- Free Dictionary API
- TSyringe (injeção de dependência)
- Jest (testes unitários)

## Estrutura do Projeto

Optei por uma organização que separa componentes de estilos, facilitando a manutenção:

```
src/
  ├── components/          - Componentes reutilizáveis
  │   ├── word-card/
  │   ├── empty-state/
  │   └── search-bar/
  ├── services/            - Chamadas de API e cache
  │   ├── api.ts
  │   ├── cache.ts
  │   ├── supabase.ts
  │   ├── words-service.ts
  │   └── sync-service.ts
  ├── types/               - TypeScript types/interfaces
  ├── contexts/            - Context API para estado global
  ├── utils/               - Funções utilitárias
  ├── constants/           - Constantes e cores
  └── di/                  - Container de injeção de dependência

app/
  ├── (tabs)/
  │   ├── word-list.tsx
  │   ├── history-screen.tsx
  │   ├── favorites-screen.tsx
  │   ├── _layout.tsx
  │   └── styles/
  ├── word-details.tsx     - Tela de detalhes da palavra
  ├── login.tsx            - Tela de login
  ├── register.tsx         - Tela de registro
  └── _layout.tsx
```

## Como Executar

### 1. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

**Windows (PowerShell):**
```powershell
copy .env.example .env
```

**Mac/Linux:**
```bash
cp .env.example .env
```

As credenciais do Supabase já estão configuradas e prontas para uso!

### 2. Instalar dependências

```bash
npm install
```

### 3. Iniciar o app

```bash
npm start
```

### 4. Escolher a plataforma

- Pressione `a` para Android
- Pressione `i` para iOS
- Pressione `w` para Web

## Testes

O projeto possui testes unitários configurados com Jest e Testing Library.

### Rodar todos os testes
```bash
npm test
```

Os testes cobrem:
- Serviços (API, Cache, Storage)
- Componentes (EmptyState, WordCard)
- Lógica de negócio

## O que já foi Implementado

### Primeiro Commit - Limpeza Inicial
- Remoção dos arquivos demo e componentes de exemplo do Expo
- Exclusão de imagens e scripts não utilizados
- Criação da estrutura base limpa do projeto

### Segundo Commit - Estruturação das Telas
- Criação das 3 telas principais (Lista de Palavras, Histórico e Favoritos)
- Implementação de tabs no topo seguindo o wireframe
- Layout em grid de 3 colunas para exibir as palavras
- Separação dos estilos dentro de um arquivo styles.ts
- Adição de palavras mockadas para simular o consumo da API
- Organização e estruturação de pastas e arquivos

### Terceiro Commit - Arquitetura e Componentização + Supabase
- Criação da pasta `src/` para melhor organização do código
- Implementação de componentes reutilizáveis (WordCard com estrela de favorito, EmptyState)
- Criação de tipos TypeScript para Word, Phonetic, Meaning, Definition
- Serviço de API para comunicação com o Free Dictionary API
- Sistema de cache com AsyncStorage para otimizar requisições
- Context API (DictionaryContext) para gerenciamento de estado global
- Serviço de storage para persistência de favoritos e histórico
- Constantes de cores centralizadas
- Integração dos componentes nas telas existentes
- Arquitetura escalável seguindo princípios de Clean Code
- Configuração do Supabase como banco de dados
- Criação do serviço de palavras (words-service)
- Implementação de scroll infinito na lista de palavras (30 palavras por vez)
- Estados de loading e erro
- Integração com ~470.000 palavras do repositório dwyl/english-words

### Quarto Commit - Busca e Tela de Detalhes
- Componente SearchBar com ícones e botão de limpar
- Busca em tempo real com debounce (1 segundo) para otimizar chamadas
- Filtro instantâneo na lista de palavras
- Tela de detalhes integrada com Free Dictionary API
- Card roxo (#5956E9) com palavra e fonética
- Player de áudio para pronúncia usando expo-audio
- Exibição de meanings, definições e exemplos de uso
- Sinônimos exibidos em chips
- Sistema de cache inteligente para otimizar requisições
- Botão de favoritar na tela de detalhes
- Navegação fluida entre lista e detalhes
- Tratamento de erros com opção de retry
- Alerta quando palavra não é encontrada na API

### Quinto Commit - Autenticação e Sincronização
- Telas de Login e Registro com logo
- Autenticação via Supabase (email/senha)
- Login automático após registro
- Header com botão de logout
- Proteção de rotas (redirecionamento automático)
- Sincronização de favoritos e histórico na nuvem
- Tabelas com Row Level Security (RLS) no Supabase
- Fallback para dados locais se offline
- Context de autenticação global
- Performance otimizada na listagem (60 itens por vez, queries sem count)

### Sexto Commit - Injeção de Dependência e Testes
- Implementação de DI com TSyringe
- Refatoração de serviços para classes injetáveis
- Configuração de decorators no TypeScript
- Container de dependências centralizado
- Testes unitários com Jest e Testing Library
- Testes de serviços (API, Cache, Storage)
- Testes de componentes (EmptyState)
- Scripts npm para rodar testes
- Cobertura de código configurada

## Decisões Técnicas

**Por que Supabase ao invés de Firebase?**
- Plano gratuito mais generoso
- PostgreSQL nativo facilita queries relacionais
- Melhor DX com TypeScript
- API REST automática

**Por que TSyringe para DI?**
- Biblioteca leve e simples da Microsoft
- Decorators nativos do TypeScript
- Fácil integração com React Native
- Facilita testes e manutenção

**Por que Jest + Testing Library?**
- Suporte nativo do Expo
- Padrão da comunidade React Native
- Fácil de escrever testes úteis
- Boa documentação

**Estrutura de pastas**
- Estilos separados para facilitar manutenção
- Pasta `src/` centralizando a regra de negócio
- Componentes reutilizáveis facilitando utilização e manutenção
- Seguindo boas práticas de Clean Code

## Desafio

> This is a challenge by [Coodesh](https://coodesh.com/)