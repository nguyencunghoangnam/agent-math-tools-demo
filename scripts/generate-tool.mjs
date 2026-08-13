import fs from "node:fs/promises";

const path = new URL("../data/tools.json", import.meta.url);
const catalog = JSON.parse(await fs.readFile(path, "utf8"));
const candidates = [
  {id:"distance",name:"Khoảng cách hai điểm",category:"HÌNH HỌC",symbol:"↔",description:"Tính khoảng cách giữa hai điểm trong mặt phẳng tọa độ Oxy."},
  {id:"gcd",name:"ƯCLN và BCNN",category:"SỐ HỌC",symbol:"÷",description:"Tìm ước chung lớn nhất và bội chung nhỏ nhất của hai số nguyên."},
  {id:"percent",name:"Máy tính phần trăm",category:"TOÁN ỨNG DỤNG",symbol:"%",description:"Tính nhanh một tỉ lệ phần trăm của giá trị bất kỳ."},
  {id:"slope",name:"Hệ số góc đường thẳng",category:"HÌNH HỌC GIẢI TÍCH",symbol:"↗",description:"Tìm hệ số góc của đường thẳng đi qua hai điểm."}
];
const available = candidates.filter(c => !catalog.tools.some(t => t.id === c.id));
if (!available.length || catalog.demoDate === "13/08/2026") {
  console.log("Demo đã hoàn tất; không còn công cụ cần tạo."); process.exit(0);
}
if (!process.env.OPENAI_API_KEY) throw new Error("Thiếu GitHub Secret OPENAI_API_KEY.");

const response = await fetch("https://api.openai.com/v1/responses", {
  method:"POST",
  headers:{"Authorization":`Bearer ${process.env.OPENAI_API_KEY}`,"Content-Type":"application/json"},
  body:JSON.stringify({
    model:process.env.OPENAI_MODEL || "gpt-5.6-luna",
    input:`Bạn là Agent quản lý thư viện công cụ Toán THCS-THPT. Hãy chọn đúng một công cụ phù hợp nhất để xuất bản tiếp theo từ danh sách: ${JSON.stringify(available)}. Trả về duy nhất JSON hợp lệ dạng {"id":"...","updateTitle":"...","updateNote":"..."}. updateTitle tối đa 55 ký tự; updateNote là một câu tiếng Việt, nói rõ Agent đã tạo và kiểm thử công cụ. Không dùng markdown.`
  })
});
if (!response.ok) throw new Error(`OpenAI API lỗi ${response.status}: ${await response.text()}`);
const body = await response.json();
const raw = body.output_text ?? body.output?.flatMap(x=>x.content||[]).find(x=>x.type==="output_text")?.text;
const choice = JSON.parse(raw.replace(/^```json\s*|\s*```$/g,""));
const selected = available.find(c => c.id === choice.id);
if (!selected) throw new Error("Agent chọn công cụ không thuộc danh sách an toàn.");

const nextDate = catalog.demoDate === "11/08/2026" ? "12/08/2026" : "13/08/2026";
catalog.demoDate = nextDate;
catalog.tools.push(selected);
catalog.updates.unshift({date:nextDate,title:choice.updateTitle,note:choice.updateNote});
await fs.writeFile(path, JSON.stringify(catalog,null,2)+"\n");
console.log(`Agent đã tạo ${selected.name} cho mốc demo ${nextDate}.`);
