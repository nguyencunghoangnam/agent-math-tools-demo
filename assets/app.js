let catalog = { tools: [], updates: [] };

const fmt = n => Number.isInteger(n) ? String(n) : Number(n.toFixed(6)).toString();

const calculators = {
  quadratic(root) {
    root.innerHTML = fields(["a", "b", "c"]);
    bind(root, values => {
      const [a,b,c] = values;
      if (a === 0) throw new Error("Hệ số a phải khác 0.");
      const d=b*b-4*a*c;
      if(d<0) return `Δ = ${fmt(d)} < 0 nên phương trình không có nghiệm thực.`;
      if(d===0) return `Δ = 0. Phương trình có nghiệm kép <strong>x = ${fmt(-b/(2*a))}</strong>.`;
      return `Δ = ${fmt(d)}. Hai nghiệm là <strong>x₁ = ${fmt((-b+Math.sqrt(d))/(2*a))}</strong> và <strong>x₂ = ${fmt((-b-Math.sqrt(d))/(2*a))}</strong>.`;
    });
  },
  distance(root) {
    root.innerHTML = fields(["x₁","y₁","x₂","y₂"]);
    bind(root, ([x1,y1,x2,y2]) => `Khoảng cách là <strong>d = ${fmt(Math.hypot(x2-x1,y2-y1))}</strong>.`);
  },
  gcd(root) {
    root.innerHTML = fields(["Số a","Số b"]);
    bind(root, ([a,b]) => { a=Math.abs(Math.trunc(a));b=Math.abs(Math.trunc(b)); const aa=a,bb=b; while(b)[a,b]=[b,a%b]; const g=a; return `ƯCLN = <strong>${g}</strong> và BCNN = <strong>${g ? fmt(aa*bb/g) : 0}</strong>.`; });
  },
  percent(root) {
    root.innerHTML = fields(["Giá trị","Phần trăm"]);
    bind(root, ([v,p]) => `${fmt(p)}% của ${fmt(v)} là <strong>${fmt(v*p/100)}</strong>.`);
  },
  slope(root) {
    root.innerHTML = fields(["x₁","y₁","x₂","y₂"]);
    bind(root, ([x1,y1,x2,y2]) => { if(x1===x2) throw new Error("Đường thẳng đứng nên hệ số góc không xác định."); return `Hệ số góc là <strong>m = ${fmt((y2-y1)/(x2-x1))}</strong>.`; });
  }
};

function fields(names){return `<div class="fields">${names.map((n,i)=>`<label>${n}<input type="number" step="any" data-i="${i}" value="${i===0?1:0}"></label>`).join("")}</div><button class="calculate">Tính kết quả</button><div class="result"></div>`}
function bind(root, calculate){root.querySelector(".calculate").onclick=()=>{const out=root.querySelector(".result");try{const vals=[...root.querySelectorAll("input")].map(x=>Number(x.value));if(vals.some(Number.isNaN))throw new Error("Vui lòng nhập đủ dữ liệu.");out.innerHTML=calculate(vals);out.classList.add("show")}catch(e){out.textContent=e.message;out.classList.add("show")}}}

function openTool(tool){
  const dialog=document.querySelector("#tool-dialog"), content=document.querySelector("#tool-content");
  content.innerHTML=`<div class="calculator"><span class="kicker">${tool.category}</span><h2>${tool.name}</h2><p>${tool.description}</p><div id="calculator-root"></div></div>`;
  calculators[tool.id](content.querySelector("#calculator-root")); dialog.showModal();
}

async function init(){
  const res=await fetch(`data/tools.json?v=${Date.now()}`); catalog=await res.json();
  document.querySelector("#tool-count").textContent=String(catalog.tools.length).padStart(2,"0");
  document.querySelector("#demo-date").textContent=catalog.demoDate;
  document.querySelector("#tools-grid").innerHTML=catalog.tools.map(t=>`<article class="tool-card"><div class="tool-icon">${t.symbol}</div><span class="tag">${t.category}</span><h3>${t.name}</h3><p>${t.description}</p><button data-tool="${t.id}">Mở công cụ <span>→</span></button></article>`).join("");
  document.querySelector("#timeline").innerHTML=catalog.updates.map(u=>`<div class="timeline-item"><time>DEMO · ${u.date}</time><strong>${u.title}</strong><p>${u.note}</p></div>`).join("");
  document.querySelectorAll("[data-tool]").forEach(b=>b.onclick=()=>openTool(catalog.tools.find(t=>t.id===b.dataset.tool)));
}
document.querySelector(".close").onclick=()=>document.querySelector("#tool-dialog").close();
document.querySelector("#tool-dialog").onclick=e=>{if(e.target.id==="tool-dialog")e.target.close()};
init().catch(()=>document.querySelector("#tools-grid").textContent="Không thể tải danh sách công cụ.");
