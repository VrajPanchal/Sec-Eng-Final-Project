const express = require("express");

const app = express();

app.use(express.static("public"));

app.listen(4000, () => console.log("Malicious site running on http://localhost:4000"));
