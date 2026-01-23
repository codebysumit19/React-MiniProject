import mongoose from "mongoose";

const departmentsSchema = new mongoose.Schema({
  dname: { type: String, required: true },
  email: { type: String, required: true },
  number: { type: String, required: true },
  nemployees: { type: String, required: true },
  resp: { type: String, required: true },
  budget: { type: String, required: true },
  status: { 
    type: String, 
    required: true,
    enum: ["Active", "Inactive"]
  },
  description: { type: String, required: true },
});

const Departments = mongoose.model("Departments", departmentsSchema);
export default Departments;
