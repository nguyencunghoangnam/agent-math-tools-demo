import fs from "node:fs/promises";
const data=JSON.parse(await fs.readFile(new URL("../data/tools.json",import.meta.url),"utf8"));
const allowed=new Set(["quadratic","distance","gcd","percent","slope"]);
if(!Array.isArray(data.tools)||!data.tools.length)throw new Error("Danh sách công cụ trống.");
if(new Set(data.tools.map(x=>x.id)).size!==data.tools.length)throw new Error("Trùng công cụ.");
if(data.tools.some(x=>!allowed.has(x.id)||!x.name||!x.description))throw new Error("Dữ liệu công cụ không hợp lệ.");
if(!/^1[1-3]\/08\/2026$/.test(data.demoDate))throw new Error("Sai ngày demo.");
console.log(`Kiểm định đạt: ${data.tools.length} công cụ, cập nhật ${data.demoDate}.`);
