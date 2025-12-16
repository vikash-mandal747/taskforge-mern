const express = require("express");
const DBConnection = require("./src/config/mongoDB.config");
const userRouter = require("./src/routes/user.route");
const projectRouter = require("./src/routes/project.routes");
const taskRouter = require("./src/routes/task.routes");
const app = express();
require('dotenv').config();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("hello this is test route")
})
// user routes
app.use("/api/users", userRouter);
//project routes
app.use("/api/projects", projectRouter);
// task routes
app.use("/api/tasks", taskRouter);
DBConnection();
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
})