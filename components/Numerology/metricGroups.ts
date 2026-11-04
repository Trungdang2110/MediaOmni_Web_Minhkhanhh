/**
 * Xếp 16 chỉ số vào 4 nhóm màu của design system Pyra Rococo.
 * Mỗi nhóm có một màu thẻ riêng để khách nhận ra nhóm chỉ bằng mắt:
 *  - personal  (Cá nhân)            → thẻ đỏ rượu
 *  - potential (Tiềm năng & xu hướng) → thẻ xanh phấn
 *  - support   (Bổ trợ)             → thẻ giấy + viền vàng
 *  - cycle     (Thời gian & chu kỳ)  → thẻ hồng đào
 *
 * Giả định (chưa chốt trong tài liệu, cần chủ dự án kiểm tra):
 * "Ngày sinh" xếp vào nhóm Tiềm năng.
 */
export type MetricGroup = 'personal' | 'potential' | 'support' | 'cycle';

export const METRIC_GROUP: Record<string, MetricGroup> = {
  walksOfLife: 'personal',
  mission: 'personal',
  soul: 'personal',
  personality: 'personal',

  passion: 'potential',
  mature: 'potential',
  subconsciousPower: 'potential',
  rationalThinking: 'potential',
  dateOfBirth: 'potential',

  connect: 'support',
  balance: 'support',
  missingNumbers: 'support',

  way: 'cycle',
  challenges: 'cycle',
  yearIndividual: 'cycle',
  monthIndividual: 'cycle'
};

export const GROUP_ORDER: MetricGroup[] = [
  'personal',
  'potential',
  'support',
  'cycle'
];

/** Chỉ số được trưng bày nổi bật (thẻ vòm) phía trên lưới */
export const FEATURED_METRIC = 'walksOfLife';
