export async function onRequest(context) {
  const { request, env, params } = context;
  const slug = params.slug;

  // Bỏ qua các file tĩnh và các trang có sẵn
  const staticPages = [
    'index.html', 'danh-sach-san-pham.html', 'chi-tiet-san-pham.html',
    'gio-hang.html', 'bao-hanh.html', 'lien-he.html',
    'thu-cu-doi-moi.html', 'admin.html',
  ];
  const staticExts = /\.(html|css|js|json|png|jpg|jpeg|webp|svg|ico|woff|woff2|ttf|txt)$/i;

  if (staticPages.includes(slug) || staticExts.test(slug)) {
    // Không xử lý, để Cloudflare Pages tự serve file tĩnh
    return env.ASSETS.fetch(request);
  }

  // Serve chi-tiet-san-pham.html với slug giữ nguyên trong pathname
  // (code JS trong trang tự đọc window.location.pathname để lấy slug)
  const url = new URL(request.url);
  const assetUrl = new URL('/chi-tiet-san-pham.html', url.origin);
  const assetRequest = new Request(assetUrl.toString(), request);
  return env.ASSETS.fetch(assetRequest);
}
