const API_STOCKS = "https://gadgets.dantri.com.vn/api/finance/stocks";

function pick(o,keys){for(const k of keys){if(o[k]!=null&&o[k]!=="")return o[k];}}
function any(o,re){const k=Object.keys(o).find(x=>re.test(x)); return k?o[k]:undefined;}
function normRow(r){
  const code = pick(r,["Code","code","Symbol","symbol","Ticker","ticker"]) ?? any(r,/code|symbol|ticker/i) ?? "—";
  const price= pick(r,["Price","price","Close","close","lastPrice","LastPrice"]) ?? any(r,/price|close/i) ?? "—";
  const upd  = pick(r,["sourceUpdatedAt","SourceUpdatedAt","UpdatedAt","updatedAt","time","Time"]) ?? any(r,/update|time|date/i) ?? "";
  return {code,price,upd};
}

async function loadStocks(){
  const tb = document.getElementById("stkBody");
  const err= document.getElementById("stkErr");
  try{
    err.textContent="";
    const r = await fetch(API_STOCKS, {cache:"no-store"});
    if(!r.ok) throw new Error("HTTP "+r.status);
    const data = await r.json();            // mảng các mã
    const rows = Array.isArray(data)?data:(data?.data||[]);
    tb.innerHTML = (rows||[]).slice(0,20).map((x,i)=>{
      const n = normRow(x);
      return `<tr><td>${i+1}</td><td>${n.code}</td><td>${n.price}</td><td>${n.upd}</td></tr>`;
    }).join("");
  }catch(e){ err.textContent="Không lấy được dữ liệu cổ phiếu."; console.error(e); }
}
document.addEventListener("DOMContentLoaded", loadStocks);
