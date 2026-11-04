Dưới đây là bản mô tả **use case và giao diện của NumerologyWebApp**, dựa trên mã nguồn đã tải. Đây là đặc tả hiện trạng; mình chưa chạy ứng dụng để kiểm tra trực tiếp cách hiển thị.

**1. Mục đích và đối tượng sử dụng**

Website giúp người dùng nhập **họ tên, ngày sinh** để tính các chỉ số Nhân số học, xem biểu đồ ngày sinh và trao đổi với trợ lý AI.

Có ba nhóm tác nhân:

| Tác nhân | Mục đích |
|---|---|
| Người dùng | Tính chỉ số, xem giải thích, lưu hồ sơ và trò chuyện với AI |
| Người quản lý nội dung | Bổ sung kiến thức cho AI qua trang quản trị Milvus |
| Dịch vụ bên ngoài | Cung cấp mô hình AI, tìm kiếm kiến thức, nhận khảo sát và gửi email |

Trong phạm vi mã nguồn đã kiểm tra, luồng người dùng **không yêu cầu đăng ký hoặc đăng nhập**. Hồ sơ, lịch sử chat và cấu hình AI được lưu trong trình duyệt.

**2. Danh sách use case**

| Mã | Use case | Tác nhân |
|---|---|---|
| UC01 | Tính các chỉ số Nhân số học | Người dùng |
| UC02 | Xem công thức tính chỉ số | Người dùng |
| UC03 | Yêu cầu AI giải thích ý nghĩa chỉ số | Người dùng |
| UC04 | Xem biểu đồ ngày sinh | Người dùng |
| UC05 | Yêu cầu AI phân tích biểu đồ | Người dùng |
| UC06 | Lưu và quản lý hồ sơ | Người dùng |
| UC07 | Trò chuyện với trợ lý AI | Người dùng |
| UC08 | Quản lý các cuộc trò chuyện | Người dùng |
| UC09 | Xuất và nhập lịch sử chat | Người dùng |
| UC10 | Cấu hình nhà cung cấp AI riêng | Người dùng |
| UC11 | Đổi ngôn ngữ và giao diện sáng/tối | Người dùng |
| UC12 | Gửi khảo sát và góp ý | Người dùng |
| UC13 | Xem thông tin ủng hộ tác giả | Người dùng |
| UC14 | Kiểm tra kết nối kho kiến thức | Người quản lý nội dung |
| UC15 | Nhập kiến thức riêng lẻ | Người quản lý nội dung |
| UC16 | Nhập kiến thức hàng loạt | Người quản lý nội dung |

**3. Chi tiết use case**

**UC01 — Tính các chỉ số Nhân số học**

**Mục tiêu:** Tạo bộ chỉ số từ họ tên và ngày sinh.

**Điều kiện:** Người dùng truy cập trang chủ.

**Luồng chính:**

1. Người dùng nhập họ tên.
2. Nhập ngày, tháng, năm sinh.
3. Nhấn **Xem kết quả**.
4. Hệ thống kiểm tra ngày sinh.
5. Hệ thống chuẩn hóa họ tên: bỏ dấu, chuyển chữ hoa và xử lý khoảng trắng.
6. Tính toán các chỉ số.
7. Cập nhật biểu đồ ngày sinh và danh sách kết quả.

**Dữ liệu đầu vào:**

| Trường | Mô tả |
|---|---|
| Họ tên | Dùng để quy đổi chữ cái thành số |
| Ngày sinh | Dùng để tính chỉ số ngày sinh, đường đời, chu kỳ và biểu đồ |

**Các trường hợp lỗi ngày sinh:**

- Chưa nhập ngày sinh.
- Sai định dạng hoặc ngày không tồn tại.
- Ngày sinh ở tương lai.
- Năm sinh trước 1900 hoặc sau năm hiện tại.

Thông báo lỗi xuất hiện ngay dưới phần nhập ngày sinh.

**Kết quả:** Hiển thị 16 chỉ số:

| Nhóm | Các chỉ số |
|---|---|
| Chỉ số cá nhân | Đường đời, Sứ mệnh, Linh hồn, Nhân cách |
| Tiềm năng và xu hướng | Đam mê, Trưởng thành, Tư duy lý trí, Sức mạnh tiềm thức |
| Bổ trợ | Kết nối, Cân bằng, Số thiếu |
| Thời gian và chu kỳ | Ngày sinh, Năm cá nhân, Tháng cá nhân, Chặng, Thách thức |

