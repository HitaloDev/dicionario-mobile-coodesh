# Dicionário Mobile

Aplicativo mobile para consulta de palavras em inglês, desenvolvido com React Native e Expo Router.

## Sobre o Projeto

Este é um app de dicionário que consome a [Free Dictionary API](https://dictionaryapi.dev/) para exibir palavras em inglês, suas definições, fonética e exemplos de uso. O app permite salvar palavras como favoritas e manter um histórico das palavras já visualizadas.

## Tecnologias Utilizadas

- React Native
- Expo
- Expo Router (navegação file-based)
- TypeScript
- React Navigation (Material Top Tabs)
- AsyncStorage (persistência local)
- Context API (gerenciamento de estado)

## Estrutura do Projeto

Optei por uma organização que separa componentes de estilos, facilitando a manutenção:

```
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

1. Instalar as dependências:
```bash
npm install
```

2. Iniciar o app:
```bash
npm start
```

3. Escolher a plataforma:
- Pressione `a` para abrir o app com o Android Studio

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
