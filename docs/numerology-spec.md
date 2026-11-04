# Đặc tả công thức Thần số học — Pyra

Phiên bản 1.0 · 04/11/2026
Code: `src/lib/numerology/index.ts` · Kiểm thử: `src/lib/numerology/numerology.test.ts` (19 bài, đều qua)

Tài liệu này là **nguồn sự thật duy nhất** cho cách tính 16 chỉ số. Code và kho kiến thức AI phải khớp với tài liệu này. Muốn đổi công thức thì sửa tài liệu trước, sửa code sau, rồi cập nhật kiểm thử.

---

## 1. Trường phái và nguồn tham khảo

Hệ **Pythagoras** (bảng chữ cái 1–9), kết hợp hai nhánh:

| Phần | Nhánh | Nguồn tham khảo |
|---|---|---|
| Đường đời (cách VN), biểu đồ ngày sinh, mũi tên, số cô lập | Phillips (phổ biến tại Việt Nam) | David A. Phillips, *The Complete Book of Numerology*; Lê Đỗ Quỳnh Hương, *Thay đổi cuộc sống với Nhân số học* |
| Chỉ số từ họ tên, Đam mê, Trưởng thành, Tư duy lý trí, Tiềm thức, Kết nối, Cân bằng, Số thiếu, Chặng, Thách thức | Mỹ hiện đại | Matthew Oliver Goodwin, *Numerology: The Complete Guide*; Hans Decoz (worldnumerology.com) |

**Không dùng** hệ Chaldean (Cheiro): bảng chữ cái khác, không tương thích.

Công thức và phương pháp không có bản quyền. **Câu chữ diễn giải trong các sách trên có bản quyền**, nên toàn bộ nội dung diễn giải trong `knowledge/` là nội dung viết mới của Pyra.

---

## 2. Các quyết định cần chủ dự án xác nhận

Đây là những điểm mà các sách làm khác nhau. Code để thành tùy chọn (`NumerologyOptions`); giá trị **in đậm** là mặc định.

| # | Điểm khác biệt | Lựa chọn | Lý do chọn mặc định |
|---|---|---|---|
| Q1 | Cách tính Đường đời | **`vn`**: cộng tất cả chữ số, giữ 10/11/22/33 · `decoz`: rút gọn từng phần | Khách Việt quen kết quả "số chủ đạo 2–11, 22, 33" (có số 10) từ sách của Lê Đỗ Quỳnh Hương |
| Q2 | Chữ Y | **`vowel`**: luôn là nguyên âm · `english`: phụ âm khi đứng cạnh A/E/I/O/U | Trong tiếng Việt, Y luôn đọc là nguyên âm (Huy, Duy, Thúy, Yến, Mỹ) |
| Q3 | Năm cá nhân đổi vào | **`calendar`**: 1/1 · `birthday`: ngày sinh nhật | Dễ hiểu, dễ truyền thông theo năm ("Năm 2027 của bạn là năm số…") |
| Q4 | Tên gọi (dùng cho Tư duy lý trí) | **Từ cuối cùng** của họ tên | Thứ tự tên tiếng Việt: Họ – Đệm – Tên |
| Q5 | Họ tên dùng để tính | **Họ tên khai sinh đầy đủ**, kể cả tên đệm | Chuẩn chung của mọi trường phái; nên ghi rõ dưới ô nhập |

Những điểm không có tùy chọn (cố định):

- Số Master được giữ: **11, 22, 33**.
- Năm cá nhân, Tháng cá nhân, Cân bằng, Kết nối, Thách thức luôn rút về **1 chữ số** (Kết nối và Thách thức có thể là 0).
- Chặng thứ nhất kết thúc ở tuổi **36 − Đường đời (rút về 1 chữ số)**.

---

## 3. Phép tính nền

### 3.1 Chuẩn hóa họ tên (`normalizeName`)

1. `đ` → `d`, `Đ` → `D`.
2. Bỏ mọi dấu tiếng Việt (NFD rồi xóa ký tự dấu): ă â → A, ê → E, ô ơ → O, ư → U.
3. Viết hoa; ký tự không phải A–Z (số, gạch nối, ngoặc…) thành khoảng trắng.
4. Gộp nhiều khoảng trắng thành một, cắt hai đầu.

