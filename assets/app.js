/* assets/app.js — JS dùng chung cho toàn site HPHONE
   Tách logic mobile drawer (menu hamburger) khỏi từng trang vì hành vi
   giống nhau ở mọi trang, chỉ khác id ô tìm kiếm (mobileSearchInput hoặc
   drawerSearchInput) tuỳ trang dùng biến thể nào. */

(function(){
  var drawer = document.getElementById('mobileDrawer');
  var btn    = document.getElementById('navHamburger');
  var bg     = document.getElementById('mobileDrawerBg');
  var closeBtn = document.getElementById('mobileDrawerClose');
  var search = drawer.querySelector('#mobileSearchInput, #drawerSearchInput');
  if(!drawer||!btn) return;
  function open(){
    drawer.classList.add('open');
    btn.classList.add('open');
    document.body.classList.add('drawer-open');
    if(search) setTimeout(function(){ search.focus(); }, 320);
  }
  function close(){
    drawer.classList.remove('open');
    btn.classList.remove('open');
    document.body.classList.remove('drawer-open');
  }
  btn.addEventListener('click', function(){ drawer.classList.contains('open') ? close() : open(); });
  if(bg) bg.addEventListener('click', close);
  if(closeBtn) closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') close(); });
  if(search){
    search.addEventListener('keydown', function(e){
      if(e.key==='Enter'){
        var q = search.value.trim();
        if(q) window.location.href = '/danh-sach-san-pham.html?q='+encodeURIComponent(q);
      }
    });
  }
})();
