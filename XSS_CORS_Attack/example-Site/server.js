const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(express.static("public"));

//VULNERABLE CORS POLICY
app.use(cors({
    origin: (origin, callback) => {
        console.log("Received request from origin:", origin || "No Origin");

        if (!origin) {
            // Direct browser visits
            return callback(null, true); 
        }

        if (origin.startsWith("http://localhost")) {
            return callback(null, true);  //Allow trusted subdomains
        }


        callback(new Error("Not allowed by CORS"));  //Block everything else
    },
    credentials: true
}));

app.use((req, res, next) => {
    console.log("Incoming Request:", req.method, req.url);
    console.log("Body:", req.body);
    console.log("Cookies:", req.cookies);
    next();
});

app.post("/set-secret", (req, res) => {
    const secret = req.body.secret;
    if (!secret) return res.status(400).json({ error: "No secret provided" });

    res.cookie("secret", secret, { httpOnly: false, domain: "localhost", SameSite: "None", secure: false });
    res.json({ message: "Secret stored successfully" });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
// Vulnerable endpoint exposing sensitive data
app.get("/get-secret", (req, res) => {
    if (req.cookies.secret) {
        return res.json({ secret: req.cookies.secret });
    }
    res.status(403).json({ error: "No secret found" });
});

app.listen(3000, () => console.log("Victim site running on http://localhost:3000"));
