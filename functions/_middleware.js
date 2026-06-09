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
//  - KHÔNG dùng next(new Request(...)) để lấy asset khác — trên Pages nó trả
//    body rỗng. Dùng fetch() tới URL tuyệt đối của file tĩnh (subrequest này
//    quay lại worker, rơi vào nhánh "có đuôi file" → phục vụ tĩnh, không loop).

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

  // 3) Đường dẫn sạch không đuôi → trả nội dung trang chi tiết (URL giữ nguyên)
  const assetResp = await fetch(new URL('/chi-tiet-san-pham.html', url.origin).toString(), {
    headers: { Accept: 'text/html' },
  });
  const html = await assetResp.text();
  return new Response(html, {
    status: 200,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}
