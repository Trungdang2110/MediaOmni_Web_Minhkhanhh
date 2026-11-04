/**
 * Pyra — Thần số học Pythagoras
 * --------------------------------------------------------------
 * Module tính toán THUẦN: không phụ thuộc giao diện, không gọi mạng,
 * không gọi AI. Chạy được trên trình duyệt lẫn máy chủ.
 *
 * Đặc tả đầy đủ (công thức, quyết định, ví dụ tính tay):
 *   docs/numerology-spec.md
 *
 * Hai điểm khác nhau giữa các trường phái được để thành tùy chọn
 * (xem NumerologyOptions). Mặc định theo cách phổ biến ở Việt Nam.
 */

// ───────────────────────── Kiểu dữ liệu ─────────────────────────

export type MasterNumber = 11 | 22 | 33;

export interface BirthDate {
  day: number;   // 1–31
  month: number; // 1–12
  year: number;  // 1900 – năm hiện tại
}

export interface NumerologyOptions {
  /**
   * Cách tính Đường đời:
   * - "vn"    (mặc định): cộng TẤT CẢ chữ số của ngày sinh, rút gọn nhưng
   *                       giữ 10, 11, 22, 33. Kết quả thuộc {2..11, 22, 33}.
   *                       Theo trường phái Phillips – phổ biến tại Việt Nam.
   * - "decoz": rút gọn ngày, tháng, năm riêng (giữ số Master), cộng lại,
   *            rút gọn giữ 11/22/33. Kết quả thuộc {1..9, 11, 22, 33}.
   */
  lifePathMethod?: "vn" | "decoz";
  /**
   * Chữ Y:
   * - "vowel" (mặc định): luôn là nguyên âm — đúng với tiếng Việt
   *                       (Huy, Duy, Thúy, Yến, Mỹ…).
   * - "english": là phụ âm khi đứng cạnh một nguyên âm A/E/I/O/U,
   *              là nguyên âm khi không đứng cạnh nguyên âm nào.
   */
  yMode?: "vowel" | "english";
  /**
   * Năm cá nhân đổi vào:
   * - "calendar" (mặc định): ngày 1/1.
   * - "birthday": ngày sinh nhật trong năm.
   */
  personalYearStart?: "calendar" | "birthday";
  /** Ngày dùng để tính Năm/Tháng cá nhân và tuổi. Mặc định: hôm nay. */
  today?: Date;
}

export interface NameParts {
  /** Họ tên đã chuẩn hóa: không dấu, viết hoa, một khoảng trắng giữa các từ. */
  normalized: string;
  words: string[];
  /** Tên gọi = từ CUỐI (thứ tự tên tiếng Việt: Họ – Đệm – Tên). */
  givenName: string;
}

export interface Period {
  index: 1 | 2 | 3 | 4;
  value: number;
  fromAge: number;
  /** null = đến hết đời */
  toAge: number | null;
  fromYear: number;
  toYear: number | null;
}

export interface BirthChart {
  /** counts[n] = số lần chữ số n (1–9) xuất hiện trong ngày sinh. counts[0] bỏ qua. */
  counts: number[];
  /** Lưới hiển thị theo thứ tự hàng: [[3,6,9],[2,5,8],[1,4,7]] */
  grid: number[][];
  present: number[];
  missing: number[];
  isolated: number[];
  fullArrows: ArrowId[];
  emptyArrows: ArrowId[];
}

export type ArrowId =
  | "1-2-3" | "4-5-6" | "7-8-9"   // cột (Kế hoạch, Ý chí, Hành động)
  | "3-6-9" | "2-5-8" | "1-4-7"   // hàng (Trí tuệ, Cảm xúc, Thể chất)
  | "1-5-9" | "3-5-7";            // chéo (Quyết tâm, Tâm linh)

export interface NumerologyResult {
  input: { fullName: string; birth: BirthDate };
  name: NameParts;
  options: Required<Omit<NumerologyOptions, "today">> & { today: string };

  // Nhóm 1 — Chỉ số cá nhân
  lifePath: number;          // Đường đời
  expression: number;        // Sứ mệnh
  soulUrge: number;          // Linh hồn
  personality: number;       // Nhân cách

  // Nhóm 2 — Tiềm năng & xu hướng
  hiddenPassion: number[];   // Đam mê (có thể nhiều số bằng nhau)
  maturity: number;          // Trưởng thành
  rationalThought: number;   // Tư duy lý trí
  subconsciousSelf: number;  // Sức mạnh tiềm thức

