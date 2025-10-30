const BOOKS_XML = "https://tranduythanh.com/datasets/books.xml";

// parse XML -> rows
function parseBooks(xml){
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  const list = [...doc.querySelectorAll("book")].map((b,i)=>({
    id: b.getAttribute("id") || i+1,
    author: b.querySelector("author")?.textContent || "",
    title: b.querySelector("title")?.textContent || "",
    genre: b.querySelector("genre")?.textContent || "",
    price: b.querySelector("price")?.textContent || "",
    publish_date: b.querySelector("publish_date")?.textContent || "",
    description: b.querySelector("description")?.textContent || "",
  }));
  return list;
}

async function loadBooks(){
  const box = document.getElementById("booksBox");
  const err = document.getElementById("booksErr");
  try{
    err.textContent = "";
    const r = await fetch(BOOKS_XML, {cache:"no-store"});
    if(!r.ok) throw new Error("HTTP "+r.status);
    const xml = await r.text();
    const rows = parseBooks(xml);
    box.innerHTML = `
      <table>
        <thead><tr>
          <th>#</th><th>Title</th><th>Author</th><th>Genre</th>
          <th>Price</th><th>Publish date</th>
        </tr></thead>
        <tbody>
          ${rows.map((b,i)=>`
            <tr>
              <td>${i+1}</td>
              <td>${b.title}</td>
              <td>${b.author}</td>
              <td>${b.genre}</td>
              <td>${b.price}</td>
              <td>${b.publish_date}</td>
            </tr>`).join("")}
        </tbody>
      </table>`;
  }catch(e){
    err.textContent = "Không đọc được XML (CORS/mạng).";
    console.error(e);
  }
}
document.addEventListener("DOMContentLoaded", loadBooks);
