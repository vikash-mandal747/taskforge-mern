const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
    title: { type: String, required: true, min: 3 },
    description: { type: String, required: true },
    createdBy: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true })

const ProjectModel = mongoose.model("Project", projectSchema);
module.exports = ProjectModel;