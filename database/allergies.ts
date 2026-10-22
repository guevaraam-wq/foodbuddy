
import { db } from './db';

export const COMMON_ALLERGENS = [
  'Milk',
  'Eggs',
  'Peanuts',
  'Tree Nuts',
  'Wheat',
  'Soy',
  'Fish',
  'Shellfish',
  'Sesame',
] as const;

export async function getUserAllergies(
  userId: number
): Promise<string[]> {
  const rows = await db.getAllAsync<{ allergen: string }>(
    'SELECT allergen FROM user_allergies WHERE user_id = ? ORDER BY allergen',
    [userId]
  );

  return rows.map(row => row.allergen);
}

export async function saveUserAllergies(
  userId: number,
  allergies: string[]
): Promise<void> {
  const uniqueAllergies = [...new Set(allergies)];

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      'DELETE FROM user_allergies WHERE user_id = ?',
      [userId]
    );

    for (const allergen of uniqueAllergies) {
      await db.runAsync(
        'INSERT INTO user_allergies (user_id, allergen) VALUES (?, ?)',
        [userId, allergen]
      );
    }
  });
}
