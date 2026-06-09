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
// LƯU Ý QUAN TRỌNG: KHÔNG dựa vào status 404 để phát hiện "không có file".
// Project bật SPA fallback nên next() trả index.html kèm status 200 cho route
// lạ — nếu check 404 sẽ không bao giờ đúng. Vì vậy phân loại theo đuôi file.

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

  const seg = path.replace(/^\/+/, '').replace(/\/+$/, '');

  // 2) Trang gốc hoặc file có đuôi (.html, .css, .js, .png…) → phục vụ bình thường
  if (seg === '' || seg.includes('.')) {
    return next();
  }

  // 3) Đường dẫn sạch không đuôi → trang chi tiết sản phẩm (giữ nguyên URL trên address bar)
  const detail = await next(
    new Request(new URL('/chi-tiet-san-pham.html', url.origin), request)
  );
  return new Response(detail.body, {
    status: 200,
    headers: detail.headers,
  });
}
