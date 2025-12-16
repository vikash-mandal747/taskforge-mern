const express = require("express");
const taskRouter = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { createTask, getTasks, updateTask, deleteTask } = require("../controllers/task.controller");

taskRouter.post(
    "/",
    authMiddleware(["admin", "user"]),
    createTask
);

taskRouter.get(
  "/",
  authMiddleware(["admin", "user"]),
  getTasks
);

taskRouter.patch(
  "/:taskId",
  authMiddleware(["admin", "user"]),
  updateTask
);

taskRouter.delete(
  "/:taskId",
  authMiddleware(["admin"]), // 🔐 ADMIN ONLY
  deleteTask
);

module.exports = taskRouter;
