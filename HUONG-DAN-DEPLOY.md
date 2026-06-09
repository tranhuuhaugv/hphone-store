# 🚀 Hướng dẫn deploy HPHONE Store lên Cloudflare Pages

> Dành cho người **không rành kỹ thuật**. Làm theo từng bước, có gì kẹt thì gửi ảnh chụp màn hình cho người hỗ trợ.

Mục tiêu: đưa website lên mạng tại địa chỉ **hphone.store**, và để các đường dẫn sản phẩm
"đẹp" như `hphone.store/iphone-17-pro-max` chạy được (giúp **SEO** tốt hơn — Google ưa
URL sạch, không có dấu `?` hay `.html`).

---

## 📌 Hiểu nhanh trong 30 giây

- Website này là các **file HTML tĩnh** + một ít **code chạy trên server của Cloudflare**
  (nằm trong thư mục `functions/`).
- Cái thư mục `functions/` chính là thứ làm cho URL `hphone.store/iphone-17-pro-max`
  **không bị lỗi 404**. Nếu thiếu nó, link sản phẩm sẽ hỏng.
- **Cloudflare Pages tự động đọc thư mục `functions/`** — bạn KHÔNG phải cấu hình gì thêm.
  Chỉ cần deploy đúng cách là chạy.

> ⚠️ Lưu ý: mở file HTML trực tiếp trên máy tính (nhấp đúp) sẽ **KHÔNG** chạy được URL
> đẹp. Phải deploy lên Cloudflare mới chạy. Đây là điều bình thường, không phải lỗi.

---

## ✅ Chuẩn bị (chỉ làm 1 lần)

Bạn cần 2 tài khoản miễn phí:

1. **GitHub** — nơi chứa code: <https://github.com> (repo đã có sẵn:
   `tranhuuhaugv/hphone-store`).
2. **Cloudflare** — nơi chạy website: <https://dash.cloudflare.com/sign-up>.

Và tên miền **hphone.store** (bạn đã mua rồi).

---

## 🛠️ PHẦN 1 — Kết nối GitHub với Cloudflare Pages (làm 1 lần)

1. Đăng nhập **Cloudflare** → ở menu trái chọn **Workers & Pages**.
2. Bấm nút **Create application** → chọn tab **Pages** → **Connect to Git**.
3. Bấm **Connect GitHub**, đăng nhập GitHub, cho phép Cloudflare truy cập repo
   **`hphone-store`**. Chọn repo đó → **Begin setup**.
4. Ở màn hình **Set up builds and deployments**, điền **CHÍNH XÁC** như sau:

   | Ô | Điền gì |
   |---|---------|
   | **Project name** | `hphone-store` (hoặc tên bất kỳ) |
   | **Production branch** | `main` |
   | **Framework preset** | **None** |
   | **Build command** | **để TRỐNG** (xóa hết, không điền gì) |
   | **Build output directory** | gõ dấu chấm `.` (hoặc để trống / `/`) |

   > 💡 Vì site là HTML tĩnh, **không cần build**. Cứ để trống là đúng. Thư mục
   > `functions/` Cloudflare sẽ tự nhận.

5. Bấm **Save and Deploy**. Đợi 1–2 phút.
6. Xong! Cloudflare cho bạn một địa chỉ tạm kiểu `hphone-store-xxx.pages.dev`.
   Mở thử để xem web đã lên chưa.

---

## 🌐 PHẦN 2 — Gắn tên miền hphone.store (làm 1 lần)

