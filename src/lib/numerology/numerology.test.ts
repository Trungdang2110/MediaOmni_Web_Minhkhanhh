/**
 * Kiểm thử cho module Thần số học. Chạy: npx vitest run
 * Mọi con số ở đây đã được tính tay — xem docs/numerology-spec.md mục 6.
 */
import { describe, it, expect } from "vitest";
import {
  calculate,
  normalizeName,
  reduce,
  lifePathNumber,
  validateBirthDate,
  birthChart,
  personalYearNumber,
  NumerologyInputError,
} from "./index";

const TODAY = new Date(2026, 10, 4); // 04/11/2026

describe("reduce", () => {
  it("rút gọn và giữ số Master", () => {
    expect(reduce(38)).toBe(11);
    expect(reduce(29)).toBe(11);
    expect(reduce(22)).toBe(22);
    expect(reduce(33)).toBe(33);
    expect(reduce(44)).toBe(8);
    expect(reduce(1999)).toBe(1); // 28 → 10 → 1
    expect(reduce(22, false)).toBe(4);
  });
});

describe("normalizeName", () => {
  it("bỏ dấu tiếng Việt, Đ → D, gộp khoảng trắng", () => {
    const n = normalizeName("  đỗ   Thị  Ngọc   Ánh ");
    expect(n.normalized).toBe("DO THI NGOC ANH");
    expect(n.givenName).toBe("ANH");
  });
  it("xử lý ă â ê ô ơ ư", () => {
    expect(normalizeName("Ưng Hoàng Phúc Lương Ấn Ơn Êm").normalized).toBe(
      "UNG HOANG PHUC LUONG AN ON EM",
    );
  });
  it("bỏ số và ký tự đặc biệt", () => {
    expect(normalizeName("Lan-Anh 2 (Bé)").normalized).toBe("LAN ANH BE");
  });
});

describe("validateBirthDate", () => {
  it("bắt đủ 4 loại lỗi", () => {
    expect(validateBirthDate({ day: 1, month: 1 }, TODAY)).toBe("EMPTY");
    expect(validateBirthDate({ day: 31, month: 2, year: 2003 }, TODAY)).toBe("INVALID");
    expect(validateBirthDate({ day: 29, month: 2, year: 2023 }, TODAY)).toBe("INVALID");
    expect(validateBirthDate({ day: 29, month: 2, year: 2024 }, TODAY)).toBeNull();
    expect(validateBirthDate({ day: 5, month: 11, year: 2026 }, TODAY)).toBe("FUTURE");
    expect(validateBirthDate({ day: 1, month: 1, year: 1899 }, TODAY)).toBe("YEAR_OUT_OF_RANGE");
    expect(validateBirthDate({ day: 1, month: 1, year: 2027 }, TODAY)).toBe("YEAR_OUT_OF_RANGE");
  });
  it("calculate ném lỗi có mã", () => {
    expect(() => calculate("An", { day: 31, month: 4, year: 2000 }, { today: TODAY }))
      .toThrow(NumerologyInputError);
    expect(() => calculate("  ", { day: 1, month: 4, year: 2000 }, { today: TODAY }))
      .toThrow("EMPTY_NAME");
  });
});

describe("Đường đời", () => {
  it("cách VN cộng tất cả chữ số, giữ 10/11/22/33", () => {
    expect(lifePathNumber({ day: 21, month: 10, year: 2003 })).toBe(9);
    expect(lifePathNumber({ day: 29, month: 11, year: 1990 })).toBe(5);  // 32 → 5
    expect(lifePathNumber({ day: 1, month: 1, year: 1999 })).toBe(3);    // 30 → 3
    expect(lifePathNumber({ day: 9, month: 9, year: 1990 })).toBe(10);   // 37 → 10
    expect(lifePathNumber({ day: 28, month: 8, year: 1990 })).toBe(10);  // 37 → 10
    expect(lifePathNumber({ day: 1, month: 9, year: 1999 })).toBe(11);   // 38 → 11
    expect(lifePathNumber({ day: 9, month: 4, year: 2000 })).toBe(6);    // 15 → 6
    expect(lifePathNumber({ day: 19, month: 9, year: 1993 })).toBe(5);   // 41 → 5
    expect(lifePathNumber({ day: 1, month: 2, year: 1909 })).toBe(22);   // 1+2+1+9+0+9 = 22
    expect(lifePathNumber({ day: 6, month: 6, year: 1965 })).toBe(33);   // 6+6+1+9+6+5 = 33
  });
  it("cách Decoz rút gọn từng phần", () => {
    // 29 → 11, 11 → 11, 1990 → 19 → 10 → 1  ⇒ 11+11+1 = 23 → 5
    expect(lifePathNumber({ day: 29, month: 11, year: 1990 }, "decoz")).toBe(5);
    // 9, 9, 1990 → 1 ⇒ 19 → 10 → 1 (Decoz không giữ 10)
    expect(lifePathNumber({ day: 9, month: 9, year: 1990 }, "decoz")).toBe(1);
  });
});

