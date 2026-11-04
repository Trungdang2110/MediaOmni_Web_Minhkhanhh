import { useMemo } from 'react';
import { NumerologyHookType } from '@/utils/types';
import { calculate } from '@/src/lib/numerology';

/**
 * Tính 16 chỉ số bằng module `src/lib/numerology` (đặc tả: docs/numerology-spec.md).
 *
 * Hook này chỉ làm "người phiên dịch": gọi module tính toán rồi đổi kết quả sang
 * danh sách thẻ mà giao diện đang dùng (khóa `walksOfLife`, `mission`…).
 * Mọi công thức nằm trong module, không viết lại ở đây.
 *
 * Trả về mảng rỗng nếu họ tên hoặc ngày sinh chưa hợp lệ.
 */
export const useProcessNumerology = (
  fullName: string,
  birthDay: string
): NumerologyHookType[] => {
  const data = useMemo(() => {
    const parts = (birthDay ?? '').split('-').map(Number);
    if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return [];
    const [year, month, day] = parts;

    let r;
    try {
      r = calculate(fullName ?? '', { day, month, year });
    } catch {
      return [];
    }

    const list = (nums: number[]) => nums.join(' ');
    const four = (periods: { value: number }[]) =>
      ` ${periods.map((p) => p.value).join(' ')}`;

    return [
      { key: 'walksOfLife', value: r.lifePath, name: 'Đường đời', name_en: 'Path of life' },
      { key: 'mission', value: r.expression, name: 'Sứ mệnh', name_en: 'Mission' },
      { key: 'soul', value: r.soulUrge, name: 'Linh hồn', name_en: 'Soul' },
      {
        key: 'connect',
        // Kết nối có 2 số: (Đường đời ↔ Sứ mệnh) và (Linh hồn ↔ Nhân cách)
        value: `${r.bridges.lifePathExpression} · ${r.bridges.soulPersonality}`,
        name: 'Kết nối',
        name_en: 'Connection'
      },
      { key: 'personality', value: r.personality, name: 'Nhân cách', name_en: 'Personality' },
      { key: 'passion', value: list(r.hiddenPassion), name: 'Đam mê', name_en: 'Passion' },
      { key: 'mature', value: r.maturity, name: 'Trưởng thành', name_en: 'Mature' },
      { key: 'balance', value: r.balance, name: 'Cân bằng', name_en: 'Balance' },
      {
        key: 'subconsciousPower',
        value: r.subconsciousSelf,
        name: 'Sức mạnh tiềm thức',
        name_en: 'Subconscious Power'
      },
      {
        key: 'missingNumbers',
        value: list(r.karmicLessons),
        name: 'Số thiếu',
        name_en: 'Missing Numbers'
      },
      {
        key: 'rationalThinking',
        value: r.rationalThought,
        name: 'Tư duy lý trí',
        name_en: 'Rational Thinking'
      },
      { key: 'way', value: four(r.pinnacles), name: 'Chặng', name_en: 'Way' },
      {
        key: 'challenges',
        value: four(r.challenges),
        name: 'Thách thức',
        name_en: 'Challenges'
      },
      {
        key: 'dateOfBirth',
        value: r.birthday.value,
        name: 'Ngày sinh',
        name_en: 'Date Of Birth'
      },
      {
        key: 'yearIndividual',
        value: r.personalYear.value,
        name: 'Năm cá nhân',
        name_en: 'Individual Year'
      },
      {
        key: 'monthIndividual',
        value: r.personalMonth.value,
        name: 'Tháng cá nhân',
        name_en: 'Individual Month'
      }
    ];
  }, [fullName, birthDay]);
  return data;
};
