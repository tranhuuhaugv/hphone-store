// functions/[[path]].js
// Cloudflare Pages Function – rewrite clean product URLs
// Ví dụ: hphone.store/iphone-17-pro-max → chi-tiet-san-pham.html?slug=iphone-17-pro-max

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  // 1. Bỏ qua file tĩnh (html, css, js, ảnh, font...)
  const staticExts = /\.(html|css|js|mjs|json|png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|eot|map)$/i;
  if (staticExts.test(pathname)) return context.next();

  // 2. Bỏ qua các route đã có trang riêng
  const knownRoutes = [
    '/',
    '/admin',
    '/gio-hang',
    '/danh-sach-san-pham',
    '/lien-he',
    '/bao-hanh',
    '/thu-cu-doi-moi',
  ];
  if (knownRoutes.some(r => pathname === r || pathname.startsWith(r + '/'))) {
    return context.next();
  }

  // 3. Bỏ qua Cloudflare internal paths
  if (pathname.startsWith('/_') || pathname.startsWith('/cdn-cgi/')) {
    return context.next();
  }

  // 4. Lấy slug từ pathname (segment đầu tiên)
  const slug = pathname.replace(/^\//, '').split('/')[0];
  if (!slug) return context.next();

  // 5. Rewrite nội bộ → chi-tiet-san-pham.html?slug=<slug>
  const rewriteUrl = new URL(context.request.url);
  rewriteUrl.pathname = '/chi-tiet-san-pham.html';
  rewriteUrl.searchParams.set('slug', slug);

  return fetch(rewriteUrl.toString(), context.request);
}
