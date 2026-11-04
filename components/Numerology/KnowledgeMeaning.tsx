'use client';
import { type FC } from 'react';
import numbersData from '@/knowledge/structured/numbers.json';
import indicesData from '@/knowledge/structured/indices.json';
import cyclesData from '@/knowledge/structured/cycles.json';
import supportingData from '@/knowledge/structured/supporting.json';

/**
 * Hiển thị ý nghĩa con số lấy TRỰC TIẾP từ kho kiến thức Pyra (knowledge/structured),
 * không gọi AI → không tốn chi phí, hiện ngay khi bấm thẻ.
 *
 * Kho kiến thức hiện chỉ có tiếng Việt; component này chỉ nên dùng khi locale = 'vi'.
 * Khóa chỉ số của web (walksOfLife…) được ghép với khóa của kho (life_path…) ở INDEX_KEY.
 */

type Entry = Record<string, any>;

const INDEX_KEY: Record<string, string> = {
  walksOfLife: 'life_path',
  mission: 'expression',
  soul: 'soul_urge',
  personality: 'personality',
  passion: 'hidden_passion',
  mature: 'maturity',
  rationalThinking: 'rational_thought',
  subconsciousPower: 'subconscious_self',
  connect: 'bridge',
  balance: 'balance',
  missingNumbers: 'karmic_lessons',
  dateOfBirth: 'birthday',
  yearIndividual: 'personal_year',
  monthIndividual: 'personal_month',
  way: 'pinnacle',
  challenges: 'challenge'
};

/** Chỉ số lấy nghĩa từ numbers.json; true = hiện thêm "công việc / quan hệ" */
const FROM_NUMBERS: Record<string, boolean> = {
  walksOfLife: true,
  mission: true,
  soul: true,
  personality: true,
  passion: false,
  mature: false,
  rationalThinking: false,
  dateOfBirth: false
};

const findBySo = (list: Entry[] | undefined, so: number): Entry | undefined =>
  list?.find((x) => x.so === so);

/** "8 7 6 11" | 5 | "2" → [8, 7, 6, 11] */
const parseValues = (value: unknown): number[] =>
  (String(value ?? '').match(/\d+/g) ?? []).map(Number);

const List: FC<{ title: string; items?: string[] }> = ({ title, items }) =>
  items && items.length ? (
    <>
      <h4>{title}</h4>
      <ul>
        {items.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </>
  ) : null;

const NumberBlock: FC<{ entry: Entry; extra: boolean }> = ({ entry, extra }) => (
  <>
    <h3>
      {entry.so} · {entry.ten}
    </h3>
    {entry.tu_khoa?.length ? (
      <div className="pyra-chips">
        {entry.tu_khoa.map((k: string) => (
          <span key={k} className="pyra-chip">
            {k}
          </span>
        ))}
      </div>
    ) : null}
    <p>{entry.ban_chat}</p>
    <List title="Điểm mạnh" items={entry.diem_manh} />
    <List title="Thử thách" items={entry.thu_thach} />
    <List title="Gợi ý" items={entry.goi_y} />
    {extra && entry.cong_viec ? (
      <>
        <h4>Công việc</h4>
        <p>{entry.cong_viec}</p>
      </>
    ) : null}
    {extra && entry.quan_he ? (
      <>
        <h4>Các mối quan hệ</h4>
        <p>{entry.quan_he}</p>
      </>
    ) : null}
  </>
);

const Simple: FC<{ label?: string; entry: Entry; text: string }> = ({
  label,
  entry,
  text
}) => (
  <>
    <h3>
      {label ? `${label} ` : ''}
      {entry.so}
      {entry.ten ? ` · ${entry.ten}` : ''}
    </h3>
    <p>{text}</p>
    {entry.nen_lam ? (
      <p>
        <strong>Nên:</strong> {entry.nen_lam}
        <br />
        <strong>Nên tránh:</strong> {entry.nen_tranh}
      </p>
    ) : null}
  </>
);

export const KnowledgeMeaning: FC<{ metricKey: string; value: unknown }> = ({
  metricKey,
  value
}) => {
  const nums = parseValues(value);
  const indexEntry = (indicesData.indices as Entry[]).find(
    (i) => i.key === INDEX_KEY[metricKey]
  );

  let body: React.ReactNode = null;

  if (metricKey in FROM_NUMBERS) {
    const extra = FROM_NUMBERS[metricKey];
    const blocks = nums
      .map((n) => findBySo(numbersData.numbers as Entry[], n))
      .filter(Boolean) as Entry[];
    body = blocks.map((e) => <NumberBlock key={e.so} entry={e} extra={extra} />);
  } else if (metricKey === 'way') {
    body = nums.map((n, i) => {
      const e = findBySo(numbersData.numbers as Entry[], n);
      return e?.trong_chang ? (
        <Simple key={i} label={`Chặng ${i + 1}:`} entry={e} text={e.trong_chang} />
      ) : null;
    });
  } else if (metricKey === 'yearIndividual' || metricKey === 'monthIndividual') {
    body = nums.map((n) => {
      const e = findBySo(cyclesData.personal_year as Entry[], n);
      return e ? <Simple key={n} entry={e} text={e.mo_ta} /> : null;
    });
  } else if (metricKey === 'challenges') {
    body = nums.map((n, i) => {
      const e = findBySo(cyclesData.challenge as Entry[], n);
      return e ? (
        <Simple key={i} label={`Thách thức ${i + 1}:`} entry={e} text={e.mo_ta} />
      ) : null;
    });
  } else {
    const group = INDEX_KEY[metricKey] as keyof typeof supportingData;
    const list = supportingData[group] as Entry[] | undefined;
    body = nums.map((n, i) => {
      const e = findBySo(list, n);
      return e ? <Simple key={`${n}-${i}`} entry={e} text={e.mo_ta} /> : null;
    });
  }

  const hasBody = Array.isArray(body) ? body.some(Boolean) : !!body;
  if (!hasBody) return null;

  return (
    <div className="pyra-prose pyra-prose--glass pyra-knowledge">
      {indexEntry ? (
        <>
          <p>
            <strong>Chỉ số này cho biết:</strong> {indexEntry.y_nghia}
          </p>
          <p className="pyra-knowledge__read">
            <em>{indexEntry.cach_doc}</em>
          </p>
        </>
      ) : null}
      {body}
    </div>
  );
};