Phần tính chỉ số chạy bằng logic trong ứng dụng, không cần AI để tạo ra kết quả số.

**UC02 — Xem công thức tính chỉ số**

**Mục tiêu:** Giúp người dùng hiểu kết quả được tính như thế nào.

**Luồng chính:**

1. Người dùng nhấn vào một thẻ chỉ số.
2. Hệ thống mở hộp thoại chi tiết.
3. Hiển thị tên chỉ số, giá trị và công thức.
4. Người dùng đọc các bước tính cùng ví dụ minh họa.
5. Đóng hộp thoại để quay lại danh sách.

**Kết quả:** Người dùng có thể kiểm tra cách tính mà không phải rời trang chủ.

**UC03 — Yêu cầu AI giải thích ý nghĩa chỉ số**

**Điều kiện:** Hộp thoại chi tiết chỉ số đang mở; dịch vụ AI đã được cấu hình.

**Luồng chính:**

1. Người dùng chọn xem ý nghĩa của chỉ số.
2. Hệ thống kiểm tra nội dung đã lưu trong bộ nhớ đệm của trình duyệt.
3. Nếu có nội dung còn hạn, hệ thống hiển thị lại.
4. Nếu chưa có, hệ thống gửi yêu cầu đến API chat.
5. Nội dung AI xuất hiện dần trong hộp thoại.
6. Hệ thống lưu kết quả để dùng lại.

**Luồng thay thế:**

- Nếu gọi AI thất bại, hiển thị lỗi và nút thử lại.
- Nếu dùng kết quả đã lưu, hiển thị nhãn nhận biết.

**Quy tắc hiện có:** Bộ nhớ đệm giải thích chỉ số có thời hạn 7 ngày.

**UC04 — Xem biểu đồ ngày sinh**

**Mục tiêu:** Trực quan hóa các chữ số xuất hiện trong ngày sinh.

**Luồng chính:**

1. Sau khi có ngày sinh, hệ thống đếm số lần xuất hiện của các số từ 1 đến 9.
2. Đưa chúng vào lưới 3 × 3.
3. Đánh dấu số xuất hiện, số vắng mặt và số cô lập.
4. Phát hiện các mũi tên đủ số hoặc mũi tên trống.
5. Người dùng có thể nhấn vào ô số để xem nội dung liên quan.

Bố trí lưới theo mã nguồn:

```text
┌─────────┬─────────┬─────────┐
│    3    │    6    │    9    │
├─────────┼─────────┼─────────┤
│    2    │    5    │    8    │
├─────────┼─────────┼─────────┤
│    1    │    4    │    7    │
└─────────┴─────────┴─────────┘
```

Người dùng có thể thu gọn hoặc mở lại biểu đồ. Trạng thái này được ghi nhớ trên trình duyệt.

**UC05 — Yêu cầu AI phân tích biểu đồ**

**Điều kiện:** Đã có biểu đồ ngày sinh; dịch vụ AI hoạt động.

**Luồng chính:**

1. Người dùng nhấn **Giải mã biểu đồ**.
2. Hệ thống mở hộp thoại phân tích.
3. Gửi dữ liệu biểu đồ cho AI.
4. Hiển thị nội dung phân tích dần theo phản hồi.
5. Nếu có bản phân tích đã lưu, hiển thị lại kèm thời điểm lưu.
6. Người dùng có thể yêu cầu tạo lại nội dung.

**Ngoại lệ:** Nếu lỗi, hộp thoại hiển thị trạng thái thất bại và nút thử lại.

**UC06 — Lưu và quản lý hồ sơ**

**Mục tiêu:** Tra cứu lại nhiều người mà không phải nhập lại thông tin.

**Luồng lưu:**

1. Nhập họ tên và ngày sinh.
2. Nhấn biểu tượng lưu cạnh nút xem kết quả.
3. Hệ thống lưu hồ sơ vào trình duyệt.
4. Hiển thị thông báo thành công.

**Luồng sử dụng lại:**

1. Nhấn biểu tượng hồ sơ trong ô họ tên.
2. Xem danh sách đã lưu.
3. Tìm theo tên hoặc ngày sinh khi danh sách có nhiều hồ sơ.
4. Chọn một hồ sơ.
5. Hệ thống đưa thông tin vào phần tra cứu.

**Quy tắc:**

- Tối đa 10 hồ sơ.
- Hồ sơ gồm họ tên và ngày sinh.
- Có thể xóa từng hồ sơ.
- Hồ sơ trùng tên và ngày sinh được nhận diện để tránh tạo thêm bản trùng.
- Dữ liệu lưu trên trình duyệt, chưa có chức năng đồng bộ tài khoản.

