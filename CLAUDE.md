# Dự án: Website Thần số học "Pyra"

Website giúp người dùng nhập họ tên + ngày sinh để tính 16 chỉ số Thần số học, xem biểu đồ ngày sinh và hỏi trợ lý AI tên Pyra.

## Đọc trước khi code

1. `docs/plan.md`: lộ trình theo giai đoạn, công nghệ, yêu cầu an toàn.
2. `docs/use-cases.md`: đặc tả chi tiết UC01–UC16, luồng chính, lỗi, trạng thái giao diện.
3. `design-system/README.md`: concept, màu, chữ, nút, lớp liquid glass.
4. `design-system/tokens.json` + `tokens.css`: giá trị chuẩn của màu, chữ, khoảng cách, góc bo, bóng.
5. `design-system/components/*/`: README (quy tắc) + `preview.html` (mẫu HTML/CSS tham khảo, mở trực tiếp trên trình duyệt được).
6. `docs/references/`: hai ảnh phong cách gốc (Rococo và liquid glass).

## Về người làm việc cùng bạn

Chủ dự án là người làm Marketing, mới học về website. Khi giải thích, trao đổi hay hỏi lại:
- Viết tiếng Việt, câu ngắn, giải thích mọi thuật ngữ kỹ thuật bằng ví dụ đời thường.
- Trước mỗi bước lớn, nói ngắn gọn sẽ làm gì; sau khi xong, nói cách xem kết quả (ví dụ lệnh chạy, đường dẫn localhost).
- Hỏi trước khi cài thêm dịch vụ trả phí hoặc làm việc khó hoàn tác.

## Cách làm

- Nếu thư mục đã có mã nguồn sẵn (bản NumerologyWebApp mà `docs/use-cases.md` mô tả), **đọc và giữ cấu trúc hiện có**, áp design system lên đó, thay vì viết lại từ đầu. Nếu chưa có, khởi tạo theo `docs/plan.md` mục 4 (Next.js + TypeScript + Tailwind).
- Làm theo đúng thứ tự giai đoạn trong `docs/plan.md`. **Bắt đầu từ Giai đoạn 1** (chưa có AI) trừ khi được yêu cầu khác.
- Logic tính 16 chỉ số đặt trong một module riêng, thuần (không phụ thuộc giao diện), có unit test cho từng chỉ số, có các ca số Master 11/22/33 và tên tiếng Việt có dấu.
- Công thức cụ thể nếu chưa được chốt trong tài liệu: dùng cách phổ biến (Pythagorean), ghi rõ giả định trong code và báo lại cho chủ dự án kiểm tra.

## Quy tắc giao diện (tóm tắt, chi tiết ở design-system)

- Chỉ dùng màu, cỡ chữ, khoảng cách qua token (biến CSS trong `tokens.css` hoặc map vào `tailwind.config`). Không gõ mã màu rời.
- Font Google: Playfair Display (tiêu đề, con số), Cormorant SC (nhãn trang trí), EB Garamond (đoạn văn), Be Vietnam Pro (nút, form).
- Nền giấy + thẻ chỉ số + biểu đồ = phong cách Rococo. Mọi thứ **bật ra khi bấm hoặc nổi** (hộp thoại, menu, thanh công cụ, ngăn lịch sử chat) = **liquid glass** (`.pr-glass`, `.pr-pop`), phóng ra từ điểm vừa bấm.
- Màu thẻ theo nhóm chỉ số: Cá nhân `claret-fill`, Tiềm năng `powder`, Bổ trợ `paper-deep` + viền `gold`, Thời gian & chu kỳ `peach`.
- Hỗ trợ sáng/tối (`data-theme`), `prefers-reduced-motion`, `prefers-reduced-transparency`; độ tương phản chữ ≥ 4.5:1; vùng bấm ≥ 44px; mobile trước.

## Bắt buộc về an toàn

- API key AI chỉ ở backend (`.env`, không commit). Không bao giờ đưa key xuống trình duyệt.
- `/admin` phải có đăng nhập.
- Giới hạn lượt gọi AI / người / ngày.
- UC09 nhập lịch sử chat: không ghi đè im lặng, phải gộp hoặc hỏi xác nhận.
