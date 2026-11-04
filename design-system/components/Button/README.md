# Button

Sáu loại nút theo mức độ quan trọng: Primary (đỏ rượu, tối đa 1 nút mỗi màn hình), Ticket (xanh phấn có hoa văn ‹ ›, cho hành động khám phá), Ghost (viền đỏ), Text link, Icon (44×44px) và Danger.

- Chữ trên nút bắt đầu bằng động từ: "Xem kết quả", "Giải mã biểu đồ", "Hỏi Pyra".
- Góc `radius-sm` (2px), cao tối thiểu 44px.
- Trạng thái: thường → di chuột (tối hơn 8%) → nhấn (lún 1px) → đang xử lý (vòng xoay + "Đang tính…") → vô hiệu (mờ 45%).
- Focus bàn phím: viền `gold` 2px, cách nút 2px.
- Nút Icon luôn có `aria-label` (nhãn ẩn đọc cho người khiếm thị).
- Nút Danger luôn mở hộp thoại xác nhận trước khi xóa.
- Nút nằm trên tranh, ảnh hoặc trong tấm kính → dùng phiên bản kính (xem GlassButton). Nút nằm trên nền giấy → dùng các loại ở đây.
