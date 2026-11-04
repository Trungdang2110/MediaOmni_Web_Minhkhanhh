# Pyra Rococo

**Thần số học trong một phòng tranh Rococo** — design system cho website Thần số học của bạn, lấy cảm hứng từ bộ giao diện triển lãm "The Rococo": giấy ngà cũ, đỏ rượu vang, xanh phấn, hồng đào, khung oval mạ vàng và chữ serif cao, thanh mảnh.

> **Design system là gì?** Là "bộ quy tắc thương hiệu" cho website: dùng màu nào, chữ nào, nút trông ra sao, thẻ được dựng thế nào. Có nó, designer và lập trình viên làm ra các trang khác nhau mà vẫn trông như cùng một nhà.
> **Token** là một "biến số đặt tên sẵn" — ví dụ `claret` = đỏ rượu vang `#7B2416`. Lập trình viên gọi tên token thay vì gõ mã màu, nên khi muốn đổi màu chỉ cần sửa một chỗ.

## 1. Concept

**"Salon của những con số."** Mỗi người dùng bước vào một salon nghệ thuật thế kỷ 18; mỗi chỉ số Thần số học được trưng bày như **một bức chân dung trong khung oval** — có tên, có con số, có câu chuyện riêng. Linh vật **Pyra** là "người hướng dẫn phòng tranh".

Ba tính từ dẫn đường:

- **Thanh lịch** — nhiều khoảng trắng nền giấy, chữ serif, đường kẻ mảnh, không màu neon.
- **Huyền bí ấm áp** — đỏ rượu và vàng đồng tạo cảm giác bí ẩn nhưng không u tối; nền giấy ngà giữ sự gần gũi.
- **Có câu chuyện** — kết quả không phải bảng số khô khan mà là "bộ sưu tập" để khám phá, phù hợp tinh thần tham khảo — giải trí.

Mapping từ ảnh tham khảo sang web của bạn:

| Trong ảnh "The Rococo" | Trên web Thần số học |
|---|---|
| Tiêu đề khổng lồ THE ROCOCO đè lên tranh | Hero "THẦN SỐ HỌC" chữ `hero` màu `claret` đè lên tranh minh họa / Pyra |
| 3 thẻ triển lãm đỏ – xanh – đào với ảnh oval | Thẻ chỉ số: con số nằm trong khung oval, màu thẻ theo nhóm chỉ số |
| Thẻ vòm nổi giữa tranh đen trắng (Fragonard) | Thẻ "Đường đời" nổi bật — chỉ số quan trọng nhất |
| Monogram "SD" trong khung oval | Logo / monogram "P" (Pyra) trong khung oval vàng |
| Nút "Book tickets ‹ ›" xanh phấn | Nút "Xem kết quả", "Giải mã biểu đồ" |
| Section "Our story" có chữ viết tay | Section giới thiệu Thần số học / video hướng dẫn |
| Khối liên hệ đỏ đậm + footer đỏ | Thanh công cụ cố định & footer `claret-deep` |

## 2. Color palette

Năm màu nhận diện + nền giấy. Tỷ lệ gợi ý **60 – 25 – 10 – 5**: 60% giấy (`paper`, `paper-deep`), 25% đỏ rượu (`claret`), 10% xanh phấn + hồng đào, 5% vàng đồng (`gold`) chỉ để trang trí.

| Token | Sáng | Vai trò |
|---|---|---|
| `paper` | #F3EADB | Nền trang |
| `paper-deep` | #E8DCC6 | Nền khối phụ, ô nhập |
| `ink` | #2E1A14 | Chữ chính (nâu mực, không dùng đen tuyền) |
| `claret` | #7B2416 | Màu thương hiệu: tiêu đề, nút chính, con số |
| `claret-deep` | #561710 | Footer, thanh công cụ |
| `powder` | #A9C4CD | Nút phụ, nhóm "Tiềm năng & xu hướng" |
| `peach` | #EBBBA2 | Nhóm "Thời gian & chu kỳ" |
| `gold` | #8C6A33 | Khung oval, hoa văn, viền focus — **không** dùng cho chữ thân bài |

**Màu theo nhóm chỉ số** (giúp khách nhận ra nhóm chỉ bằng mắt):

- Chỉ số cá nhân (Đường đời, Sứ mệnh, Linh hồn, Nhân cách) → thẻ `claret-fill`
- Tiềm năng & xu hướng → thẻ `powder`
- Bổ trợ (Kết nối, Cân bằng, Số thiếu) → thẻ `paper-deep` viền `gold`
- Thời gian & chu kỳ → thẻ `peach`

**Chế độ tối "Salon đêm"** (UC11): nền nâu đỏ rất đậm `#1E1210`, chữ ngà, đỏ sáng lên `#D8735F` để vẫn đọc rõ. Mọi cặp chữ/nền đã kiểm tra đạt độ tương phản ≥ 4.5:1 ở cả hai chế độ.

## 3. Typography

