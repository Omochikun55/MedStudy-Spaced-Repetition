import { sm2, Sm2Card, Quality } from './sm2';

// Dateのモック
const MOCK_DATE = new Date('2025-11-18T10:00:00.000Z');
global.Date.now = jest.fn(() => MOCK_DATE.getTime());

describe('SM-2 Algorithm', () => {
  const initialCard: Sm2Card = {
    easeFactor: 2.5,
    repetitions: 0,
    interval: 0,
    nextReviewAt: MOCK_DATE,
  };

  it('should reset repetitions and set interval to 1 for quality < 3', () => {
    const card1 = sm2(initialCard, 2 as Quality);
    expect(card1.repetitions).toBe(0);
    expect(card1.interval).toBe(1);
    expect(card1.easeFactor).toBeCloseTo(2.34, 2);
    expect(card1.nextReviewAt.getTime()).toBeCloseTo(MOCK_DATE.getTime() + 1 * 24 * 60 * 60 * 1000, -3);

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
    expect(card.nextReviewAt.getTime()).toBeCloseTo(MOCK_DATE.getTime() + 1 * 24 * 60 * 60 * 1000, -3);
  });

  it('should set interval to 6 for the second successful repetition (quality >= 3)', () => {
    const firstSuccess: Sm2Card = { ...initialCard, repetitions: 1, interval: 1, easeFactor: 2.5 };
    const card = sm2(firstSuccess, 4 as Quality);
    expect(card.repetitions).toBe(2);
    expect(card.interval).toBe(6);
    expect(card.easeFactor).toBeCloseTo(2.5, 2);
    expect(card.nextReviewAt.getTime()).toBeCloseTo(MOCK_DATE.getTime() + 6 * 24 * 60 * 60 * 1000, -3);
  });

  it('should calculate interval using EF for third and subsequent successful repetitions', () => {
    const secondSuccess: Sm2Card = { ...initialCard, repetitions: 2, interval: 6, easeFactor: 2.6 };
    const card = sm2(secondSuccess, 5 as Quality);
    expect(card.repetitions).toBe(3);
    expect(card.interval).toBe(Math.round(6 * 2.7)); // 16
    expect(card.easeFactor).toBeCloseTo(2.6, 2);
    expect(card.nextReviewAt.getTime()).toBeCloseTo(MOCK_DATE.getTime() + 16 * 24 * 60 * 60 * 1000, -3);
  });

  it('should correctly update EF for quality 0', () => {
    const card = sm2(initialCard, 0 as Quality);
    expect(card.easeFactor).toBeCloseTo(1.7, 2);
  });
});
