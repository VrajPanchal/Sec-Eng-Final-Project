const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
app.use(express.json());


app.get("/", (req, res) => {
    res.send(`<h2>Victim Site Running</h2>`);
});

// Set a simulated login cookie
app.use((req, res, next) => {
    if (!req.cookies.auth) {
        res.cookie("auth", "user-session-token", { httpOnly: true });
        console.log("Cookie set for session");
    }
    next();
});

// CORS Misconfigured endpoint
app.get("/get-secret", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "null");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.json({ secret: "TopSecret123" });
});

app.listen(3000, () => {
    console.log("🔓 Victim Site running at http://localhost:3000");
});