> **Serif** là kiểu chữ có "chân" nhỏ ở đầu nét (như Times New Roman) — trông cổ điển, sang. **Sans-serif** không có chân — gọn, dễ đọc trên màn hình nhỏ.

Bốn họ chữ, đều miễn phí trên Google Fonts và **hỗ trợ tiếng Việt có dấu**:

| Vai trò | Font | Dùng cho |
|---|---|---|
| `display` | **Playfair Display** 700/900 | Hero, tiêu đề section, **con số chỉ số** — tương phản nét dày/mảnh giống "THE ROCOCO" |
| `caps` | **Cormorant SC** 600/700 | Nhãn chữ hoa nhỏ trang trí: tên thẻ chỉ số, eyebrow trên tiêu đề |
| `text` | **EB Garamond** 400 | Đoạn văn giải thích, nội dung AI trả lời |
| `ui` | **Be Vietnam Pro** 500/600 | Nút, ô nhập, nhãn form — font của người Việt, rất rõ dấu |

Thang cỡ chữ: `hero` 72px → `h1` 44 → `h2` 30 → `lead` 20 → `body` 17 → `caption` 14. Trên điện thoại, `hero` giảm còn 44px, `h1` còn 32px.

Quy tắc: tiêu đề `hero`/`h1` VIẾT HOA; tên thẻ dùng `caps`; đoạn văn dài không quá ~65 ký tự mỗi dòng.

## 4. Cấu trúc button

Mọi nút gồm: **[biểu tượng tùy chọn] + Chữ (động từ đứng đầu) + [hoa văn ‹ › tùy chọn]**, góc `radius-sm` 2px (như vé in cổ), cao tối thiểu 44px để bấm bằng ngón tay dễ.

| Loại | Trông thế nào | Dùng cho | Quy tắc |
|---|---|---|---|
| **Primary** | Nền `claret-fill`, chữ `on-claret`, viền trong mảnh `gold` | "Xem kết quả", "Gửi" (chat) | **Tối đa 1 nút/màn hình** |
| **Ticket** | Nền `powder`, chữ `on-powder`, hai hoa văn ‹ › hai bên | "Giải mã biểu đồ", "Hỏi Pyra", "Trò chuyện với AI" | Hành động khám phá, mời gọi |
| **Ghost** | Trong suốt, viền `claret`, chữ `claret` | "Xem công thức", "Thử lại", "Tạo lại" | Hành động phụ |
| **Text link** | Chữ `claret` gạch chân mảnh | "Xem thêm", "Bỏ qua khảo sát" | Ít quan trọng nhất |
| **Icon** | Vuông 44px, icon nét mảnh | Lưu hồ sơ, sáng/tối, ngôn ngữ, đóng | Luôn có nhãn ẩn cho trình đọc màn hình |
| **Danger** | Viền + chữ `danger` | "Xóa toàn bộ lịch sử" | Luôn có hộp thoại xác nhận |

Trạng thái mỗi nút: **thường → di chuột** (đậm hơn ~8%) **→ nhấn** (lún 1px) **→ đang xử lý** (chữ đổi "Đang tính…" + vòng xoay nhỏ, không bấm được) **→ vô hiệu** (mờ 45%, ví dụ nút Lưu khi chưa nhập tên). Vòng focus khi dùng bàn phím: viền `gold` 2px, cách nút 2px.

## 4b. Lớp "Liquid glass" — kính lỏng

> **Liquid glass** là phong cách giao diện trông như các tấm kính mờ trong suốt nổi trên nội dung: nhìn xuyên qua thấy phía sau bị làm nhòe, cạnh kính bắt sáng, và khi bấm thì tấm kính "nảy" ra mềm mại như chất lỏng. Kỹ thuật chính là `backdrop-filter: blur()` — lệnh CSS làm mờ mọi thứ nằm *phía sau* một phần tử.

Trong Pyra Rococo, kính được pha **màu khói nâu ấm** (không phải kính trắng lạnh) để hợp tông đỏ rượu – giấy ngà, như tấm gương cổ trong cung điện Versailles.

**Dùng kính cho:** mọi thứ **bật ra khi bấm** và mọi thứ **nổi** trên trang.

| Bấm vào | Bật ra |
|---|---|
| Thẻ chỉ số | GlassDialog: công thức + nút "Nhờ Pyra giải thích" |
| "Giải mã biểu đồ" | GlassDialog lớn, nội dung AI cuộn bên trong |
| Icon hồ sơ trong ô họ tên | Menu kính danh sách hồ sơ (xem GlassButton) |
| Ngôn ngữ / sáng-tối / ủng hộ / góp ý | Thanh công cụ kính nổi ở đáy trang |
| Ủng hộ, khảo sát | GlassDialog |
| Lịch sử chat (trang Chat AI) | Ngăn kéo kính trượt ra từ cạnh trái |

**Giữ Rococo cho:** nền trang, thẻ chỉ số, biểu đồ, tiêu đề — những thứ nằm yên trên "giấy".