Ví dụ: `"  đỗ   Thị  Ngọc   Ánh "` → `DO THI NGOC ANH`, tên gọi `ANH`.

### 3.2 Bảng chữ cái Pythagoras

| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|
| A | B | C | D | E | F | G | H | I |
| J | K | L | M | N | O | P | Q | R |
| S | T | U | V | W | X | Y | Z | |

Nguyên âm: **A E I O U** (+ **Y** theo Q2). Còn lại là phụ âm.

### 3.3 Rút gọn (`reduce`)

Cộng các chữ số cho đến khi còn 1 chữ số, **trừ khi** gặp 11, 22, 33 (dừng lại, giữ nguyên).
`toSingle(n)` = rút gọn tuyệt đối, không giữ Master: 11 → 2, 22 → 4, 33 → 6.

Ví dụ: 38 → 11 (dừng) · 44 → 8 · 1999 → 28 → 10 → 1.

### 3.4 Giá trị số của họ tên (`nameNumber`)

Với mỗi **từ** trong họ tên: cộng giá trị các chữ (theo bộ lọc: tất cả / nguyên âm / phụ âm) → `reduce` (giữ Master).
Cộng kết quả các từ → `reduce` lần cuối (giữ Master).

---

## 4. Công thức 16 chỉ số

Ký hiệu: `D`, `M`, `Y` = ngày, tháng, năm sinh. `LP` = Đường đời, `EX` = Sứ mệnh, `SU` = Linh hồn, `PE` = Nhân cách.

### Nhóm 1 — Chỉ số cá nhân

| # | Chỉ số | Khóa | Công thức | Miền giá trị |
|---|---|---|---|---|
| 1 | **Đường đời** | `life_path` | *vn*: tổng mọi chữ số của D, M, Y; rút gọn cho đến khi ≤ 11 hoặc = 22/33. *decoz*: `reduce(reduce(D)+reduce(M)+reduce(Y))` | vn: 2–11, 22, 33 · decoz: 1–9, 11, 22, 33 |
| 2 | **Sứ mệnh** | `expression` | `nameNumber(tất cả chữ)` | 1–9, 11, 22, 33 |
| 3 | **Linh hồn** | `soul_urge` | `nameNumber(nguyên âm)` | 1–9, 11, 22, 33 |
| 4 | **Nhân cách** | `personality` | `nameNumber(phụ âm)` | 1–9, 11, 22, 33 |

### Nhóm 2 — Tiềm năng & xu hướng

| # | Chỉ số | Khóa | Công thức | Miền |
|---|---|---|---|---|
| 5 | **Đam mê** | `hidden_passion` | Giá trị (1–9) xuất hiện **nhiều lần nhất** trong các chữ của họ tên. Nếu hòa, trả về tất cả | danh sách 1–9 |
| 6 | **Trưởng thành** | `maturity` | `reduce(toSingle(LP) + toSingle(EX))` | 1–9, 11 |
| 7 | **Tư duy lý trí** | `rational_thought` | `reduce(toSingle(số của tên gọi) + toSingle(D))` | 1–9, 11 |
| 8 | **Sức mạnh tiềm thức** | `subconscious_self` | `9 − (số lượng Số thiếu)` | thường 3–9 |

### Nhóm 3 — Bổ trợ

| # | Chỉ số | Khóa | Công thức | Miền |
|---|---|---|---|---|
| 9 | **Kết nối** (2 số) | `bridge` | `|toSingle(LP) − toSingle(EX)|` và `|toSingle(SU) − toSingle(PE)|` | 0–8 |
| 10 | **Cân bằng** | `balance` | `toSingle(tổng giá trị chữ cái đầu của mỗi từ)` | 1–9 |
| 11 | **Số thiếu** | `karmic_lessons` | Các giá trị 1–9 **không xuất hiện** trong họ tên | danh sách 1–9, có thể rỗng |

### Nhóm 4 — Thời gian & chu kỳ

