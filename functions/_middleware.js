// Clean URL routing cho HPHONE trên Cloudflare Pages.
//
// Mục tiêu: hphone.store/iphone-17-pro-max  → trang chi tiết sản phẩm,
// trong khi /index.html, /blog.html, ảnh, css… vẫn được phục vụ bình thường.
//
// Cách hoạt động (chạy trên MỌI request):
//   1) /san-pham/{slug}  (định dạng cũ)  → 301 về /{slug} để gộp SEO.
//   2) Thử phục vụ file tĩnh / route mặc định trước (next()).
//   3) Nếu 404 và path trông như slug sản phẩm (không có đuôi file) → trả nội
//      dung chi-tiet-san-pham.html (HTTP 200). JS trong trang sẽ đọc slug từ
//      pathname và tra Supabase.
//   4) Còn lại: giữ nguyên 404.
//
// Lưu ý: trên Cloudflare Pages, rule trong _redirects "luôn được áp dụng dù file
// có tồn tại hay không" — nên KHÔNG dùng được catch-all /* ở _redirects (sẽ nuốt
// cả trang thật). Vì vậy phải route bằng Pages Function như dưới đây.

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

  // 2) Ưu tiên file tĩnh / route mặc định
  const response = await next();
  if (response.status !== 404) return response;

  // 3) 404 + path không có đuôi file → coi như slug sản phẩm
  const seg = path.replace(/^\/+/, '').replace(/\/+$/, '');
  if (seg && !seg.includes('.')) {
    const detail = await next(
      new Request(new URL('/chi-tiet-san-pham.html', url.origin), request)
    );
    // Trả 200 để không bị đánh dấu là trang lỗi
    return new Response(detail.body, {
      status: 200,
      headers: detail.headers,
    });
  }

  // 4) Giữ nguyên 404 cho file không tồn tại (vd /thieu-anh.png)
  return response;
}
