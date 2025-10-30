const RSS = "https://vnexpress.net/rss/giao-duc.rss";
const CORS = (u)=>`https://api.allorigins.win/get?url=${encodeURIComponent(u)}`;

function strip(html){ const d=document.createElement("div"); d.innerHTML=html||""; return (d.textContent||"").trim(); }

async function loadRSS(){
  const grid = document.getElementById("rssList");
  const err  = document.getElementById("rssErr");
  try{
    err.textContent="";
    const r = await fetch(CORS(RSS));
    if(!r.ok) throw new Error("HTTP "+r.status);
    const j = await r.json();
    const doc = new DOMParser().parseFromString(j.contents,"text/xml");
    const items = [...doc.querySelectorAll("item")].slice(0,10).map(it=>({
      title: it.querySelector("title")?.textContent||"",
      link : it.querySelector("link")?.textContent||"#",
      desc : strip(it.querySelector("description")?.textContent||"")
    }));
    grid.innerHTML = items.map(a=>`
      <div class="card">
        <h4 style="margin:0 0 6px"><a href="${a.link}" target="_blank" rel="noopener">${a.title}</a></h4>
        <div style="color:#374151;font-size:14px">${a.desc}</div>
      </div>`).join("");
  }catch(e){ err.textContent="Không đọc được RSS (CORS/mạng)."; console.error(e); }
}
document.addEventListener("DOMContentLoaded", loadRSS);
