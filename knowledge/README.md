# Kho kiến thức Pyra

Phiên bản 1.0.0 · Tiếng Việt · Hệ Pythagoras · **Nội dung viết mới hoàn toàn**, không trích sách có bản quyền.

Có hai dạng, dùng cho hai việc khác nhau:

| Thư mục | Dùng để | Ai đọc |
|---|---|---|
| `structured/` | Code tra cứu trực tiếp và hiển thị ngay, **không cần AI**: tên, từ khóa và mô tả ngắn trên thẻ chỉ số, nhãn mũi tên trên biểu đồ | Frontend |
| `import/` | Nạp vào kho Milvus qua trang quản trị (UC15–16) để AI tìm và trích khi trả lời (RAG) | AI / backend |

## 1. `structured/`

| File | Nội dung | Khóa tra cứu |
|---|---|---|
| `numbers.json` | Ý nghĩa cốt lõi các số 1–9, 10, 11, 22, 33 (+ số 0): tên, từ khóa, bản chất, điểm mạnh, thử thách, gợi ý, công việc, quan hệ, ý nghĩa khi là Chặng | `numbers[].so` |
| `indices.json` | 16 chỉ số: tên, tên khác, nhóm, ý nghĩa, cách tính, cách đọc, miền giá trị | `indices[].key` = `INDEX_KEYS` trong code |
| `cycles.json` | Năm cá nhân 1–9 (dùng cho cả Tháng cá nhân), Thách thức 0–8 | `so` |
| `supporting.json` | Số thiếu 1–9, Sức mạnh tiềm thức 1–9, Cân bằng 1–9, Kết nối 0–8 | `so` |
| `birth-chart.json` | 8 mũi tên (đủ số / trống), ý nghĩa từng số trên biểu đồ theo số lần xuất hiện, số cô lập | `arrows[].id` = `ArrowId` trong code |

Ví dụ ghép trên thẻ chỉ số (không gọi AI):

```ts
import numbers from "@/knowledge/structured/numbers.json";
import indices from "@/knowledge/structured/indices.json";

const n = numbers.numbers.find((x) => x.so === result.lifePath);
const ix = indices.indices.find((x) => x.key === "life_path");
// Thẻ: ix.ten  ·  số lớn result.lifePath  ·  dòng phụ n.ten  ·  chip n.tu_khoa
```

Chỉ số nào ghép với file nào:

| Chỉ số | Lấy nghĩa từ |
|---|---|
| Đường đời, Sứ mệnh, Linh hồn, Nhân cách, Đam mê, Trưởng thành, Tư duy lý trí, Ngày sinh | `numbers.json` (+ phần `cach_doc` của chỉ số trong `indices.json`) |
| Chặng | `numbers.json` → trường `trong_chang` |
| Năm cá nhân, Tháng cá nhân | `cycles.json` → `personal_year` |
| Thách thức | `cycles.json` → `challenge` |
| Số thiếu, Sức mạnh tiềm thức, Cân bằng, Kết nối | `supporting.json` |
| Biểu đồ ngày sinh | `birth-chart.json` |

## 2. `import/`: nạp vào kho Milvus

| File | Nhóm dữ liệu (UC15) | Số mục |
|---|---|---|
| `chunks.json` | Chunk | 110 |
| `summaries.json` | Summary | 6 |
| `qa.json` | QA | 20 |

Các trường:

- Chunk: `title`, `source_url`, `language`, `content`, `notes`, `key_concepts`, `chunk_index` (+ `tags` để lọc, ví dụ `["index","life_path"]`, `["number","7"]`)
- Summary: `title`, `source_url`, `language`, `summary`, `notes`
- QA: `title`, `source_url`, `language`, `question`, `answer`

> **Lưu ý cho lập trình viên:** tên trường ở đây là đề xuất. Nếu chức năng nhập hàng loạt (UC16) của code hiện có dùng tên trường khác, viết một script nhỏ đổi tên trường, đừng sửa tay nội dung. `source_url` dạng `pyra-original/...` là mã nội bộ đánh dấu nội dung gốc; khi web có trang blog/kiến thức thì đổi thành URL thật.

## 3. Mở rộng nội dung

- Thêm nội dung mới **luôn viết bằng lời của đội Pyra**. Đọc sách để hiểu, không chép câu chữ (xem `docs/numerology-spec.md` mục 1).
- Giữ giọng văn: lịch sự, gợi mở, tích cực nhưng trung thực về thử thách; nói "xu hướng", "thường", "có thể", không nói "chắc chắn", "định mệnh".
- Không viết về sức khỏe, bệnh tật, đầu tư, pháp lý.
- Mỗi lần sửa: tăng `meta.version` trong các file `structured/`, nạp lại `import/` và xóa cache giải thích AI.
- Việc còn lại cho UC11 (song ngữ): bản tiếng Anh `language: "en"` với cùng cấu trúc.
