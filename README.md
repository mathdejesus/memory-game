# 🧠 Memory Game

Jogo da memória desenvolvido com **React Native + Expo**, com suporte a temas claro/escuro, persistentcia de estatísticas e três níveis de dificuldade.

## Tecnologias

- [Expo SDK 56](https://expo.dev) + React Native 0.85
- [React Navigation v7](https://reactnavigation.org) (stack navigator)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) para persistência
- TypeScript 6 — tipagem estrita

## Como executar

```bash
npm install
npx expo start
```

Escaneie o QR Code com o app **Expo Go** ou pressione `a` (Android), `i` (iOS) ou `w` (web).

## Como jogar

1. Na tela inicial, selecione uma dificuldade:
   - **Fácil** — 3×4 (6 pares)
   - **Médio** — 4×4 (8 pares)
   - **Difícil** — 4×5 (10 pares)
2. Toque em uma carta para revelar o emoji.
3. Toque em outra carta. Se forem iguais, o par é removido; caso contrário, as cartas viram de volta após 1 segundo.
4. Combine todos os pares para vencer!
5. Ao final, veja seu placar, tempo e tentativas. Estatísticas acumuladas ficam disponíveis na tela "Estatísticas".

## Estrutura do projeto

```
src/
├── App.tsx                # Componente raiz com ThemeProvider
├── Navigation.tsx         # Navegador stack (Home → Game → Stats)
├── assets/                # Assets planejados (emojis.json, themes.json)
├── components/
│   ├── Card.tsx           # Carta individual (React.memo)
│   ├── DifficultySelector.tsx
│   ├── GameBoard.tsx      # Grade de cartas
│   ├── GameOverModal.tsx  # Modal de fim de jogo
│   └── ScoreBoard.tsx     # Placar com timer, tentativas, pontuação
├── contexts/
│   └── ThemeContext.tsx    # Tema claro/escuro (detecta sistema)
├── hooks/
│   ├── useAsyncStorage.ts # Leitura/escrita de estatísticas
│   ├── useGameLogic.ts    # Motor do jogo (flip, match, score)
│   └── useGameState.ts    # Salvamento/carregamento de snapshots
├── screens/
│   ├── GameScreen.tsx     # Tela principal do jogo
│   ├── HomeScreen.tsx     # Tela inicial / seleção de dificuldade
│   └── StatsScreen.tsx    # Estatísticas persistentes
├── types/
│   ├── game.types.ts      # Card, GameState, Difficulty, GameStats
│   └── storage.types.ts   # Chaves do AsyncStorage
└── utils/
    ├── cardGenerator.ts   # Geração e embaralhamento (Fisher-Yates)
    └── storageManager.ts  # CRUD no AsyncStorage
```

## Pontuação

```
score = matchedPairs × 100 − attempts × 5
```

O score mínimo é 0. Combine todos os pares com o menor número de tentativas para obter a melhor pontuação.
