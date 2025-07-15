const fs = require("fs");
const path = require("path");

const videoId = "36GT2zI8lVA"; // thay ID video muốn test
const vttPath = path.join(__dirname, "cache", `${videoId}.en.vtt`);

if (!fs.existsSync(vttPath)) {
  console.error("❌ File .vtt không tồn tại.");
  process.exit(1);
}

const raw = fs.readFileSync(vttPath, "utf8");

const blocks = raw.split("\n\n").slice(2); // bỏ dòng WEBVTT + metadata
const transcript = [];

for (const block of blocks) {
  const lines = block.split("\n").filter(Boolean);
  if (lines.length < 2) continue;

  const timeLine = lines[0];
  const textLines = lines.slice(1);
  const [start, rest] = timeLine.split(" --> ");
  const end = rest.split(" ")[0];

  const rawText = textLines.join(" ");
  const cleanedText = rawText
    .replace(/<\d{2}:\d{2}:\d{2}\.\d{3}><c>/g, "")
    .replace(/<\/c>/g, "")
    .trim();

  transcript.push({ start, end, text: cleanedText });
}

console.log("✅ Phụ đề đã parse:");
console.log(transcript.slice(0, 5));