| # | Chỉ số | Khóa | Công thức | Miền |
|---|---|---|---|---|
| 12 | **Ngày sinh** | `birthday` | `reduce(D)` (hiển thị kèm ngày gốc 1–31) | 1–9, 11, 22 |
| 13 | **Năm cá nhân** | `personal_year` | `toSingle(tổng chữ số D + tổng chữ số M + tổng chữ số năm đang xét)` | 1–9 |
| 14 | **Tháng cá nhân** | `personal_month` | `toSingle(Năm cá nhân + tháng dương lịch hiện tại)` | 1–9 |
| 15 | **Chặng** (4 chặng) | `pinnacle` | với `m=toSingle(M)`, `d=toSingle(D)`, `y=toSingle(Y)`: C1 = `reduce(m+d)`, C2 = `reduce(d+y)`, C3 = `reduce(toSingle(C1)+toSingle(C2))`, C4 = `reduce(m+y)` | 1–9, 11 (tổng tối đa 18 nên không thể ra 22) |
| 16 | **Thách thức** (4 thử thách) | `challenge` | T1 = `|m−d|`, T2 = `|d−y|`, T3 = `|T1−T2|`, T4 = `|m−y|` | 0–8 |

**Mốc tuổi của Chặng và Thách thức** (dùng chung):

| Giai đoạn | Từ tuổi | Đến tuổi |
|---|---|---|
| 1 | 0 | `36 − toSingle(LP)` = E |
| 2 | E + 1 | E + 9 |
| 3 | E + 10 | E + 18 |
| 4 | E + 19 | hết đời |

### Biểu đồ ngày sinh (UC04)

- Lấy các chữ số của `D`, `M`, `Y` viết liền (ví dụ 21/10/2003 → 2 1 1 0 2 0 0 3), **bỏ số 0**, đếm số lần mỗi số 1–9.
- Lưới hiển thị:

```
3 6 9   ← hàng Trí tuệ
2 5 8   ← hàng Cảm xúc
1 4 7   ← hàng Thể chất
↑ ↑ ↑
Kế hoạch · Ý chí · Hành động  (cột)
```

- 8 mũi tên: 3 hàng, 3 cột, 2 đường chéo (1-5-9 Quyết tâm, 3-5-7 Tâm linh).
  - **Mũi tên đủ số**: cả 3 ô đều có số.
  - **Mũi tên trống**: cả 3 ô đều không có số. (Mũi tên 1-2-3 không thể trống với người sinh 1900–2099, vì năm sinh luôn chứa 1 hoặc 2.)
- **Số cô lập**: số có mặt nhưng **tất cả** các ô kề bên (kể cả kề chéo) đều trống.
- Hiển thị số lặp bằng cách viết liền: hai số 1 → `11`, ba số 2 → `222`. (Đây là cách hiển thị, **không** phải số Master.)

---

## 5. Kiểm tra đầu vào (UC01)

| Mã lỗi | Khi nào | Câu thông báo gợi ý |
|---|---|---|
| `EMPTY` | Thiếu ngày, tháng hoặc năm | "Mời bạn nhập đủ ngày, tháng, năm sinh." |
| `INVALID` | Không phải số nguyên, tháng ngoài 1–12, ngày không tồn tại (31/4, 29/2 năm không nhuận) | "Ngày này không có trên lịch. Mời bạn kiểm tra lại." |
| `FUTURE` | Ngày sinh sau hôm nay | "Ngày sinh không thể ở tương lai." |
| `YEAR_OUT_OF_RANGE` | Năm < 1900 hoặc > năm hiện tại | "Mời bạn nhập năm sinh từ 1900 đến nay." |
| `EMPTY_NAME` | Họ tên rỗng sau khi chuẩn hóa | "Mời bạn nhập họ và tên." |

---

## 6. Ví dụ tính tay

### Ví dụ 1 — Nguyễn Thị Hoa, sinh 21/10/2003 (tính ngày 04/11/2026)

**Họ tên** → `NGUYEN THI HOA`, tên gọi `HOA`

| Từ | Chữ → số | Tổng | Rút gọn | Nguyên âm (U Y E / I / O A) | Phụ âm |
|---|---|---|---|---|---|
| NGUYEN | 5 7 3 7 5 5 | 32 | 5 | 3+7+5 = 15 → 6 | 5+7+5 = 17 → 8 |
| THI | 2 8 9 | 19 | 1 | 9 | 2+8 = 10 → 1 |
| HOA | 8 6 1 | 15 | 6 | 6+1 = 7 | 8 |

