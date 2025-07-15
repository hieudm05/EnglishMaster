const express = require("express");
const router = express.Router();
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const cacheDir = path.join(__dirname, "../cache");
if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

router.post("/", (req, res) => {
  const videoId = req.query.id;
  if (!videoId) return res.status(400).json({ error: "Missing videoId" });

  const vttPath = path.join(cacheDir, `${videoId}.en.vtt`);
  const jsonPath = path.join(cacheDir, `${videoId}.json`);

  // Nếu đã có file → không cần tải lại
  if (fs.existsSync(jsonPath)) {
    return res.json({ status: "ready" });
  }

  const cmd = `yt-dlp --write-auto-sub --sub-lang en --skip-download -o "./cache/${videoId}.%(ext)s" https://www.youtube.com/watch?v=${videoId}`;

  // Chạy ngầm không đợi kết quả
  exec(cmd, (err) => {
    if (err) {
      console.error("❌ yt-dlp error:", err.message);
      return;
    }
    console.log("✅ yt-dlp finished:", videoId);
  });

  return res.json({ status: "started" });
});

module.exports = router;