  // Nhóm 3 — Bổ trợ
  bridges: { lifePathExpression: number; soulPersonality: number }; // Kết nối
  balance: number;           // Cân bằng
  karmicLessons: number[];   // Số thiếu

  // Nhóm 4 — Thời gian & chu kỳ
  birthday: { day: number; value: number }; // Ngày sinh
  personalYear: { year: number; value: number };
  personalMonth: { month: number; value: number };
  pinnacles: Period[];       // Chặng
  challenges: Period[];      // Thách thức

  birthChart: BirthChart;
}

// ───────────────────────── Hằng số ─────────────────────────

/** Bảng Pythagoras: A J S = 1, B K T = 2, … I R = 9 */
export const LETTER_VALUES: Readonly<Record<string, number>> = Object.freeze(
  Object.fromEntries(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((ch, i) => [ch, (i % 9) + 1]),
  ),
);

const BASIC_VOWELS = new Set(["A", "E", "I", "O", "U"]);
const MASTERS = new Set([11, 22, 33]);

export const ARROWS: Readonly<Record<ArrowId, readonly [number, number, number]>> = {
  "1-2-3": [1, 2, 3],
  "4-5-6": [4, 5, 6],
  "7-8-9": [7, 8, 9],
  "3-6-9": [3, 6, 9],
  "2-5-8": [2, 5, 8],
  "1-4-7": [1, 4, 7],
  "1-5-9": [1, 5, 9],
  "3-5-7": [3, 5, 7],
};

/** Vị trí trên lưới: hàng 0 = trên cùng (3-6-9), cột 0 = trái (1-2-3). */
export const CHART_LAYOUT: readonly (readonly number[])[] = [
  [3, 6, 9],
  [2, 5, 8],
  [1, 4, 7],
];

// ───────────────────────── Tiện ích số ─────────────────────────

export const digitSum = (n: number): number =>
  String(Math.abs(Math.trunc(n)))
    .split("")
    .reduce((s, d) => s + Number(d), 0);

/** Rút gọn về 1 chữ số, giữ nguyên 11/22/33 nếu keepMasters = true. */
export function reduce(n: number, keepMasters = true): number {
  let x = Math.abs(Math.trunc(n));
  while (x > 9 && !(keepMasters && MASTERS.has(x))) x = digitSum(x);
  return x;
}

/** Rút gọn về 1 chữ số tuyệt đối (11 → 2, 22 → 4, 33 → 6). */
export const toSingle = (n: number): number => reduce(n, false);

// ───────────────────────── Ngày sinh ─────────────────────────

export type BirthDateError =
  | "EMPTY"
  | "INVALID"
  | "FUTURE"
  | "YEAR_OUT_OF_RANGE";

/** Trả về null nếu hợp lệ, ngược lại trả mã lỗi (UC01). */
export function validateBirthDate(
  b: Partial<BirthDate> | null | undefined,
  today: Date = new Date(),
): BirthDateError | null {
  if (!b || b.day == null || b.month == null || b.year == null) return "EMPTY";
  const { day, month, year } = b;
  if (![day, month, year].every(Number.isInteger)) return "INVALID";
  if (year < 1900 || year > today.getFullYear()) return "YEAR_OUT_OF_RANGE";
  if (month < 1 || month > 12 || day < 1) return "INVALID";
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  if (day > daysInMonth) return "INVALID";
  const d = Date.UTC(year, month - 1, day);
  const t = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  if (d > t) return "FUTURE";
  return null;
}

// ───────────────────────── Họ tên ─────────────────────────

/**
 * Chuẩn hóa họ tên tiếng Việt: bỏ dấu, Đ → D, viết hoa,
 * bỏ ký tự không phải chữ cái, gộp khoảng trắng.
 */
