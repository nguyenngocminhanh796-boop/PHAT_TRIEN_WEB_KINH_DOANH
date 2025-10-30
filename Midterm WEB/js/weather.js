const provinces = ["Hà Nội","Hồ Chí Minh","Đà Nẵng","Hải Phòng","Cần Thơ","Đà Lạt","Nha Trang","Huế","Vinh","Quảng Ninh"];
async function geocodeVN(name){
  const u = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=vi&country=VN`;
  const r = await fetch(u); if(!r.ok) throw new Error("Geo "+r.status); const j = await r.json();
  if(!j.results?.length) throw new Error("Không tìm thấy"); return j.results[0];
}
async function getTodayMinMax(lat,lon){
  const p = new URLSearchParams({latitude:lat,longitude:lon,timezone:"auto",daily:"temperature_2m_max,temperature_2m_min"});
  const r = await fetch(`https://api.open-meteo.com/v1/forecast?${p}`); const j = await r.json();
  return {min:j.daily.temperature_2m_min[0], max:j.daily.temperature_2m_max[0]};
}
async function loadWeather(){
  const tb = document.getElementById("wBody"); tb.innerHTML = "";
  for(const name of provinces){
    try{
      const g = await geocodeVN(name); const v = await getTodayMinMax(g.latitude,g.longitude);
      tb.innerHTML += `<tr><td>${name}</td><td>${v.min}°C</td><td>${v.max}°C</td></tr>`;
    }catch(_){ tb.innerHTML += `<tr><td>${name}</td><td colspan="2">N/A</td></tr>`; }
  }
}
document.addEventListener("DOMContentLoaded", loadWeather);
