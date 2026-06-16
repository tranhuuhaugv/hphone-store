/* assets/search-autocomplete.js — dropdown gợi ý sản phẩm ở ô tìm kiếm
   Tách ra từ phần trùng lặp giữa các trang có ô tìm sản phẩm
   (index, danh-sach-san-pham, chi-tiet-san-pham, gio-hang, thu-cu-doi-moi,
   lien-he, bao-hanh). KHÔNG include trên blog/bai-viet vì 2 trang đó có
   ô tìm bài viết riêng (không phải tìm sản phẩm). */
(function(){
  var SB='https://pkmigreebudnbfkujplu.supabase.co';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrbWlncmVlYnVkbmJma3VqcGx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNTAyMjYsImV4cCI6MjA5NTYyNjIyNn0.Bb9Y6-FKshYfmxUrEU8GJfJKnnrbJ--vMtXzAwCHFns';
  var inputs=document.querySelectorAll('.nav-search input, .mobile-nav-search input, #mobileSearchInput');
  if(!inputs.length) return;
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}

  Array.prototype.forEach.call(inputs,function(input){
    var ph=(input.getAttribute('placeholder')||'').toLowerCase();
    if(ph.indexOf('bài')>=0) return; // bỏ ô tìm bài viết (blog)

    var box=input.closest('.nav-search')||input.closest('.mobile-nav-search')||input.parentElement;
    if(getComputedStyle(box).position==='static') box.style.position='relative';
    var dd=document.createElement('div'); dd.className='hp-ac'; box.appendChild(dd);
    var timer=null,ctrl=null,active=-1,lastQ='',count=0;

    function close(){dd.classList.remove('open');active=-1;}
    function open(){dd.classList.add('open');}

    function render(list,q){
      count=list.length;
      if(!list.length){dd.innerHTML='<div class="hp-ac-empty">Không tìm thấy &ldquo;'+esc(q)+'&rdquo;</div>';open();return;}
      var html=list.map(function(p,i){
        var img=p.img?'<img class="hp-ac-thumb" src="'+p.img+'" alt="">':'<div class="hp-ac-thumb"></div>';
        var sub=[p.storage,p.condition].filter(Boolean).join(' · ');
        return '<a class="hp-ac-item" href="/'+(p.slug||p.id)+'" data-i="'+i+'">'+img+
          '<div class="hp-ac-info"><div class="hp-ac-name">'+esc(p.name)+'</div>'+
          '<div class="hp-ac-meta">'+esc(String(p.price||''))+(p.price?'₫':'')+
          (sub?' <span class="hp-ac-sub">· '+esc(sub)+'</span>':'')+'</div></div></a>';
      }).join('');
      html+='<a class="hp-ac-foot" href="/danh-sach-san-pham?q='+encodeURIComponent(q)+'">Xem tất cả kết quả &rarr;</a>';
      dd.innerHTML=html;active=-1;open();
    }

    function search(q){
      if(ctrl) ctrl.abort();
      ctrl=new AbortController();
      dd.innerHTML='<div class="hp-ac-loading">Đang tìm…</div>';open();
      var url=SB+'/rest/v1/products?select=id,name,slug,price,storage,condition,img&name=ilike.*'+encodeURIComponent(q)+'*&limit=6&order=id.desc';
      fetch(url,{headers:{apikey:KEY,authorization:'Bearer '+KEY},signal:ctrl.signal})
        .then(function(r){return r.json();})
        .then(function(d){ if(input.value.trim()===q) render(Array.isArray(d)?d:[],q); })
        .catch(function(e){ if(e.name!=='AbortError') dd.innerHTML='<div class="hp-ac-empty">Lỗi tìm kiếm, thử lại.</div>'; });
    }

    input.setAttribute('autocomplete','off');
    input.addEventListener('input',function(){
      var q=input.value.trim();
      if(timer) clearTimeout(timer);
      if(q.length<1){close();lastQ='';return;}
      timer=setTimeout(function(){ if(q!==lastQ){lastQ=q;search(q);} },220);
    });
    input.addEventListener('focus',function(){ if(count && input.value.trim()) open(); });

    // capture phase: chặn handler Enter cũ CHỈ khi đang chọn item / dùng phím mũi tên
    input.addEventListener('keydown',function(e){
      if(!dd.classList.contains('open')) return;
      var links=dd.querySelectorAll('.hp-ac-item');
      if(e.key==='ArrowDown'){e.preventDefault();e.stopImmediatePropagation();active=Math.min(active+1,links.length-1);hl(links);}
      else if(e.key==='ArrowUp'){e.preventDefault();e.stopImmediatePropagation();active=Math.max(active-1,-1);hl(links);}
      else if(e.key==='Enter'){ if(active>=0&&links[active]){e.preventDefault();e.stopImmediatePropagation();window.location.href=links[active].getAttribute('href');} }
      else if(e.key==='Escape'){e.stopImmediatePropagation();close();}
    },true);
    function hl(links){ Array.prototype.forEach.call(links,function(l,i){l.classList.toggle('active',i===active);}); if(active>=0&&links[active]) links[active].scrollIntoView({block:'nearest'}); }

    document.addEventListener('click',function(e){ if(!box.contains(e.target)) close(); });
  });
})();
