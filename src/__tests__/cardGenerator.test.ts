import { generateCards, shuffle } from '../utils/cardGenerator';

describe('cardGenerator', () => {
  it('easy gera 12 cartas (3x4) com 6 pares', () => {
    const cards = generateCards('easy');
    expect(cards).toHaveLength(12);
    const values = cards.map((c) => c.value);
    const unique = new Set(values);
    expect(unique.size).toBe(6);
    // cada valor aparece exatamente 2 vezes
    unique.forEach((v) => {
      expect(values.filter((x) => x === v)).toHaveLength(2);
    });
  });

  it('medium gera 16 cartas (4x4) com 8 pares', () => {
    const cards = generateCards('medium');
    expect(cards).toHaveLength(16);
    const values = cards.map((c) => c.value);
    expect(new Set(values).size).toBe(8);
  });

  it('hard gera 20 cartas (4x5) com 10 pares', () => {
    const cards = generateCards('hard');
    expect(cards).toHaveLength(20);
    const values = cards.map((c) => c.value);
    expect(new Set(values).size).toBe(10);
  });

  it('todas as cartas iniciam viradas para baixo e sem match', () => {
    const cards = generateCards('easy');
    cards.forEach((c) => {
      expect(c.isFlipped).toBe(false);
      expect(c.isMatched).toBe(false);
    });
  });

  it('gera ids únicos', () => {
    const cards = generateCards('medium');
    expect(new Set(cards.map((c) => c.id)).size).toBe(cards.length);
  });

  describe('shuffle', () => {
    it('não muta o array original', () => {
      const input = [1, 2, 3, 4, 5];
      const copy = [...input];
      shuffle(input);
      expect(input).toEqual(copy);
    });

    it('mantém os mesmos elementos (mesmo conjunto)', () => {
      const input = [1, 2, 3, 4, 5];
      const out = shuffle(input);
      expect(out.sort()).toEqual([1, 2, 3, 4, 5]);
    });
  });
});
