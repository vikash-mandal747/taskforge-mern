const express = require("express");
const projectRouter = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const {
    createProject,
    getAllProjects,
    assignUsersToProject
} = require("../controllers/project.controller");

// Admin only routes
projectRouter.post("/", authMiddleware(["admin"]), createProject);
projectRouter.get("/", authMiddleware(["admin"]), getAllProjects);
projectRouter.patch(
    "/:projectId/assign",
    authMiddleware(["admin"]),
    assignUsersToProject
);

module.exports = projectRouter;
