# BIOPAVE landing page

Trang giới thiệu và khảo sát BIOPAVE, lấy nội dung từ tài liệu Google Docs do người dùng cung cấp. Giao diện responsive theo tông xanh đậm và kem của ảnh tham chiếu. Ảnh hero được tạo để minh họa phong cách, không phải ảnh sản phẩm thật.

Thang chữ theo yêu cầu: H1 47.78px, H2 39.81px, H3 33.18px, H4 27.65px, H5 23.04px, H6 19.2px, đoạn văn 16px, `small` 13.33px và chữ phụ nhỏ 11.11px.

## Chức năng

- Form khảo sát 3 bước khớp với Google Form của nhóm: email, họ tên, SĐT và 5 câu hỏi lựa chọn.
- Kiểm tra dữ liệu ở trình duyệt và máy chủ; gửi phản hồi qua `app/api/survey/route.ts` đến Google Form. Trang không lưu thêm bản sao phản hồi trong D1.
- Sau khi gửi, hiển thị lời cảm ơn và cuộn tới 3 dòng sản phẩm.
- Thẻ sản phẩm tương tác, quy trình bằng ảnh, minh họa nguyên lý thấm nước, nút gọi/Zalo.
- Nhãn cố định cạnh thanh cuộn cho biết mục đang xem và tiến độ cuộn; tự ẩn khi dừng cuộn.
- Ảnh ứng dụng, ảnh nhóm nghiên cứu, poster và khung video giới thiệu chờ bổ sung tệp.
- Dữ liệu khảo sát không có trang xem công khai trên website.

## Chạy cục bộ

Yêu cầu Node.js 22.13+ và pnpm. Từ thư mục này:

```sh
pnpm install
pnpm run build
pnpm run dev
```

Mở URL Local được in ra (mặc định `http://127.0.0.1:5173/`). Form cần kết nối mạng để gửi phản hồi tới Google.

## Cấu trúc chính

- `app/page.tsx`: nội dung và tương tác landing page
- `app/globals.css`: giao diện responsive
- `app/api/survey/route.ts`: API kiểm tra và chuyển phản hồi tới Google Form
- `lib/survey-form.ts`: câu hỏi, đáp án và mã `entry` lấy từ đường dẫn điền sẵn
- `tests/survey-form.test.mjs`: kiểm tra ánh xạ dữ liệu sang mã `entry`
- `public/biopave-hero.png`: ảnh hero minh họa
- `public/biopave-team.png`, `public/biopave-poster.png` và các ảnh sản phẩm: hình do người dùng cung cấp

## Video giới thiệu

Trang dùng video YouTube `t-re7ljv_cE`. Ảnh nền và nút phát của BIOPAVE vẫn hiện trước; khi khách bấm phát, trình phát YouTube mở trong cùng khung. Không cần đưa MP4 lên GitHub. Nếu thay video, sửa `INTRO_VIDEO_EMBED_URL` trong `app/page.tsx`.

Google Form cần được xuất bản, nhận phản hồi và cho phép người dùng điền email trực tiếp. Nếu nhóm đổi câu hỏi hoặc đáp án trong Google Form, cần cập nhật `lib/survey-form.ts`. Đường gửi `formResponse` dựa trên biểu mẫu Google hiện tại và có thể cần điều chỉnh nếu Google thay đổi cách nhận phản hồi. Sau khi triển khai, gửi một phản hồi thử và xác nhận nó xuất hiện trong tab **Câu trả lời** của Google Form.

Site đã được đăng ký trong `.openai/hosting.json` nhưng chưa xuất bản.
