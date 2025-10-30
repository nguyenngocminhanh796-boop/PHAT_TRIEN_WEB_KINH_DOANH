const state = { customers: [] };

function renderCustomers(){
  const tb = document.getElementById("custBody");
  tb.innerHTML = state.customers.map((c,i)=>{
    const bg = (c.age>=18 && c.age<=35) ? "style='background:yellow;'" : "style='background:magenta;'";
    return `<tr ${bg}>
      <td>${i+1}</td><td>${c.id}</td><td>${c.name}</td><td>${c.phone}</td><td>${c.email}</td><td>${c.age}</td>
      <td><button class="btn" onclick="removeCustomer(${i})">Xoá</button></td>
    </tr>`;
  }).join("");
}
function removeCustomer(i){ state.customers.splice(i,1); renderCustomers(); }

document.addEventListener("DOMContentLoaded", ()=>{
  const f = document.getElementById("custForm");
  f.addEventListener("submit",(e)=>{
    e.preventDefault();
    const c = {
      id: f.custId.value.trim(),
      name: f.custName.value.trim(),
      phone: f.custPhone.value.trim(),
      email: f.custEmail.value.trim(),
      age: Number(f.custAge.value)
    };
    if(!c.id || !c.name) return alert("Nhập ID và Họ tên");
    state.customers.push(c);
    renderCustomers(); f.reset(); f.custId.focus();
  });
});
