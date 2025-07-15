const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const prepareRoute = require("./routes/prepare");
const transcriptRoute = require("./routes/transcript");


app.use("/api/transcript/prepare", prepareRoute);
app.use("/api/transcript", transcriptRoute);

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server listening on http://localhost:${PORT}`));