describe("Năm cá nhân", () => {
  it("ngày + tháng + năm đang xét, rút về 1–9", () => {
    expect(personalYearNumber({ day: 21, month: 10, year: 2003 }, 2026)).toBe(5); // 14 → 5
    expect(personalYearNumber({ day: 29, month: 11, year: 1990 }, 2026)).toBe(5); // 2+9+1+1+10=23 → 5
  });
  it("tùy chọn đổi năm vào sinh nhật", () => {
    const r = calculate("Hoa", { day: 21, month: 12, year: 2003 }, {
      today: TODAY, personalYearStart: "birthday",
    });
    expect(r.personalYear.year).toBe(2025);
  });
});

describe("Biểu đồ ngày sinh", () => {
  it("đếm chữ số, bỏ số 0, tìm mũi tên và số cô lập", () => {
    const c = birthChart({ day: 29, month: 11, year: 1990 });
    expect(c.counts.slice(1)).toEqual([3, 1, 0, 0, 0, 0, 0, 0, 3]);
    expect(c.isolated).toEqual([9]);
    expect(c.fullArrows).toEqual([]);
    expect(c.emptyArrows).toEqual(["4-5-6", "3-5-7"]);
  });
  it("mũi tên đủ số", () => {
    const c = birthChart({ day: 15, month: 9, year: 1987 }); // 1,5,9,1,9,8,7
    expect(c.fullArrows).toEqual(expect.arrayContaining(["7-8-9", "1-5-9"]));
  });
});

describe("Ví dụ đầy đủ 1 — Nguyễn Thị Hoa, 21/10/2003", () => {
  const r = calculate("Nguyễn Thị Hoa", { day: 21, month: 10, year: 2003 }, { today: TODAY });
  it("nhóm cá nhân", () => {
    expect(r.lifePath).toBe(9);
    expect(r.expression).toBe(3);
    expect(r.soulUrge).toBe(22);
    expect(r.personality).toBe(8);
  });
  it("nhóm tiềm năng", () => {
    expect(r.hiddenPassion).toEqual([5]);
    expect(r.maturity).toBe(3);
    expect(r.rationalThought).toBe(9);
    expect(r.subconsciousSelf).toBe(8);
  });
  it("nhóm bổ trợ", () => {
    expect(r.bridges).toEqual({ lifePathExpression: 6, soulPersonality: 4 });
    expect(r.balance).toBe(6);
    expect(r.karmicLessons).toEqual([4]);
  });
  it("nhóm thời gian", () => {
    expect(r.birthday).toEqual({ day: 21, value: 3 });
    expect(r.personalYear).toEqual({ year: 2026, value: 5 });
    expect(r.personalMonth).toEqual({ month: 11, value: 7 });
    expect(r.pinnacles.map((p) => p.value)).toEqual([4, 8, 3, 6]);
    expect(r.pinnacles.map((p) => p.toAge)).toEqual([27, 36, 45, null]);
    expect(r.challenges.map((p) => p.value)).toEqual([2, 2, 0, 4]);
  });
  it("biểu đồ", () => {
    expect(r.birthChart.fullArrows).toEqual(["1-2-3"]);
    expect(r.birthChart.emptyArrows).toEqual(["4-5-6", "7-8-9"]);
  });
});

describe("Ví dụ đầy đủ 2 — Trần Minh Duy, 29/11/1990", () => {
  const r = calculate("Trần Minh Duy", { day: 29, month: 11, year: 1990 }, { today: TODAY });
  it("khớp tính tay", () => {
    expect([r.lifePath, r.expression, r.soulUrge, r.personality]).toEqual([5, 3, 11, 1]);
    expect(r.hiddenPassion).toEqual([4, 5, 9]);
    expect([r.maturity, r.rationalThought, r.subconsciousSelf]).toEqual([8, 7, 8]);
    expect(r.bridges).toEqual({ lifePathExpression: 2, soulPersonality: 1 });
    expect(r.balance).toBe(1);
    expect(r.karmicLessons).toEqual([6]);
    expect(r.birthday).toEqual({ day: 29, value: 11 });
    expect(r.pinnacles.map((p) => p.value)).toEqual([4, 3, 7, 3]);
    expect(r.pinnacles[0].toAge).toBe(31);
    expect(r.challenges.map((p) => p.value)).toEqual([0, 1, 1, 1]);
  });
  it("chữ Y theo luật tiếng Anh cho kết quả khác", () => {
    const e = calculate("Trần Minh Duy", { day: 29, month: 11, year: 1990 }, {
      today: TODAY, yMode: "english",
    });
    // DUY: Y đứng cạnh U → phụ âm. Linh hồn: A1 + I9 + U3 = 13 → 4
    expect(e.soulUrge).toBe(4);
  });
});
