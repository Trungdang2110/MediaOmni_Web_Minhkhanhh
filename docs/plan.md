# Plan website Thần số học (Pyra)

Tài liệu đi kèm: `docs/use-cases.md` (đặc tả 16 use case UC01–UC16), `design-system/README.md` (giao diện Pyra Rococo + liquid glass).

## 1. Kiến trúc tổng quan

| Thành phần | Vai trò trong dự án |
|---|---|
| Frontend | Ô nhập tên + ngày sinh, 16 thẻ chỉ số, biểu đồ ngày sinh, trang Chat AI |
| Backend (API route) | Nhận câu hỏi, tìm kiến thức, gọi nhà cung cấp AI, trả lời dạng stream |
| Kho kiến thức | Milvus / Zilliz Cloud (vector database) cho RAG |
| Lưu trên máy khách | localStorage (hồ sơ, cache giải thích 7 ngày, cài đặt), IndexedDB (lịch sử chat) |
| AI | OpenAI / Anthropic / Google… gọi qua backend |

Nguyên tắc: **16 chỉ số được tính hoàn toàn trên trình duyệt** (không cần AI, không tốn chi phí). Chỉ phần giải thích / chat mới gọi AI.

## 2. Sitemap

| Trang | Use case | Ghi chú |
|---|---|---|
| `/` Trang chủ | UC01–06, UC11, UC13 | Hero, nhập thông tin, biểu đồ, 16 thẻ kết quả, thanh công cụ kính nổi |
| `/chat` Chat AI | UC07–10 | Trợ lý Pyra, ngăn kéo lịch sử kính bên trái |
| `/admin` Quản trị kho kiến thức | UC14–16 | **Bắt buộc có đăng nhập** |
| `/blog` (đề xuất) | — | Bài SEO "Số chủ đạo X là gì" |
| `/chinh-sach-bao-mat` (đề xuất) | — | Vì thu thập họ tên + ngày sinh |
| `/gioi-thieu` (đề xuất) | — | Tạo độ tin cậy |

Hành trình chính: Trang chủ → nhập tên + ngày sinh → xem 16 chỉ số → bấm thẻ → hộp thoại kính (công thức) → "Nhờ Pyra giải thích" → sang Chat AI để hỏi sâu.

## 3. Lộ trình

### Giai đoạn 0 — Chuẩn bị (không code)
- Chốt công thức + ví dụ cho 16 chỉ số (lõi sản phẩm).
- Viết nội dung giải thích cơ bản cho từng con số.
- Brand: linh vật Pyra, logo/monogram "P" trong khung oval.
- Đăng ký tên miền; phác wireframe.

### Giai đoạn 1 — MVP, chưa có AI
| Việc | UC |
|---|---|
| Nhập họ tên, ngày/tháng/năm sinh; kiểm tra lỗi (trống, ngày không tồn tại, tương lai, trước 1900) | UC01 |
| Chuẩn hóa tên (bỏ dấu, viết hoa, xử lý khoảng trắng) và tính 16 chỉ số | UC01 |
| Lưới thẻ chỉ số 2/3/4/5 cột; bấm thẻ → hộp thoại công thức + ví dụ | UC01, UC02 |
| Biểu đồ ngày sinh 3×3 (3-6-9 / 2-5-8 / 1-4-7), mũi tên đủ số / trống, thu gọn được | UC04 |
| Lưu tối đa 10 hồ sơ, tìm kiếm, xóa, chống trùng | UC06 |
| Tiếng Việt / Anh, sáng / tối | UC11 |
| Dòng "Kết quả mang tính tham khảo và giải trí" | — |

Tiêu chí xong: chạy tốt trên điện thoại, dùng đúng design system, công thức có test tự động.

### Giai đoạn 2 — Thêm AI
| Việc | UC |
|---|---|
| AI giải thích từng chỉ số, hiện dần (stream), cache 7 ngày, nhãn "Đã lưu", nút thử lại | UC03 |
| AI phân tích biểu đồ, lưu bản phân tích kèm thời điểm, nút tạo lại | UC05 |
| Trang Chat AI + RAG (tìm kiến thức trong Milvus trước khi trả lời), hiển thị nguồn | UC07 |
| Quản lý cuộc trò chuyện (tạo, đổi tên, xóa có xác nhận) trên IndexedDB | UC08 |
| Trang quản trị kho kiến thức **có đăng nhập**: kiểm tra kết nối, nhập Chunk/Summary/QA, nhập hàng loạt JSON | UC14–16 |

### Giai đoạn 3 — Tiện ích & phản hồi
| Việc | UC | Ghi chú |
|---|---|---|
| Khảo sát & góp ý gửi tới webhook | UC12 | Dùng kết quả để quyết định Giai đoạn 4 |
| Thông tin ủng hộ tác giả, nút sao chép | UC13 | |
| Xuất / nhập lịch sử chat JSON | UC09 | **Đổi hành vi**: khi nhập thì gộp hoặc cảnh báo trước khi ghi đè |
| Cấu hình nhà cung cấp AI riêng | UC10 | Ưu tiên thấp nhất, có thể bỏ |

### Giai đoạn 4 — Kiếm tiền (sau khi có người dùng thật)
Tài khoản + đồng bộ thiết bị, báo cáo PDF trả phí, tương hợp cặp đôi, thanh toán (gói thành viên / mua lẻ).

## 4. Công nghệ đề xuất

| Hạng mục | Lựa chọn |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Giao diện | Tailwind CSS, cấu hình màu/cỡ chữ lấy từ `design-system/tokens.json` |
| Hosting | Vercel |
| Kho kiến thức | Milvus / Zilliz Cloud |
| Lưu trên máy khách | localStorage + IndexedDB |
| Đo lường | Google Analytics 4, Facebook / TikTok Pixel |

## 5. Yêu cầu bắt buộc về an toàn

1. Trang `/admin` phải có đăng nhập trước khi ra mắt.
2. Giới hạn số lượt gọi AI mỗi người / ngày; giữ cache 7 ngày.
3. API key của AI chỉ nằm ở backend (biến môi trường), không bao giờ gửi xuống trình duyệt.
4. Có trang Chính sách bảo mật: dữ liệu lưu ở đâu, có gửi cho AI không.
5. Báo cho khách biết hồ sơ lưu trên trình duyệt, đổi máy là mất.
6. Dặn AI (system prompt) không đưa lời khuyên y tế, tài chính, "định mệnh tuyệt đối".

## 6. Đo lường (KPI)

| Sự kiện cần gắn tracking | Ý nghĩa |
|---|---|
| `view_result` (bấm Xem kết quả) | Tỷ lệ dùng thử |
| `open_index` / `ask_ai_explain` | Mức quan tâm sâu |
| `open_chat` | Chuyển sang Chat AI |
| `save_profile` | Ý định quay lại |
| Quay lại sau 7 ngày | Giữ chân |
| Khảo sát mức sẵn sàng chi trả | Cơ sở cho Giai đoạn 4 |

Gợi ý tăng trưởng: nút chia sẻ kết quả thành ảnh khổ story (9:16), blog SEO theo từng con số, tái dùng video hướng dẫn cho TikTok / Reels.