**Chuyển động bật ra:** phóng to từ 86% → 100% từ đúng điểm vừa bấm, kèm từ mờ sang rõ, ~420ms, đường cong lò xo hơi nảy; nội dung bên trong hiện lần lượt cách nhau 50ms; nền phía sau phủ `scrim` tối mờ. Đóng: ngược lại, nhanh hơn (~220ms).

**Token kính:** `glass-fill`, `glass-fill-strong`, `glass-chip`, `glass-stroke`, `glass-highlight`, `on-glass`, `on-glass-muted`, `scrim`, `radius-glass` 24px, `radius-glass-inner` 16px, `radius-pill`, `shadow-glass`.

**Lưu ý kỹ thuật & trải nghiệm:**

- Kính chỉ đẹp khi **phía sau có hình** (tranh, ảnh, màu loang). Vì vậy nền trang chủ nên có tranh Rococo hoặc mảng màu loang ở hero.
- Tấm kính có chữ nằm thẳng trên nền giấy sáng dùng `glass-fill-strong` để chữ đọc rõ (đã kiểm tra ≥ 4.5:1 cả khi nền phía sau trắng).
- Hiệu ứng làm mờ khá "nặng" với điện thoại đời cũ: không chồng quá 2 lớp kính, không đặt kính lên video đang chạy.
- Tôn trọng cài đặt máy của người dùng: bật "giảm trong suốt" → kính thành nền nâu đặc; bật "giảm chuyển động" → bỏ hiệu ứng nảy, chỉ mờ dần.

## 5. Thành phần chính (components)

Xem từng thẻ preview trong mục Components:

- **Button** — 6 loại ở trên.
- **Field** — ô nhập họ tên (icon hồ sơ bên trái) và bộ 3 ô ngày/tháng/năm, có trạng thái lỗi.
- **IndexCard** — thẻ chỉ số: tên `caps` + con số `numeral` trong khung oval vàng; màu theo nhóm.
- **BirthChart** — lưới 3×3 (3-6-9 / 2-5-8 / 1-4-7) như khung tranh: ô có số tô `claret`, ô trống nét đứt, mũi tên đủ số vẽ bằng đường `gold`.
- **ChatMessage** — tin nhắn người dùng (bong bóng `powder`) và Pyra (giấy `paper-deep` + chữ ký "Pyra" `caps`), có khối nguồn tham khảo.
- **Notice** — thông báo ngắn (toast) và nhãn "Đã lưu · 7 ngày".
- **GlassDialog** — hộp thoại kính bật ra khi bấm thẻ chỉ số (bấm thử trong preview) + thanh công cụ kính nổi.
- **GlassButton** — nút kính viên thuốc / tròn và menu kính "Hồ sơ đã lưu" bật ra khi bấm.

## 6. Tính năng → giao diện

| Use case | Thể hiện trong design system |
|---|---|
| UC01 Tính chỉ số | Field + nút Primary "Xem kết quả" + lưới IndexCard (2/3/4/5 cột theo màn hình) |
| UC02 Xem công thức | Hộp thoại nền `paper`, viền `gold`, các bước đánh số La Mã I, II, III |
| UC03 / UC05 AI giải thích | Nút Ticket; chữ AI hiện dần bằng font `text`; nhãn Notice "Đã lưu" khi lấy từ bộ nhớ |
| UC04 Biểu đồ ngày sinh | BirthChart, thu gọn/mở bằng nút Ghost |
| UC06 Hồ sơ | Bảng nổi danh sách hồ sơ, Notice "Đã lưu hồ sơ" màu `success`, giới hạn 10 |
| UC07–09 Chat AI | ChatMessage; ngăn kéo lịch sử nền `claret-deep` chữ `on-claret` |
| UC11 Ngôn ngữ, sáng/tối | Thanh công cụ cố định `claret-deep`, nút Icon |
| UC12 Khảo sát | Hộp thoại kiểu "thư mời" có monogram oval |
| UC13 Ủng hộ | Thẻ vòm (`radius-arch`) giống thẻ Fragonard |

## 7. Hình ảnh & hoa văn

- **Tranh minh họa**: dùng tranh Rococo **thuộc phạm vi công cộng** (public domain — tác giả mất trên 70 năm, ví dụ Boucher, Fragonard) hoặc tự vẽ minh họa Pyra theo phong cách đó. Kiểm tra giấy phép ảnh trước khi dùng.
- **Khung oval vàng**: viền `gold` 2px + một vòng mảnh thứ hai cách 4px.
- **Hoa văn ‹ ›**: ký tự trang trí hai bên nút Ticket và tiêu đề section.
- Không dùng: gradient tím-xanh, emoji, bóng đổ xám lạnh, icon nét dày kiểu hoạt hình.

## 8. Giọng văn

Lịch sự, gợi mở, như người hướng dẫn phòng tranh: "Mời bạn khám phá con số Đường đời của mình" thay vì "Click để xem". Luôn nhắc nhẹ: *Kết quả mang tính tham khảo và giải trí.*
