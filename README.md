# Tôm Fest Cà Mau — HTML/CSS

Dựng theo Figma **VNF (Copy)**, khung 1920px:

| Trang | Node Figma |
| --- | --- |
| `index.html` — Trang chủ | `4903:251` |
| `booth.html` — Khu triển lãm / chọn gian hàng | `5162:338` |
| `payment.html` — Thông tin đăng ký | `5162:20505` |
| `visitor.html` — Đăng ký tham quan | `5162:33607` |
| `media.html` — Truyền thông / Hội thảo | `5375:28868` |

Bản mobile không có trong file design nên được tự thiết kế lại từ cùng bộ token (xem "Mobile" bên dưới).

## Cấu trúc CSS

| File | Vai trò |
| --- | --- |
| `css/tokens.css` | **Design token dùng chung toàn site** — màu, font, thang chữ fluid 2 đoạn (`clamp()` 393→1440px trong `:root`, 1440→1920px trong `@media (min-width: 1440px)`), spacing, layout, radius, motion. Nạp đầu tiên ở mọi trang. |
| `css/base.css` | Reset + component dùng lại: `.container`, `.section`, `.section-head`, `.btn` (light / primary / pill-icon), `.hairline`, header + drawer mobile, footer. |
| `css/index.css` | Riêng trang chủ: hero, về chúng tôi, dải nhà tài trợ, các sự kiện chính, tin tức. |
| `css/booth.css` | Riêng trang khu triển lãm: bảng giá, sơ đồ gian hàng, panel chi tiết. |
| `css/forms.css` | **Hệ form dùng chung**: `.form-card`, `.field`, `.field-group`, radio, upload, trường điện thoại, `.back-pill`. Nạp cho mọi trang có form. |
| `css/payment.css` | Riêng trang đăng ký: bố cục 718/432 và thẻ tóm tắt đơn hàng. |
| `css/visitor.css` | Riêng trang tham quan: cột giới thiệu + liên hệ + dải đối tác, thẻ form. |
| `css/media.css` | Riêng trang truyền thông: tiêu đề trang + card hội nghị (ô thông tin, chip ngày/giờ, poster). |
| `css/common.css` | CSS cũ — **không trang nào dùng nữa**, xoá được. |

Trang mới nạp theo thứ tự: `tokens.css` → `base.css` → `<page>.css`, rồi viết CSS riêng bằng token —
không hard-code màu/kích thước.

## Asset

- `assets/tomfest/` — ảnh + icon export từ Figma (~1.5MB, PNG lớn đã nén sang JPEG).
- `assets/js/site.js` — đổi nền header khi cuộn + đóng/mở menu mobile.
- `assets/event-map.png`, `assets/booth-map.svg`, `assets/booth.svg` — sơ đồ sự kiện và lưới gian hàng.
- `assets/js/booth.js` — sinh 152 vùng chọn gian hàng, tính diện tích/tiền, lưu `sessionStorage`.
- `assets/js/payment.js` — đọc lại `sessionStorage.selectedBooths`, dựng chip + tổng tiền, xử lý upload logo.
- `assets/js/form-validate.js` — **kiểm tra form dùng chung** (`initFormValidation`): ô `[required]` trống thì
  gắn `.is-error` lên `.field-group`, focus ô đầu tiên, xoá lỗi khi người dùng gõ; hợp lệ thì hiện dòng trạng thái.
  Dùng ở cả `payment.html` và `visitor.html`.
- `assets/js/visitor.js` — nối form đăng ký tham quan vào helper trên.
- `assets/gme/` — asset của bản thiết kế GME cũ, **hiện không còn dùng** (xoá được nếu không cần).

## Mobile (tự thiết kế)

- Header: logo + nút hamburger, drawer trắng chữ xanh; header đổi nền xanh `--c-primary` khi cuộn.
- Hero: cao `100svh`, chữ co theo `clamp()`, 2 nút cùng hàng.
- Về chúng tôi: 1 cột; số liệu 1 cột dưới 460px, 2 cột từ 460px trở lên.
- Sự kiện: ảnh trên, danh sách 01–04 bên dưới.
- Tin tức: 3 card xếp dọc (từ 700px card phụ chuyển sang dạng ngang).
- Footer: căn giữa, thông tin liên hệ xếp dọc.

## booth.html — lưu ý

- Header trang trong dùng `.site-header--solid` (nền xanh, sticky). Trên nền xanh hai nút tự đảo màu:
  "Tham quan" viền trắng, "Đăng ký gian hàng" nền trắng chữ xanh — đúng design.
- Toạ độ 152 gian hàng nằm trong `assets/js/booth.js` (hệ 1920×879, `booth.svg` đặt tại 98.34/248).
  **Không đổi** các class `.booth-map-area` / `.booth-overlay` / `.map-bottom` / `.booth-hotspots`
  và các id `selectedTags` / `totalArea` / `totalPrice` / `finalPrice` / `continueBtn` — JS phụ thuộc vào chúng.
- Giá mặc định `PRICE_PER_BOOTH = 6.572.000 đ`/gian (9m²) trong `booth.js`.
- Mobile: sơ đồ tổng thể và sơ đồ gian hàng đều cuộn ngang (min-width 640px / 1400px) để chữ còn đọc được;
  panel "Chi tiết gian hàng" chuyển xuống dưới bản đồ thay vì nổi bên phải.

## payment.html — lưu ý

- Luồng thật đã nối: chọn gian hàng ở `booth.html` → bấm "Tiếp tục" → `payment.html` đọc
  `sessionStorage.selectedBooths` và hiện chip + tổng tiền (6.572.000 đ × số gian).
- Form dùng thẻ thật (`input` / `select` / `radio` / `input[type=file]`), có kiểm tra trường bắt buộc:
  ô trống sẽ viền đỏ và focus vào ô đầu tiên. Gửi thành công thì hiện dòng trạng thái trong thẻ tóm tắt
  (không dùng `alert`).
- Khác design ở 2 chỗ, đều cố ý:
  - Khối "Tên logo cty / 12.5MB" trong Figma là trạng thái ví dụ; ở đây **ẩn cho tới khi người dùng chọn file thật**
    để tránh hiểu nhầm là đã đính kèm.
  - Thẻ tóm tắt trong Figma có 2 dòng "Giảm giá gian hàng" trùng nhau; đã rút còn
    "Giảm giá gian hàng" + "Giảm giá hội viên".
- Ô "Quốc gia" trong Figma bị đặt nhãn "Điện thoại" (lỗi design) — đã sửa thành "Quốc gia".

## visitor.html — lưu ý

- Cột trái dùng dải logo đối tác chạy ngang (marquee, tắt khi `prefers-reduced-motion`), mờ dần ở mép phải.
- Form dùng lại nguyên `css/forms.css`: nhóm "Hình thức tham gia" là `<fieldset>` + `<legend>` với 3 pill radio.
- Kiểm tra bắt buộc: 5 ô `*` trống → viền đỏ + focus ô đầu; điền đủ → hiện dòng xác nhận trong thẻ form.

## Dọn dẹp còn lại

Các file dưới đây **không trang nào tham chiếu nữa** (~5MB), xoá được khi bạn muốn:

```bash
rm -rf assets/gme assets/booth-map.png assets/*-reference.png \
       assets/logo-blue.png assets/logo-white.png css/common.css
```

## Chạy thử

```bash
python3 -m http.server 8765
# mở http://localhost:8765/index.html
```
