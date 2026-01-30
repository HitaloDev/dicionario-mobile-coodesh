# Dicionário Mobile

Aplicativo mobile para consulta de palavras em inglês, desenvolvido com React Native e Expo Router.

## Sobre o Projeto

Este é um app de dicionário que consome a [Free Dictionary API](https://dictionaryapi.dev/) para exibir palavras em inglês, suas definições, fonética e exemplos de uso. O app permite salvar palavras como favoritas e manter um histórico das palavras já visualizadas.

## Tecnologias Utilizadas

- React Native
- Expo (SDK 54)
- Expo Router (navegação file-based)
- TypeScript
- React Navigation (Material Top Tabs)
- Supabase (banco de dados e autenticação)
- AsyncStorage (persistência local e cache)
- Context API (gerenciamento de estado)

## Estrutura do Projeto

Optei por uma organização que separa componentes de estilos, facilitando a manutenção:

```
src/
  ├── components/          - Componentes reutilizáveis
  │   ├── word-card/
  │   └── empty-state/
  ├── services/            - Chamadas de API e cache
  │   ├── api.ts
  │   └── cache.ts
  ├── types/               - TypeScript types/interfaces
  ├── contexts/            - Context API para estado global
  ├── utils/               - Funções utilitárias
  └── constants/           - Constantes e cores

app/
  ├── (tabs)/
  │   ├── word-list.tsx
  │   ├── history-screen.tsx
  │   ├── favorites-screen.tsx
  │   ├── _layout.tsx
  │   └── styles/
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
- Implementação de scroll infinito na lista de palavras
- Estados de loading e erro
- Integração com lista de palavras do repositório dwyl/english-words
- Documentação completa de setup do Supabase

## Decisões Técnicas

**Por que Supabase ao invés de Firebase?**
- Plano gratuito mais generoso
- PostgreSQL nativo facilita queries relacionais
- Melhor DX com TypeScript
- API REST automática

**Estrutura de pastas**
- Estilos separados para facilitar manutenção
- Pasta `src/` centralizando a regra de negócio
- Componentes reutilizáveis facilitando utilização e manutenção
- Seguindo boas práticas de Clean Code

## Desafio

> This is a challenge by [Coodesh](https://coodesh.com/)