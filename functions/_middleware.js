// Clean URL routing cho HPHONE trên Cloudflare Pages.
//
// Mục tiêu: hphone.store/iphone-17-pro-max  → trang chi tiết sản phẩm,
// trong khi /index.html, /blog.html, ảnh, css… vẫn được phục vụ bình thường.
//
// Cách hoạt động (chạy trên MỌI request):
//   1) /san-pham/{slug}  (định dạng cũ)  → 301 về /{slug} để gộp SEO.
//   2) Trang gốc "/" và mọi đường dẫn CÓ ĐUÔI FILE (.html, .css, .js, ảnh…)
//      → phục vụ bình thường qua next().
//   3) Đường dẫn KHÔNG có đuôi file (vd /iphone-17-pro-max) → coi là slug sản
//      phẩm → trả nội dung chi-tiet-san-pham.html (giữ nguyên URL). JS trong
//      trang sẽ đọc slug từ pathname và tra Supabase.
//
// LƯU Ý:
//  - KHÔNG dựa vào status 404: project bật SPA fallback nên next() trả
//    index.html kèm 200 cho route lạ. Phải phân loại theo đuôi file.
//  - Cloudflare Pages tự bỏ đuôi .html: /chi-tiet-san-pham.html bị 308 sang
//    /chi-tiet-san-pham. Nên KHÔNG fetch(".html") (gây 308 → loop → error 1000)
//    và KHÔNG fetch() tới chính host (self-loop). Dùng next() với ĐƯỜNG DẪN
//    CANONICAL KHÔNG ĐUÔI "/chi-tiet-san-pham": next() đi thẳng xuống tầng asset,
//    không re-chạy middleware nên không loop.

// Tên các trang THẬT (file .html trong repo, bỏ đuôi). Cloudflare tự bỏ .html
// nên /blog.html → 308 → /blog (không đuôi) — phải nhận diện để KHÔNG nhầm
// thành slug sản phẩm. ⚠️ Thêm trang .html mới thì nhớ thêm tên vào đây.
const PAGES = new Set([
  'index', 'danh-sach-san-pham', 'chi-tiet-san-pham', 'gio-hang',
  'thu-cu-doi-moi', 'blog', 'bai-viet', 'bao-hanh', 'lien-he', 'admin',
]);

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // 1) Redirect định dạng cũ /san-pham/{slug} → /{slug}
  if (path.startsWith('/san-pham/')) {
    const slug = path.slice('/san-pham/'.length).replace(/\/+$/, '');
    if (slug) {
      return Response.redirect(url.origin + '/' + slug, 301);
    }
  }

  // 1b) Bài viết blog clean URL: /blog/{slug} → phục vụ trang bai-viet.
  //     (/blog không có slug rơi xuống nhánh PAGES bên dưới → blog.html danh sách)
  if (path.startsWith('/blog/')) {
    const slug = path.slice('/blog/'.length).replace(/\/+$/, '');
    if (slug) {
      return next(new Request(new URL('/bai-viet', url.origin), request));
    }
  }

  const seg = path.replace(/^\/+/, '').replace(/\/+$/, '');

  // 2) Trang gốc, file có đuôi (.html, .css, .js, .png…), hoặc trang thật đã biết
  //    (vd /blog do Pages bỏ .html) → phục vụ bình thường
  if (seg === '' || seg.includes('.') || PAGES.has(seg)) {
    return next();
  }

  // 3) Đường dẫn sạch không đuôi → phục vụ asset trang chi tiết (URL giữ nguyên).
  //    Dùng đường dẫn canonical KHÔNG đuôi để tránh 308 .html → loop.
  return next(new Request(new URL('/chi-tiet-san-pham', url.origin), request));
}
