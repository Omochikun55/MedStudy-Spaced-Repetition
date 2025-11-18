/**
 * SM-2アルゴリズムのインターフェース
 */
export interface Sm2Card {
  easeFactor: number; // 習熟度 (E-Factor)
  repetitions: number; // 反復回数
  interval: number; // 次の復習までの間隔（日数）
  nextReviewAt: Date; // 次の復習日時
}

/**
 * 復習の評価
 * 0: 全く思い出せない (Again)
 * 1: 辛うじて思い出せる
 * 2: 難しいが思い出せる
 * 3: 普通 (Good)
 * 4: 簡単 (Easy)
 * 5: 完璧 (Perfect)
 */
export type Quality = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * SM-2アルゴリズムを適用し、カードの状態を更新する関数
 * @param card 現在のカードの状態
 * @param quality 復習の評価 (0-5)
 * @returns 更新されたカードの状態
 */
export function sm2(card: Sm2Card, quality: Quality): Sm2Card {
  const { easeFactor, repetitions, interval } = card;

  // 1. 新しいE-Factorの計算
  let newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  // E-Factorは1.3以上を保証
  newEaseFactor = Math.max(1.3, newEaseFactor);

  // 2. 新しい反復回数と間隔の計算
  let newRepetitions: number;
  let newInterval: number;

  if (quality < 3) {
    // 評価が3未満の場合（失敗と見なす）
    newRepetitions = 0;
    newInterval = 1; // 次回は1日後
  } else {
    // 評価が3以上の場合（成功と見なす）
    newRepetitions = repetitions + 1;

    if (newRepetitions === 1) {
      newInterval = 1; // 1回目の成功は1日後
    } else if (newRepetitions === 2) {
      newInterval = 6; // 2回目の成功は6日後
    } else {
      // 3回目以降の成功
      // I(n) = I(n-1) * EF
      newInterval = Math.round(interval * newEaseFactor);
    }
  }

  // 3. 次の復習日時の計算
  const now = new Date();
  const nextReviewAt = new Date(now.getTime() + newInterval * 24 * 60 * 60 * 1000);

  return {
    easeFactor: newEaseFactor,
    repetitions: newRepetitions,
    interval: newInterval,
    nextReviewAt: nextReviewAt,
  };
}
