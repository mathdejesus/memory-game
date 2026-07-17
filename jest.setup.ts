// Configuração global do Jest (roda após o ambiente de teste ser instalado,
// garantindo acesso aos globals como beforeEach).
// Garante estado limpo do mock de AsyncStorage antes de cada teste.
import { __clearStore } from './src/__tests__/mocks/asyncStorageMock';

beforeEach(() => {
  __clearStore();
});
