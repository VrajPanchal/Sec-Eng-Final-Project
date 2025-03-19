const express = require("express");

const app = express();

app.use(express.static("public"));

app.listen(3500, () => console.log("Subdomain running on http://localhost:3500"));