export function normalizeName(raw: string): NameParts {
  const normalized = (raw ?? "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = normalized ? normalized.split(" ") : [];
  return { normalized, words, givenName: words[words.length - 1] ?? "" };
}

/** Chữ tại vị trí i của một từ có phải nguyên âm không. */
export function isVowel(word: string, i: number, yMode: "vowel" | "english"): boolean {
  const ch = word[i];
  if (BASIC_VOWELS.has(ch)) return true;
  if (ch !== "Y") return false;
  if (yMode === "vowel") return true;
  const prev = word[i - 1];
  const next = word[i + 1];
  return !(BASIC_VOWELS.has(prev ?? "") || BASIC_VOWELS.has(next ?? ""));
}

type LetterFilter = "all" | "vowels" | "consonants";

function wordValue(word: string, filter: LetterFilter, yMode: "vowel" | "english"): number {
  let sum = 0;
  for (let i = 0; i < word.length; i++) {
    const v = isVowel(word, i, yMode);
    if (filter === "vowels" && !v) continue;
    if (filter === "consonants" && v) continue;
    sum += LETTER_VALUES[word[i]] ?? 0;
  }
  return sum;
}

/**
 * Giá trị số của cả họ tên: rút gọn TỪNG TỪ (giữ Master),
 * cộng lại rồi rút gọn lần cuối (giữ Master).
 */
export function nameNumber(
  words: string[],
  filter: LetterFilter,
  yMode: "vowel" | "english",
): number {
  const total = words.reduce((s, w) => s + reduce(wordValue(w, filter, yMode)), 0);
  return reduce(total);
}

/** Số lần mỗi giá trị 1–9 xuất hiện trong toàn bộ chữ cái của họ tên. */
export function letterValueCounts(words: string[]): number[] {
  const counts = new Array(10).fill(0);
  for (const w of words) for (const ch of w) counts[LETTER_VALUES[ch]]++;
  return counts;
}

// ───────────────────────── Chỉ số ngày sinh ─────────────────────────

export function lifePathNumber(b: BirthDate, method: "vn" | "decoz" = "vn"): number {
  if (method === "decoz") {
    return reduce(reduce(b.day) + reduce(b.month) + reduce(b.year));
  }
  let x = digitSum(b.day) + digitSum(b.month) + digitSum(b.year);
  while (x > 11 && !MASTERS.has(x)) x = digitSum(x);
  return x; // 2..11, 22, 33
}

/** Năm cá nhân đang có hiệu lực vào ngày `today`. */
export function activePersonalYear(
  b: BirthDate,
  today: Date,
  start: "calendar" | "birthday",
): number {
  const y = today.getFullYear();
  if (start === "calendar") return y;
  const beforeBirthday =
    today.getMonth() + 1 < b.month ||
    (today.getMonth() + 1 === b.month && today.getDate() < b.day);
  return beforeBirthday ? y - 1 : y;
}

export const personalYearNumber = (b: BirthDate, year: number): number =>
  toSingle(digitSum(b.day) + digitSum(b.month) + digitSum(year));

export const personalMonthNumber = (personalYear: number, month: number): number =>
  toSingle(personalYear + month);

function buildPeriods(values: number[], lifePathSingle: number, birthYear: number): Period[] {
  const firstEnd = 36 - lifePathSingle;
  const bounds: [number, number | null][] = [
    [0, firstEnd],
    [firstEnd + 1, firstEnd + 9],
    [firstEnd + 10, firstEnd + 18],
    [firstEnd + 19, null],
  ];
  return values.map((value, i) => ({
    index: (i + 1) as 1 | 2 | 3 | 4,
    value,
    fromAge: bounds[i][0],
    toAge: bounds[i][1],
    fromYear: birthYear + bounds[i][0],
    toYear: bounds[i][1] == null ? null : birthYear + (bounds[i][1] as number),
  }));
}

export function pinnacles(b: BirthDate, lifePath: number): Period[] {
  const m = toSingle(b.month), d = toSingle(b.day), y = toSingle(b.year);
  const p1 = reduce(m + d);
  const p2 = reduce(d + y);
  const p3 = reduce(toSingle(p1) + toSingle(p2));
  const p4 = reduce(m + y);
  return buildPeriods([p1, p2, p3, p4], toSingle(lifePath), b.year);
}

export function challenges(b: BirthDate, lifePath: number): Period[] {
  const m = toSingle(b.month), d = toSingle(b.day), y = toSingle(b.year);
  const c1 = Math.abs(m - d);
  const c2 = Math.abs(d - y);
  const c3 = Math.abs(c1 - c2);
  const c4 = Math.abs(m - y);
  return buildPeriods([c1, c2, c3, c4], toSingle(lifePath), b.year);
}

// ───────────────────────── Biểu đồ ngày sinh ─────────────────────────

function positionOf(n: number): [row: number, col: number] {
  const col = Math.floor((n - 1) / 3);
  const row = 2 - ((n - 1) % 3);
  return [row, col];
}

export function birthChart(b: BirthDate): BirthChart {
  const counts = new Array(10).fill(0);
  const digits = `${b.day}${b.month}${b.year}`.split("").map(Number);
  for (const d of digits) if (d > 0) counts[d]++;

  const present = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => counts[n] > 0);
  const missing = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => counts[n] === 0);

  const isolated = present.filter((n) => {
    const [r, c] = positionOf(n);
    for (let dr = -1; dr <= 1; dr++)
      for (let dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue;
        const nb = CHART_LAYOUT[r + dr]?.[c + dc];
        if (nb && counts[nb] > 0) return false;
      }
    return true;
  });

  const ids = Object.keys(ARROWS) as ArrowId[];
  return {
    counts,
    grid: CHART_LAYOUT.map((row) => [...row]),
    present,
    missing,
    isolated,
    fullArrows: ids.filter((id) => ARROWS[id].every((n) => counts[n] > 0)),
    emptyArrows: ids.filter((id) => ARROWS[id].every((n) => counts[n] === 0)),
  };
}

