# 🧠 Memory Game

Jogo da memória desenvolvido com **React Native + Expo**, com suporte a temas claro/escuro, persistência de estatísticas e três níveis de dificuldade.

## Tecnologias

- [Expo SDK 56](https://expo.dev) + React Native 0.85
- [React Navigation v7](https://reactnavigation.org) (stack navigator)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) para persistência
- TypeScript — tipagem estrita
- Jest + ts-jest — testes unitários

## Como executar

```bash
npm install
npx expo start
```

Escaneie o QR Code com o app **Expo Go** ou pressione `a` (Android), `i` (iOS) ou `w` (web).

### Testes e typecheck

```bash
npm test         # roda a suíte de testes (Jest)
npm run typecheck # verifica tipos (tsc --noEmit)
```

## Como jogar

1. Na tela inicial, selecione uma dificuldade:
   - **Fácil** — 3×4 (6 pares)
   - **Médio** — 4×4 (8 pares)
   - **Difícil** — 4×5 (10 pares)
2. Toque em uma carta para revelar o emoji.
3. Toque em outra carta. Se forem iguais, o par fica marcado; caso contrário, as cartas viram de volta após 1 segundo.
4. Combine todos os pares para vencer!
5. Ao final, veja seu placar, tempo e tentativas. Estatísticas acumuladas ficam disponíveis na tela "Estatísticas".

## Estrutura do projeto

```
src/
├── App.tsx                  # Raiz: ErrorBoundary → ThemeProvider → Navigation
├── Navigation.tsx           # Navegador stack (Home → Game → Stats)
├── assets/                  # Assets planejados (emojis.json, themes.json)
├── components/
│   ├── Card.tsx             # Carta individual (React.memo) — respeita o tema
│   ├── DifficultySelector.tsx
│   ├── ErrorBoundary.tsx    # Captura erros de render (fallback seguro)
│   ├── GameBoard.tsx        # Grade de cartas
│   ├── GameOverModal.tsx    # Modal de fim de jogo (tempo congelado)
│   └── ScoreBoard.tsx       # Placar com timer, tentativas, pontuação
├── contexts/
│   └── ThemeContext.tsx     # Tema claro/escuro (detecta sistema)
├── hooks/
│   ├── useAsyncStorage.ts   # Leitura/escrita de estatísticas (+ erro)
│   ├── useGameLogic.ts      # Motor do jogo (flip, match, score, timeout)
│   └── useGameState.ts      # Salvamento/carregamento de snapshots
├── screens/
│   ├── GameScreen.tsx       # Tela principal do jogo
│   ├── HomeScreen.tsx       # Tela inicial / seleção de dificuldade
│   └── StatsScreen.tsx      # Estatísticas persistentes (+ botão Limpar Dados)
├── types/
│   ├── game.types.ts        # Card, GameState, Difficulty, GameStats
│   └── storage.types.ts     # Chaves do AsyncStorage
└── utils/
    ├── cardGenerator.ts     # Geração e embaralhamento (Fisher-Yates)
    ├── gameEngine.ts        # Regras puras: score, match, tempo (testável)
    └── storageManager.ts    # CRUD no AsyncStorage (com validação + try/catch)
```

## Pontuação

```
score = matchedPairs × 100 − attempts × 5
```

O score mínimo é 0. Combine todos os pares com o menor número de tentativas para obter a melhor pontuação.

## Persistência e robustez

- **AsyncStorage** guarda estatísticas (`@memory_game_stats`), snapshots de partida (`@memory_game_snapshot`) e configurações.
- `StorageManager` valida o schema ao ler (JSON corrompido, campos ausentes ou inconsistentes retornam `null` em vez de quebrar o app) e lança `StorageError` em falhas de escrita.
- **Error Boundary** na raiz evita telas em branco: qualquer erro de renderização (incluindo falhas de AsyncStorage) exibe uma tela de fallback com "Tentar novamente".
- `useGameLogic` limpa o timer de desvirar cartas ao desmontar a tela (ex.: voltar ao menu antes de 1s), evitando vazamento de memória.

## Acessibilidade

Componentes principais expõem `accessibilityRole`, `accessibilityLabel` e `accessibilityState` para leitores de tela (cartas, placar, seletor de dificuldade, estatísticas e botões).

## Testes

Cobertura de lógica pura e do hook principal (35 testes):

- `utils/gameEngine` — cálculo de score, match, tempo decorrido.
- `utils/cardGenerator` — tamanhos de grid por dificuldade, pares, ids únicos, shuffle.
- `utils/storageManager` — round-trip, corrupção de JSON, validação de schema, erro de IO.
- `hooks/useGameLogic` — flip, match, mismatch + timeout, limpeza na desmontagem, bloqueio de 3ª carta, reset, game over.

AsyncStorage é mockado em memória (`src/__tests__/mocks/asyncStorageMock.ts`); ambiente de teste: Node.
