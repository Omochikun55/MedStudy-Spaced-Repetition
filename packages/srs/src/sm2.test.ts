
import { sm2, Sm2Card, Quality } from './sm2';

// Dateのモック
// テストの安定性を確保するため、Date.now()が常に同じ値を返すように設定
const MOCK_DATE_NOW = 1763460000000; // 2025-11-18T10:00:00.000Z
const MOCK_DATE = new Date(MOCK_DATE_NOW);
global.Date.now = jest.fn(() => MOCK_DATE_NOW);

describe('SM-2 Algorithm', () => {
  const initialCard: Sm2Card = {
    easeFactor: 2.5,
    repetitions: 0,
    interval: 0,
    nextReviewAt: new Date(MOCK_DATE_NOW),
  };

  // 1日をミリ秒に変換する定数
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  it('should reset repetitions and set interval to 1 for quality < 3', () => {
    const card1 = sm2(initialCard, 2 as Quality);
    expect(card1.repetitions).toBe(0);
    expect(card1.interval).toBe(1);
    expect(card1.easeFactor).toBeCloseTo(2.34, 2);
    expect(card1.nextReviewAt.getTime()).toBeCloseTo(MOCK_DATE_NOW + ONE_DAY_MS, -6);;
    const card2 = sm2({ ...initialCard, repetitions: 5, easeFactor: 2.0 }, 0 as Quality);
    expect(card2.repetitions).toBe(0);
    expect(card2.interval).toBe(1);
    expect(card2.easeFactor).toBeCloseTo(1.3, 2);
  });

  it('should set interval to 1 for the first successful repetition (quality >= 3)', () => {
    const card = sm2(initialCard, 3 as Quality);
    expect(card.repetitions).toBe(1);
    expect(card.interval).toBe(1);
    expect(card.easeFactor).toBeCloseTo(2.36, 2);
    expect(card.nextReviewAt.getTime()).toBeCloseTo(MOCK_DATE_NOW + ONE_DAY_MS, -6);
  });

  it('should set interval to 6 for the second successful repetition (quality >= 3)', () => {
    const firstSuccess: Sm2Card = { ...initialCard, repetitions: 1, interval: 1, easeFactor: 2.36 };
    const card = sm2(firstSuccess, 4 as Quality);
    expect(card.repetitions).toBe(2);
    expect(card.interval).toBe(6);
    expect(card.easeFactor).toBeCloseTo(2.36, 2);
   expect(card.nextReviewAt.getTime()).toBeCloseTo(MOCK_DATE_NOW + 6 * ONE_DAY_MS, -6);
  });

  it('should calculate interval using EF for third and subsequent successful repetitions', () => {
    const secondSuccess: Sm2Card = { ...initialCard, repetitions: 2, interval: 6, easeFactor: 2.36 };
    const card = sm2(secondSuccess, 5 as Quality);
    const expectedInterval = Math.round(6 * 2.46);
    expect(card.repetitions).toBe(3);
    expect(card.interval).toBe(expectedInterval);
    expect(card.easeFactor).toBeCloseTo(2.46, 2);
    expect(card.nextReviewAt.getTime()).toBeCloseTo(MOCK_DATE_NOW + expectedInterval * ONE_DAY_MS, -6);  });

  it('should not let easeFactor fall below 1.3', () => {
    const lowEfCard: Sm2Card = { ...initialCard, easeFactor: 1.3 };
    const card = sm2(lowEfCard, 0 as Quality);
    expect(card.easeFactor).toBe(1.3);
  });
});

