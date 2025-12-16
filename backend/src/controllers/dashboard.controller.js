const UserModel = require("../models/user.model");
const ProjectModel = require("../models/project.model");
const TaskModel = require("../models/task.model");

const adminDashboard = async (req, res) => {
  try {
    const totalUsers = await UserModel.countDocuments();
    const totalProjects = await ProjectModel.countDocuments();
    const totalTasks = await TaskModel.countDocuments();

    const taskStats = await TaskModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    return res.status(200).json({
      totalUsers,
      totalProjects,
      totalTasks,
      taskStats
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Failed to load admin dashboard",
      error: error.message
    });
  }
};

const userDashboard = async (req, res) => {
  try {
    const userId = req.userId;

    const totalAssignedTasks = await TaskModel.countDocuments({
      assignedTo: userId
    });

    const taskStats = await TaskModel.aggregate([
      { $match: { assignedTo: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    return res.status(200).json({
      totalAssignedTasks,
      taskStats
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Failed to load user dashboard",
      error: error.message
    });
  }
};


module.exports = { adminDashboard, userDashboard };