| Chỉ số | Phép tính | Kết quả |
|---|---|---|
| Đường đời | 2+1+1+0+2+0+0+3 = 9 | **9** |
| Sứ mệnh | 5 + 1 + 6 = 12 → 3 | **3** |
| Linh hồn | 6 + 9 + 7 = 22 (Master, giữ) | **22** |
| Nhân cách | 8 + 1 + 8 = 17 → 8 | **8** |
| Đam mê | Đếm: 5 ×3 lần, 7 ×2, 8 ×2, các số khác ×1 | **5** |
| Trưởng thành | 9 + 3 = 12 → 3 | **3** |
| Tư duy lý trí | HOA = 6; ngày 21 → 3; 6 + 3 | **9** |
| Số thiếu | Có 1 2 3 5 6 7 8 9, thiếu 4 | **4** |
| Sức mạnh tiềm thức | 9 − 1 | **8** |
| Kết nối | \|9 − 3\| = 6; \|22→4 − 8\| = 4 | **6 và 4** |
| Cân bằng | N5 + T2 + H8 = 15 → 6 | **6** |
| Ngày sinh | 21 → 3 | **3** |
| Năm cá nhân 2026 | (2+1) + (1+0) + (2+0+2+6) = 14 → 5 | **5** |
| Tháng cá nhân (tháng 11) | 5 + 11 = 16 → 7 | **7** |
| Chặng | m = 1, d = 3, y = 2003 → 5. C1 = 4, C2 = 8, C3 = 4+8 = 12 → 3, C4 = 6 | **4 · 8 · 3 · 6** |
| Mốc tuổi | E = 36 − 9 = 27 | 0–27 · 28–36 · 37–45 · 46+ |
| Thách thức | \|1−3\| = 2, \|3−5\| = 2, \|2−2\| = 0, \|1−5\| = 4 | **2 · 2 · 0 · 4** |
| Biểu đồ | Số 1 ×2, 2 ×2, 3 ×1 | Mũi tên đủ: 1-2-3 · Mũi tên trống: 4-5-6, 7-8-9 |

### Ví dụ 2 — Trần Minh Duy, sinh 29/11/1990

| Chỉ số | Kết quả | Ghi chú |
|---|---|---|
| Đường đời | **5** | 2+9+1+1+1+9+9+0 = 32 → 5 |
| Sứ mệnh / Linh hồn / Nhân cách | **3 / 11 / 1** | Y là nguyên âm. Nếu chọn Y theo luật tiếng Anh: Linh hồn = 4 |
| Đam mê | **4, 5, 9** | Hòa nhau → hiển thị cả ba |
| Trưởng thành / Tư duy lý trí / Tiềm thức | **8 / 7 / 8** | |
| Kết nối / Cân bằng / Số thiếu | **2 và 1 / 1 / 6** | |
| Ngày sinh | **11** | 29 → 11 (Master) |
| Chặng | **4 · 3 · 7 · 3** | Chặng 1 đến 31 tuổi (36 − 5) |
| Thách thức | **0 · 1 · 1 · 1** | |
| Biểu đồ | 1 ×3, 2 ×1, 9 ×3 | **Số 9 cô lập**; mũi tên trống 4-5-6 và 3-5-7 |

---

## 7. Cấu trúc dữ liệu trả về

Hàm `calculate(fullName, birth, options)` trả về `NumerologyResult` (xem `index.ts`). Các khóa chỉ số (`INDEX_KEYS`) dùng chung với kho kiến thức:

```
life_path, expression, soul_urge, personality,
hidden_passion, maturity, rational_thought, subconscious_self,
bridge, balance, karmic_lessons,
birthday, personal_year, personal_month, pinnacle, challenge
```

Ghép với kho kiến thức: thẻ chỉ số `life_path = 9` → tra `knowledge/numbers.json` mục số 9 + `knowledge/indices.json` mục `life_path`, rồi đưa cả hai cho AI diễn giải (UC03).

---

## 8. Cách thêm/sửa công thức

1. Sửa mục 4 của tài liệu này, ghi rõ lý do và nguồn.
2. Sửa `index.ts`.
3. Thêm ví dụ vào mục 6 và bài kiểm thử tương ứng; chạy `npx vitest run`.
4. Nếu đổi công thức, **xóa bộ nhớ đệm giải thích AI** (cache 7 ngày) bằng cách tăng số phiên bản khóa cache, để khách không thấy giải thích cũ.
