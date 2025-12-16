const express = require("express");
const dashboardRouter = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { adminDashboard } = require("../controllers/dashboard.controller");

dashboardRouter.get(
  "/admin",
  authMiddleware(["admin"]),
  adminDashboard
);

module.exports = dashboardRouter;
