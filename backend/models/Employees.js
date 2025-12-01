import mongoose from "mongoose";

const employeesSchema = new mongoose.Schema({
  ename: { type: String, required: true },
  dob: { type: Date, required: true }, 
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female"]
  },
  email: { type: String, required: true },
  pnumber: { type: String, required: true },
  address: { type: String, required: true },
  designation: { type: String, required: true },
  salary: { type: String, required: true },
  joining_date: { type: Date, required: true },  
  aadhar: { type: String, required: true },
});

const Employees = mongoose.model("Employees", employeesSchema);
export default Employees;
