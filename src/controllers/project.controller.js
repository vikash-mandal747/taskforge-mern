const ProjectModel = require("../models/project.model");

/**
 * ADMIN ONLY
 * Create a new project
 */
const createProject = async (req, res) => {
  try {
    const { title, description, members } = req.body;

    // basic validation
    if (!title || !description) {
      return res.status(400).json({ msg: "Title and description are required" });
    }

    const project = await ProjectModel.create({
      title,
      description,
      createdBy: req.userId, // coming from auth middleware
      members
    });

    return res.status(201).json({
      msg: "Project created successfully",
      project
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Failed to create project",
      error: error.message
    });
  }
};

/**
 * ADMIN ONLY
 * Get all projects
 */
const getAllProjects = async (req, res) => {
  try {
    const projects = await ProjectModel.find()
      .populate("createdBy", "name email role")
      .populate("members", "name email role");

    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json({
      msg: "Failed to fetch projects",
      error: error.message
    });
  }
};

/**
 * ADMIN ONLY
 * Assign users to a project
 */
const assignUsersToProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { members } = req.body;

    if (!members || !Array.isArray(members)) {
      return res.status(400).json({ msg: "Members must be an array of user IDs" });
    }

    const project = await ProjectModel.findByIdAndUpdate(
      projectId,
      { $addToSet: { members: { $each: members } } }, // avoids duplicates
      { new: true }
    )
      .populate("members", "name email")
      .populate("createdBy", "name email");

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    return res.status(200).json({
      msg: "Users assigned successfully",
      project
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Failed to assign users",
      error: error.message
    });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  assignUsersToProject
};
