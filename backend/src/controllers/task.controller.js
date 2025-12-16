const TaskModel = require("../models/task.model");
const ProjectModel = require("../models/project.model");

const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo } = req.body;
    const loggedInUserId = req.userId;
    const role = req.role;

    // 1️⃣ Validate required fields
    if (!title || !description || !projectId || !assignedTo) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // 2️⃣ Check project exists
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // 3️⃣ Check project membership
    const isMember =
      project.createdBy.toString() === loggedInUserId ||
      project.members.includes(loggedInUserId);

    if (!isMember && role !== "admin") {
      return res.status(403).json({ msg: "You are not a member of this project" });
    }

    // 4️⃣ Role-based assignment rules
    if (role === "user" && assignedTo !== loggedInUserId) {
      return res.status(403).json({
        msg: "Users can assign tasks only to themselves"
      });
    }

    // 5️⃣ Admin must assign only project members
    if (
      role === "admin" &&
      !project.members.includes(assignedTo) &&
      project.createdBy.toString() !== assignedTo
    ) {
      return res.status(400).json({
        msg: "Assigned user is not part of this project"
      });
    }

    // 6️⃣ Create task
    const task = await TaskModel.create({
      title,
      description,
      projectId,
      assignedTo,
      createdBy: loggedInUserId
    });

    return res.status(201).json({
      msg: "Task created successfully",
      task
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Failed to create task",
      error: error.message
    });
  }
};


const getTasks = async (req, res) => {
  try {
    const { status, projectId, search } = req.query;
    const { userId, role } = req;

    let filter = {};

    // 🔐 Role-based filtering
    if (role === "user") {
      filter.assignedTo = userId;
    }

    // 🔍 Optional filters
    if (status) {
      filter.status = status;
    }

    if (projectId) {
      filter.projectId = projectId;
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const tasks = await TaskModel.find(filter)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("projectId", "title")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: tasks.length,
      tasks
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Failed to fetch tasks",
      error: error.message
    });
  }
};



const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, status } = req.body;
    const { userId, role } = req;

    // 1️⃣ Find task
    const task = await TaskModel.findById(taskId);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // 2️⃣ Permission check
    if (role === "user" && task.assignedTo.toString() !== userId) {
      return res.status(403).json({
        msg: "You are not allowed to update this task"
      });
    }

    // 3️⃣ Allowed updates only
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    await task.save();

    return res.status(200).json({
      msg: "Task updated successfully",
      task
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Failed to update task",
      error: error.message
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await TaskModel.findById(taskId);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    await task.deleteOne();

    return res.status(200).json({
      msg: "Task deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Failed to delete task",
      error: error.message
    });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