**UC07 — Trò chuyện với trợ lý AI**

**Mục tiêu:** Hỏi đáp về Nhân số học hoặc yêu cầu phân tích thông tin cá nhân.

**Luồng chính:**

1. Người dùng mở trang Chat AI.
2. Nhập câu hỏi, chẳng hạn: “Ý nghĩa đường đời số 7 là gì?”
3. Nhấn gửi.
4. Hệ thống tìm nội dung liên quan trong kho kiến thức.
5. AI tạo câu trả lời từ câu hỏi, lịch sử hội thoại và dữ liệu tìm được.
6. Câu trả lời xuất hiện dần.
7. Nếu có nguồn, hiển thị phần tài liệu tham khảo.

**Trạng thái giao diện:**

- Chưa có tin nhắn: hiển thị lời chào và ví dụ câu hỏi.
- Đang xử lý: hiển thị trạng thái tìm kiến thức hoặc tạo câu trả lời.
- Thành công: hiển thị nội dung AI.
- Thất bại: hiển thị lỗi và cho phép thử lại.

Nội dung trả lời hỗ trợ định dạng Markdown và công thức toán.

**UC08 — Quản lý các cuộc trò chuyện**

**Luồng chính:**

1. Người dùng mở bảng lịch sử từ cạnh trái.
2. Tạo cuộc trò chuyện mới hoặc chọn cuộc trò chuyện cũ.
3. Hệ thống tải các tin nhắn tương ứng.
4. Người dùng có thể đổi tên, xóa một cuộc trò chuyện hoặc xóa toàn bộ lịch sử.

**Quy tắc:**

- Tiêu đề ban đầu được tạo từ tin nhắn đầu tiên.
- Xóa cuộc trò chuyện hoặc toàn bộ lịch sử có bước xác nhận.
- Lịch sử được lưu trên thiết bị bằng IndexedDB.

**UC09 — Xuất và nhập lịch sử chat**

**Xuất dữ liệu:**

1. Mở bảng lịch sử.
2. Chọn xuất dữ liệu trò chuyện.
3. Trình duyệt tải xuống tệp JSON.

**Nhập dữ liệu:**

1. Chọn nhập dữ liệu.
2. Chọn tệp JSON.
3. Hệ thống đọc và kiểm tra cấu trúc.
4. Tải các cuộc trò chuyện vào ứng dụng.
5. Thông báo thành công hoặc lỗi.

**Lưu ý về hành vi hiện tại:** Mã nhập dữ liệu gán danh sách được nhập thành danh sách phiên chat đang lưu; không nên mô tả chức năng này là tự động gộp với lịch sử cũ.

**UC10 — Cấu hình nhà cung cấp AI riêng**

**Mục tiêu:** Cho phép người dùng sử dụng API và model của mình.

**Luồng chính:**

1. Mở phần cấu hình nhà cung cấp AI.
2. Chọn thêm nhà cung cấp.
3. Chọn loại dịch vụ.
4. Nhập tên hiển thị, địa chỉ API và API key.
5. Lấy danh sách model.
6. Chọn model.
7. Kiểm tra kết nối.
8. Lưu và chọn cấu hình để sử dụng.

**Các lựa chọn trong giao diện:** OpenAI, OpenRouter, Anthropic, Google AI, Grok, Ollama và Custom.

**Chức năng bổ sung:**

- Sửa hoặc xóa cấu hình.
- Thêm nhiều API key.
- Che hoặc hiện key khi nhập.
- Xoay vòng key khi có nhiều key.
- Chuyển về cấu hình mặc định hệ thống.

Danh sách trên là các lựa chọn được khai báo trong mã; khả năng kết nối thực tế còn phụ thuộc API và model được chọn.

**UC11 — Đổi ngôn ngữ và giao diện**

1. Người dùng chọn tiếng Việt hoặc tiếng Anh.
2. Hệ thống thay đổi nội dung giao diện theo ngôn ngữ.
3. Người dùng nhấn biểu tượng mặt trăng hoặc mặt trời để chuyển giao diện tối/sáng.

Các điều khiển này nằm trên thanh công cụ phía dưới trang.

**UC12 — Gửi khảo sát và góp ý**

**Mục tiêu:** Thu thập mức độ hài lòng và nhu cầu phát triển sản phẩm.

**Luồng chính:**

