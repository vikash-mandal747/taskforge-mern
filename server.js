const express = require("express");
const DBConnection = require("./src/config/mongoDB.config");
const app = express();
require('dotenv').config();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("hello this is test route")
})
DBConnection();
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
})