// ───────────────────────── Hàm tổng ─────────────────────────

export class NumerologyInputError extends Error {
  readonly code: BirthDateError | "EMPTY_NAME";
  constructor(code: BirthDateError | "EMPTY_NAME") {
    super(code);
    this.code = code;
    this.name = "NumerologyInputError";
  }
}

export function calculate(
  fullName: string,
  birth: BirthDate,
  opts: NumerologyOptions = {},
): NumerologyResult {
  const today = opts.today ?? new Date();
  const lifePathMethod = opts.lifePathMethod ?? "vn";
  const yMode = opts.yMode ?? "vowel";
  const personalYearStart = opts.personalYearStart ?? "calendar";

  const err = validateBirthDate(birth, today);
  if (err) throw new NumerologyInputError(err);
  const name = normalizeName(fullName);
  if (!name.words.length) throw new NumerologyInputError("EMPTY_NAME");

  const { words } = name;

  // Nhóm 1
  const lifePath = lifePathNumber(birth, lifePathMethod);
  const expression = nameNumber(words, "all", yMode);
  const soulUrge = nameNumber(words, "vowels", yMode);
  const personality = nameNumber(words, "consonants", yMode);

  // Nhóm 2
  const counts = letterValueCounts(words);
  const max = Math.max(...counts.slice(1));
  const hiddenPassion = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => counts[n] === max);
  const maturity = reduce(toSingle(lifePath) + toSingle(expression));
  const givenNameNumber = nameNumber([name.givenName], "all", yMode);
  const rationalThought = reduce(toSingle(givenNameNumber) + toSingle(birth.day));
  const karmicLessons = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => counts[n] === 0);
  const subconsciousSelf = 9 - karmicLessons.length;

  // Nhóm 3
  const bridges = {
    lifePathExpression: Math.abs(toSingle(lifePath) - toSingle(expression)),
    soulPersonality: Math.abs(toSingle(soulUrge) - toSingle(personality)),
  };
  const balance = toSingle(words.reduce((s, w) => s + LETTER_VALUES[w[0]], 0));

  // Nhóm 4
  const pyYear = activePersonalYear(birth, today, personalYearStart);
  const personalYear = { year: pyYear, value: personalYearNumber(birth, pyYear) };
  const month = today.getMonth() + 1;
  const personalMonth = { month, value: personalMonthNumber(personalYear.value, month) };

  return {
    input: { fullName, birth },
    name,
    options: { lifePathMethod, yMode, personalYearStart, today: today.toISOString() },
    lifePath,
    expression,
    soulUrge,
    personality,
    hiddenPassion,
    maturity,
    rationalThought,
    subconsciousSelf,
    bridges,
    balance,
    karmicLessons,
    birthday: { day: birth.day, value: reduce(birth.day) },
    personalYear,
    personalMonth,
    pinnacles: pinnacles(birth, lifePath),
    challenges: challenges(birth, lifePath),
    birthChart: birthChart(birth),
  };
}

/** Khóa ổn định cho từng chỉ số — dùng chung với kho kiến thức (knowledge/*.json). */
export const INDEX_KEYS = [
  "life_path", "expression", "soul_urge", "personality",
  "hidden_passion", "maturity", "rational_thought", "subconscious_self",
  "bridge", "balance", "karmic_lessons",
  "birthday", "personal_year", "personal_month", "pinnacle", "challenge",
] as const;
export type IndexKey = (typeof INDEX_KEYS)[number];