1. Trong project vừa tạo, mở tab **Custom domains** → **Set up a domain**.
2. Gõ `hphone.store` → **Continue** → **Activate domain**.
3. Cloudflare sẽ hướng dẫn trỏ tên miền:
   - **Nếu tên miền đang quản lý ngay trong Cloudflare** → nó tự thêm, chỉ cần bấm xác nhận.
   - **Nếu mua ở nơi khác** (Tenten, GoDaddy, Namecheap…) → Cloudflare sẽ cho bạn
     bản ghi **CNAME**/**A** để dán vào trang quản lý tên miền của nhà cung cấp đó.
     (Phần này nếu khó, nhờ người hỗ trợ kỹ thuật làm giúp — chỉ mất 5 phút.)
4. Đợi vài phút đến vài giờ để tên miền "ăn". Sau đó mở **https://hphone.store** là chạy.

---

## 🔁 PHẦN 3 — Mỗi khi cập nhật website (làm thường xuyên)

Đây là phần **tự động hóa** tuyệt vời nhất:

> **Mỗi lần code được đẩy (push) lên GitHub nhánh `main`, Cloudflare TỰ ĐỘNG build
> lại và cập nhật website sau ~1 phút.** Bạn không phải làm gì thủ công.

Quy trình thông thường (người kỹ thuật làm, hoặc dùng công cụ):

```bash
git add .
git commit -m "Cập nhật nội dung"
git push
```

Push xong → vào Cloudflare tab **Deployments** sẽ thấy bản build mới chạy → xanh là xong.

---

## 🔍 PHẦN 4 — Kiểm tra URL đẹp (SEO) đã chạy chưa

Sau khi deploy, mở thử các link sau trên trình duyệt:

| Mở thử | Kết quả đúng |
|--------|--------------|
| `https://hphone.store` | Trang chủ hiện ra |
| `https://hphone.store/iphone-17-pro-max` *(thay bằng slug sản phẩm thật)* | Hiện trang chi tiết sản phẩm, URL **không** đổi thành `.html` |
| `https://hphone.store/blog.html` | Trang blog vẫn vào bình thường |
| Vào trang sản phẩm rồi nhìn thanh địa chỉ | Tự đổi thành dạng `hphone.store/ten-san-pham` (sạch) |

Slug của từng sản phẩm xem trong **trang Admin** (`hphone.store/admin.html`) — mỗi sản
phẩm có ô **slug** và nút **copy link**.

---

## ❓ Sự cố thường gặp

| Hiện tượng | Nguyên nhân & cách xử lý |
|-----------|--------------------------|
| Mở `hphone.store/iphone-17-pro-max` báo **404 / Not Found** | Thư mục `functions/` chưa được deploy. Kiểm tra: trong repo GitHub có thư mục `functions/_middleware.js` không? Nếu chưa, push lại. |
| Link sản phẩm mở ra trang trống / "Sản phẩm không tồn tại" | Slug trên link không khớp slug trong Admin. Vào Admin sửa lại slug cho khớp. |
| Sửa code xong mà web không đổi | Chưa push lên GitHub, hoặc đang xem bản cache. Thử **Ctrl+F5** (tải lại cứng), hoặc kiểm tra tab **Deployments** trên Cloudflare đã build xong chưa. |
| Mở file HTML trên máy (file://) thì URL đẹp không chạy | Bình thường. URL đẹp **chỉ chạy khi đã lên Cloudflare**. |
| Vừa **thêm trang .html mới** mà mở ra bị nhầm sang trang chi tiết sản phẩm | Mở `functions/_middleware.js`, thêm tên trang (bỏ `.html`) vào danh sách `PAGES`. Vd thêm `gioi-thieu.html` thì thêm `'gioi-thieu'` vào danh sách đó. |

---

## 🧠 Vì sao cần thư mục `functions/`? (giải thích đơn giản)

Cloudflare Pages có 2 phần:

1. **Phục vụ file tĩnh** — trả về các trang `.html`, ảnh, css… có sẵn.
2. **Code chạy trên server** (`functions/_middleware.js`) — chạy **trước**, mỗi lần có
   người truy cập:
   - Nếu địa chỉ là một **trang có thật** (vd `/blog.html`) → trả trang đó.
   - Nếu địa chỉ là một **slug sản phẩm** (vd `/iphone-17-pro-max`, không có file thật) →
     nó "đưa" cho trình duyệt trang `chi-tiet-san-pham.html`, rồi trang này tự tra dữ
     liệu sản phẩm từ database (Supabase) để hiển thị.

Nhờ vậy mỗi sản phẩm có một URL riêng, đẹp, **Google index được** → tốt cho SEO.

---

*Cần hỗ trợ thêm? Chụp màn hình bước đang kẹt và gửi cho người phụ trách kỹ thuật.*
