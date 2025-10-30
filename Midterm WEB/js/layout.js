// /js/layout.js
const STUDENT = {
  id: "SV001",
  name: "Vu Thi Thanh",
  class: "TH1",
  avatar: "../images/avatar.jpg",
};

const MENUS = [
  { id:"home", text:"Trang chủ", href:"home.html" },
  { id:"study", text:"Góc học tập", children:[
    { id:"htmljs", text:"HTML & Javascript", href:"html-javascript.html" },
    { id:"style", text:"Style", href:"style.html" },
    { id:"xml", text:"XML & DOM", href:"xml-dom.html" },
    { id:"json", text:"JSON", href:"json.html" },
  ]},
  { id:"news", text:"Tin tức", children:[
    { id:"edu", text:"Tin tức giáo dục", href:"edu-news.html" },
    { id:"forecast", text:"Dự báo", href:"forecast.html" },
  ]},
  { id:"register", text:"Đăng ký", href:"register.html" },
];

function navHTML(activeId){
  const ul = MENUS.map(m => {
    const isActive = m.id === activeId;
    const isParentActive = m.children && m.children.some(ch => ch.id === activeId);
    const topLink = `<a href="${m.href || '#'}" class="${isActive?'active':''} ${isParentActive?'active-parent':''}">${m.text}</a>`;
    if (!m.children){
      return `<li>${topLink}</li>`;
    }
    const sub = m.children.map(ch => {
      const cls = ch.id===activeId ? 'active' : '';
      return `<a class="${cls}" href="${ch.href}">${ch.text}</a>`;
    }).join("");
    return `<li>${topLink}<div class="sub">${sub}</div></li>`;
  }).join("");
  return `<nav class="nav"><ul>${ul}</ul></nav>`;
}

function asideHTML(){
  return `
    <div class="moving">
      <img alt="avatar" src="${STUDENT.avatar}">
      <div>
        <div class="name">${STUDENT.name}</div>
        <div class="meta">${STUDENT.id} • Lớp ${STUDENT.class}</div>
      </div>
    </div>
  `;
}

/* ===== NEW: tính chiều cao cho aside ===== */
function sizeAside(){
  const aside = document.querySelector("aside");
  if (!aside) return;
  const cs = getComputedStyle(aside);
  const top = parseFloat(cs.top) || 0;     // sticky top thực tế
  const bottomPad = 16;                    // padding của .main (nếu bạn đổi, sửa số này)
  const h = window.innerHeight - top - bottomPad;
  aside.style.minHeight = h + "px";
  aside.style.height = h + "px";
}

/* ===== CHO THẺ .moving CHẠY HẾT CHIỀU CAO ASIDE ===== */
let marqueeRAF = null;
function startMarquee(){
  const aside = document.querySelector("aside");
  const card  = aside?.querySelector(".moving");
  if (!aside || !card) return;

  sizeAside();                 // đảm bảo aside đủ cao trước khi chạy
  aside.style.overflow = "hidden";

  // tắt hiệu ứng nếu người dùng bật Reduce Motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  cancelAnimationFrame(marqueeRAF);
  let y = -card.offsetHeight;  // bắt đầu từ trên khung
  let prev = 0;
  const SPEED = 48;            // px/giây

  function loop(ts){
    if (!prev) prev = ts;
    const dt = (ts - prev) / 1000;
    prev = ts;

    y += SPEED * dt;

    const limit = aside.clientHeight;              // chạy hết chiều cao aside
    if (y > limit) y = -card.offsetHeight;        // ra khỏi đáy thì quay lại trên

    card.style.transform = `translateY(${Math.round(y)}px)`;
    marqueeRAF = requestAnimationFrame(loop);
  }
  marqueeRAF = requestAnimationFrame(loop);

  // cập nhật khi đổi kích thước cửa sổ
  window.addEventListener("resize", ()=>{
    sizeAside();
    if (y > aside.clientHeight) y = -card.offsetHeight;
  });

  // tiết kiệm pin: dừng khi tab ẩn
  document.addEventListener("visibilitychange", ()=>{
    if (document.hidden) cancelAnimationFrame(marqueeRAF);
    else marqueeRAF = requestAnimationFrame(loop);
  });
}

function footerHTML(){
  const now = new Date().toLocaleString("vi-VN");
  return `<div class="container"><p class="footer-text">Bài làm của ${STUDENT.name} — cập nhật ${now}</p></div>`;
}

function injectLayout(activeId){
  const header = document.querySelector("header");
  const aside = document.querySelector("aside");
  const footer = document.querySelector("footer");
  if (header) header.innerHTML = `<div class="container">${navHTML(activeId)}</div>`;
  if (aside) { aside.innerHTML = asideHTML(); startMarquee(); }  // chạy ngay sau khi render aside
  if (footer) footer.innerHTML = footerHTML();
}

document.addEventListener("DOMContentLoaded", ()=>{
  const active = document.body.dataset.active;
  if (active) injectLayout(active);
});
