import { FC } from 'react';
import { NumerologyHookType } from '@/utils/types';
import { useTranslations } from 'next-intl';
import { METRIC_GROUP } from './metricGroups';

type PropTypes = {
  item: NumerologyHookType;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  featured?: boolean;
};

/**
 * Thẻ chỉ số (IndexCard) — "một bức chân dung trong phòng tranh":
 * tên chỉ số ở trên, con số lớn nằm trong khung oval vàng, tên nhóm ở dưới.
 * Màu nền thẻ đổi theo nhóm chỉ số (xem metricGroups.ts).
 */
export const RenderItem: FC<PropTypes> = ({ item, onClick, featured }) => {
  const t = useTranslations('NumerologyMetrics');
  const tNum = useTranslations('Numerology');
  const group = METRIC_GROUP[item.key] ?? 'support';

  // Chọn cỡ khung oval theo độ dài con số để không bị tràn
  const text = String(item.value ?? '').trim();
  const isMulti = /\s|,/.test(text);
  let ovalMod = '';
  if (text.length > 7) ovalMod = 'pr-card__oval--wide pr-card__oval--long';
  else if (isMulti) ovalMod = 'pr-card__oval--wide pr-card__oval--multi';
  else if (text.length >= 2) ovalMod = 'pr-card__oval--master';

  return (
    <button
      type="button"
      className={`pr-card pr-card--${group}${featured ? ' pr-card--featured' : ''}`}
      onClick={onClick}
      aria-label={tNum('openFormula', { name: t(item.key as any) })}
    >
      <span className="pr-card__title">{t(item.key as any)}</span>
      <span className={`pr-card__oval ${ovalMod}`}>{text || '—'}</span>
      <span className="pr-card__meta">{tNum(`group.${group}` as any)}</span>
    </button>
  );
};
