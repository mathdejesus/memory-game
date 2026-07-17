// Mock em memória do @react-native-async-storage/async-storage.
// Implementa apenas o subconjunto usado pelo StorageManager.
const store = new Map<string, string>();

export default {
  setItem: jest.fn(async (key: string, value: string) => {
    store.set(key, value);
  }),
  getItem: jest.fn(async (key: string) => {
    return store.has(key) ? store.get(key)! : null;
  }),
  removeItem: jest.fn(async (key: string) => {
    store.delete(key);
  }),
  multiRemove: jest.fn(async (keys: string[]) => {
    keys.forEach((k) => store.delete(k));
  }),
  clear: jest.fn(async () => {
    store.clear();
  }),
  getAllKeys: jest.fn(async () => Array.from(store.keys())),
};

/** Limpa o armazenamento entre testes. */
export function __clearStore() {
  store.clear();
}