1. Người dùng mở khảo sát hoặc gặp bảng khảo sát theo điều kiện sử dụng.
2. Trả lời các câu hỏi về trải nghiệm.
3. Chọn tính năng mong muốn.
4. Có thể cung cấp ý kiến và thông tin về mức sẵn sàng chi trả.
5. Gửi phản hồi.
6. Hệ thống chuyển dữ liệu đến webhook được cấu hình và hiển thị lời cảm ơn.

Người dùng có thể bỏ qua hoặc đóng khảo sát.

**UC13 — Xem thông tin ủng hộ tác giả**

1. Người dùng nhấn biểu tượng ủng hộ.
2. Xem thông tin nhận ủng hộ.
3. Có thể sao chép thông tin được cung cấp.

Phần này là tiện ích ủng hộ tác giả; chưa đủ cơ sở để mô tả thành quy trình thanh toán đơn hàng.

**UC14–UC16 — Quản lý kho kiến thức**

**Kiểm tra kết nối:**

1. Mở trang quản trị Milvus.
2. Nhấn kiểm tra kết nối.
3. Hệ thống hiển thị đang kiểm tra, kết nối thành công hoặc lỗi.

**Nhập riêng lẻ:**

1. Chọn nhóm dữ liệu: `Chunk`, `Summary` hoặc `QA`.
2. Nhập các trường tương ứng.
3. Gửi dữ liệu.
4. Hệ thống tạo vector biểu diễn nội dung và lưu vào Milvus.
5. Hiển thị thành công hoặc lỗi.

| Nhóm | Nội dung nhập |
|---|---|
| Chunk | Tiêu đề, liên kết nguồn, ngôn ngữ, nội dung, ghi chú, khái niệm chính, chỉ số đoạn |
| Summary | Tiêu đề, liên kết nguồn, ngôn ngữ, bản tóm tắt, ghi chú |
| QA | Tiêu đề, liên kết nguồn, ngôn ngữ, câu hỏi, câu trả lời |

**Nhập hàng loạt:**

1. Chuyển sang chế độ nhập hàng loạt.
2. Chọn một hoặc nhiều tệp JSON.
3. Thiết lập số tác vụ xử lý đồng thời.
4. Bắt đầu nhập.
5. Theo dõi tiến độ và kết quả xử lý.

Tên trang là quản trị, nhưng phần mã đã đọc chưa cho thấy luồng đăng nhập hay phân quyền riêng cho người quản lý.

**4. Giao diện trang chủ**

Trang chủ dùng bố cục dọc, nội dung nằm giữa màn hình, với màu nhấn chủ yếu là **cam và đỏ**, các khối bo góc và hiệu ứng chuyển động nhẹ.

Thứ tự nội dung:

| Khu vực | Thành phần và hành vi |
|---|---|
| Giới thiệu | Linh vật Pyra, tên ứng dụng, mô tả ngắn |
| Lối vào Chat AI | Nút hoặc khối kêu gọi trải nghiệm trợ lý AI |
| Video hướng dẫn | Video giải thích Nhân số học; có thể thu gọn |
| Nhập thông tin | Ô họ tên, danh sách hồ sơ, phần nhập ngày sinh |
| Hành động | Nút xem kết quả và biểu tượng lưu hồ sơ |
| Biểu đồ | Lưới ngày sinh, các dấu hiệu và nút giải mã |
| Kết quả | Danh sách 16 thẻ chỉ số |
| Cuối nội dung | Tuyên bố mục đích tham khảo, giải trí |
| Thanh công cụ cố định | Ngôn ngữ, sáng/tối, ủng hộ, GitHub và góp ý |

**Phần nhập thông tin**

- Ô họ tên có biểu tượng hồ sơ bên trái.
- Danh sách hồ sơ mở dạng bảng nổi.
- Ngày sinh được nhập qua các trường ngày, tháng, năm.
- Nút chính có trạng thái đang xử lý.
- Nút lưu bị vô hiệu hóa nếu chưa có tên hoặc ngày sinh.
- Khi hồ sơ đã tồn tại, biểu tượng lưu được ẩn theo logic hiện tại.

**Phần thẻ kết quả**

Mỗi thẻ biểu diễn một chỉ số với tên và giá trị. Nhấn thẻ để xem chi tiết.

Bố cục thay đổi theo chiều rộng màn hình:

| Kích thước | Số thẻ mỗi hàng theo cấu hình |
|---|---:|
| Điện thoại | 2 |
| Màn hình nhỏ | 3 |
| Màn hình vừa | 4 |
| Màn hình lớn | 5 |

