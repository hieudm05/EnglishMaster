const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const webvtt = require("node-webvtt");

const cacheDir = path.join(__dirname, "../cache");

router.get("/", async (req, res) => {
  const videoId = req.query.id;
  if (!videoId) return res.status(400).json({ error: "Missing videoId" });

  const vttPath = path.join(cacheDir, `${videoId}.en.vtt`);
  const jsonPath = path.join(cacheDir, `${videoId}.json`);

  // Nếu JSON đã có → trả về
  if (fs.existsSync(jsonPath)) {
    const cached = fs.readFileSync(jsonPath, "utf8");
    return res.json(JSON.parse(cached));
  }

  // Nếu .vtt chưa có → báo đang chờ xử lý
  if (!fs.existsSync(vttPath)) {
    return res.json({ status: "pending" });
  }

  // Parse .vtt → json → lưu
  const raw = fs.readFileSync(vttPath, "utf8");
  const parsed = webvtt.parse(raw);
  const transcript = parsed.cues.map(cue => cue.text.trim()).filter(Boolean);
  const result = { status: "ready", transcript };

  fs.writeFileSync(jsonPath, JSON.stringify(result));
  res.json(result);
});

module.exports = router;
