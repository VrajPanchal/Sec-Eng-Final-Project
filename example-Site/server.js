const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());

//VULNERABLE CORS POLICY
app.use(cors({
    origin: (origin, callback) => {
        console.log("Received request from origin:", origin || "No Origin (Direct Access)");

        if (!origin) {
            // Direct browser visits (e.g., manually entering URL) will have no Origin
            return callback(null, true); 
        }

        if (origin.startsWith("http://localhost")) {
            return callback(null, true);  //Allow trusted subdomains
        }


        callback(new Error("Not allowed by CORS"));  //Block everything else
    },
    credentials: true
}));

// Simulated user session (insecure example)
app.use((req, res, next) => {
    if (!req.cookies.auth) {
        res.cookie("auth", "user-session-token", { httpOnly: true, domain: "victim.com", SameSite: "None", secure: false });
    }
    next();
});

app.get("/", (req, res) => {
    res.send("<h1>Welcome to Victim Site</h1><p>This is a vulnerable site.</p>");
});
// Vulnerable endpoint exposing sensitive data
app.get("/sensitive-data", (req, res) => {
    if (req.cookies.auth) {
        return res.json({ secret: "Credentials: user12345" });
    }
    res.status(403).json({ error: "Unauthorized" });
});

// Home page
app.get("/sensitive-data", (req, res) => {
    if (req.cookies.auth) {
        return res.json({ secret: "User password: 123456" });
    }
    res.status(403).json({ error: "Unauthorized" });
});

app.listen(3000, () => console.log("Victim site running on http://localhost:3000"));