**Hộp thoại chỉ số**

Chứa:

- Tiêu đề chỉ số và giá trị.
- Công thức tính, các bước và ví dụ.
- Nút yêu cầu giải thích bằng AI.
- Nội dung AI hoặc trạng thái đang tải.
- Nhãn nội dung đã lưu.
- Thông báo lỗi và nút thử lại.

**Hộp thoại phân tích biểu đồ**

Có vùng nội dung cuộn bên trong, phù hợp với phần giải thích dài. Khi dùng bản đã lưu, hiển thị thời điểm lưu và nút tạo lại.

**5. Giao diện trang Chat AI**

Trang chat tập trung vào ba khu vực:

| Khu vực | Nội dung |
|---|---|
| Thanh trên cùng | Điều khiển mở lịch sử, nhận diện trang và các tiện ích |
| Vùng hội thoại | Tin nhắn người dùng, câu trả lời AI, nguồn tham khảo và trạng thái xử lý |
| Vùng nhập | Ô nhập nhiều dòng và nút gửi |

**Khi chưa có hội thoại**

Hiển thị lời mời hỏi về Nhân số học, câu hỏi ví dụ và hướng dẫn nhập tên, ngày sinh để phân tích cá nhân.

**Khi đang trò chuyện**

- Tin nhắn được phân biệt theo người gửi.
- Phản hồi AI hiển thị dần.
- Nguồn tham khảo xuất hiện cùng câu trả lời khi có dữ liệu.
- Lỗi được hiển thị trong luồng hội thoại để người dùng thử lại.

**Bảng lịch sử bên trái**

Mở dạng ngăn kéo:

- Trên máy tính: chiếm một phần chiều rộng.
- Trên điện thoại: có thể mở toàn màn hình.

Bên trong gồm nút tạo chat mới, danh sách phiên, thời gian cập nhật, điều khiển đổi tên/xóa, nhập/xuất dữ liệu và cấu hình AI.

**Biểu mẫu cấu hình AI**

Gồm loại dịch vụ, tên hiển thị, URL API, các API key, danh sách model, nút lấy model, kiểm tra kết nối, lưu và hủy. Các key đã thêm hiển thị dạng che bớt ký tự.

**6. Giao diện trang quản trị Milvus**

Trang quản trị có biểu mẫu theo chiều dọc:

1. Tiêu đề quản trị kho kiến thức.
2. Khối trạng thái kết nối và nút kiểm tra.
3. Danh sách chọn nhóm dữ liệu.
4. Hai chế độ nhập riêng lẻ và hàng loạt.
5. Biểu mẫu hoặc khu vực chọn tệp tương ứng.
6. Điều khiển gửi và vùng phản hồi tiến độ/kết quả.

Các trường nhập thay đổi theo nhóm dữ liệu, giúp người quản lý chỉ nhìn thấy trường liên quan đến loại nội dung đang bổ sung.

**7. Các trạng thái giao diện cần thể hiện**

| Trạng thái | Cách thể hiện |
|---|---|
| Dữ liệu ngày sinh không hợp lệ | Viền lỗi và thông báo dưới trường |
| Đang tính kết quả | Nút hiển thị trạng thái xử lý |
| Đang chờ AI | Spinner hoặc chỉ báo tiến trình |
| AI đang trả lời | Nội dung xuất hiện dần |
| Kết quả lấy từ bộ nhớ đệm | Nhãn đã lưu; phân tích biểu đồ có thời điểm lưu |
| Lưu/xóa hồ sơ thành công | Thông báo ngắn |
| Đạt giới hạn hồ sơ | Thông báo giới hạn 10 hồ sơ |
| Xóa lịch sử chat | Hộp thoại xác nhận |
| Tệp nhập không hợp lệ | Thông báo lỗi nhập dữ liệu |
| Kết nối dịch vụ thất bại | Trạng thái lỗi và hành động thử lại |

**8. Phạm vi hiện tại cần phân biệt rõ**

Các tính năng như **báo cáo PDF và tương hợp cặp đôi** xuất hiện trong nội dung khảo sát tính năng mong muốn. Chưa nên đưa chúng vào danh sách chức năng đã hoàn thiện.

Tương tự, chưa thấy luồng tài khoản người dùng, đồng bộ dữ liệu giữa thiết bị, gói thuê bao hoặc thanh toán dịch vụ. Hồ sơ và lịch sử hiện gắn với trình duyệt; các yêu cầu phân tích AI vẫn được gửi đến API xử lý và nhà cung cấp AI tương ứng.