import mongoose from "mongoose";

const projectsSchema = new mongoose.Schema({
  pname: { type: String, required: true },
  cname: { type: String, required: true },
  pmanager: { type: String, required: true },
  sdate: { type: Date, required: true },    // Use Date for date fields!
  edate: { type: Date, required: true },
  status: {
    type: String,
    required: true,
    enum: ["Planning", "In Progress", "On Hold", "Completed"]
  },
  pdescription: { type: String, required: true },
});

const Projects = mongoose.model("Projects", projectsSchema);
export default Projects;
