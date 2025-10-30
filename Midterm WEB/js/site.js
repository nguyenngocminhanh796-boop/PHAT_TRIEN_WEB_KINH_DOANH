// footer time (Part E): “Designed by Student XYZ, today is ABC”
function startClock(studentName="(điền tên ở Home)"){
  const el = document.getElementById("footbar");
  function tick(){
    const now = new Date().toLocaleString("vi-VN");
    if(el) el.textContent = `Designed by ${studentName}, today is ${now}`;
  }
  tick(); setInterval(tick, 1000);
}

// aside marquee (Part D): loop top-down
function startMarquee(){
  const box = document.getElementById("marqueeBox");
  const m = document.getElementById("marquee");
  if(!box || !m) return;
  let y = -m.offsetHeight, last = 0, speed = 50; // px/s
  function loop(t){
    if(!last) last = t;
    const dt = (t - last)/1000; last = t;
    y += speed*dt;
    const H = box.clientHeight;
    if(y > H) y = -m.offsetHeight;    // đi hết chiều cao -> quay lại
    m.style.transform = `translateY(${Math.round(y)}px)`;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}
