# GlassDialog

Hộp thoại kính bật ra khi bấm vào thẻ chỉ số, nút "Giải mã biểu đồ", khảo sát hay ủng hộ: một tấm kính khói ấm làm mờ trang phía sau, "nảy" ra từ đúng chỗ người dùng vừa bấm.

**Cấu tạo một tấm kính** (`.pr-glass`):

1. Nền `glass-fill` (nâu khói trong suốt ~42%).
2. Làm mờ phía sau: `backdrop-filter: blur(24px) saturate(160%)` — giống nhìn qua kính mờ.
3. Viền 1px `glass-stroke` + vệt sáng mép trên `glass-highlight` — cạnh kính "bắt sáng".
4. Một vầng sáng nhẹ góc trên trái (ánh đèn chùm phản chiếu).
5. Bóng đổ sâu `shadow-glass`, góc `radius-glass` 24px.

Bên trong, các thẻ con dùng `glass-chip` + `radius-glass-inner` (lớp kính thứ hai).

**Chuyển động "bật ra"** (`.pr-pop` + `.is-open`):

- Mở: từ to 86%, mờ 6px, trong suốt → to 100%, rõ nét trong ~420ms, đường cong lò xo `cubic-bezier(.2,.9,.25,1.15)` nên hơi "nảy" quá rồi về.
- Điểm bắt đầu phóng to = đúng vị trí ngón tay / chuột vừa bấm.
- Nội dung bên trong hiện lần lượt, mỗi dòng chậm hơn 50ms.
- Nền phía sau phủ `scrim` tối mờ; bấm ra ngoài, nút ✕ hoặc phím Esc để đóng.

**Quy tắc:**

- Tấm kính có nhiều chữ đặt thẳng trên nền giấy sáng → dùng `.pr-glass--strong` để chữ đủ rõ.
- Không chồng quá 2 lớp kính lên nhau (nặng máy, rối mắt).
- Máy cũ không hỗ trợ làm mờ → tự đổi sang kính đậm đặc; người bật "giảm trong suốt" / "giảm chuyển động" trong cài đặt máy → bỏ hiệu ứng kính / nảy.
