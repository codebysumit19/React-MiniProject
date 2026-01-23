import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "./models/User.js";
import Projects from "./models/Projects.js";
import Events from "./models/Events.js";
import Departments from "./models/Departments.js";
import Employees from "./models/Employees.js";
import PasswordReset from "./models/PasswordReset.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err.message));

// === REGISTER & LOGIN ===

// Register
app.post("/register", async (req, res) => {
  const { name, email, password, securityQuestion, securityAnswer } = req.body;
  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        msg: "Email already exists",
        type: "email"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ 
      name, 
      email: email.toLowerCase(), 
      password: hashedPassword,
      securityQuestion,
      securityAnswer: securityAnswer.toLowerCase().trim()
    });
    
    res.json({ msg: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ 
        msg: "User not found",
        type: "email"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ 
        msg: "Password is incorrect",
        type: "password"
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    
    res.json({ msg: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Verify token API
app.get("/verify", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ msg: "No token provided" });
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ msg: "Invalid token" });
    res.json({ msg: "Token valid", userId: decoded.id });
  });
});

// === PASSWORD RESET ROUTES ===

// Step 1: Check if email exists and return security question
app.post("/forgot-password/check-email", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ msg: "Email not found" });
    }

    res.json({ 
      securityQuestion: user.securityQuestion,
      msg: "Email verified"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Step 2: Verify security answer and generate reset token
app.post("/forgot-password/verify-answer", async (req, res) => {
  const { email, securityAnswer } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.securityAnswer.toLowerCase() !== securityAnswer.toLowerCase().trim()) {
      return res.status(400).json({ msg: "Incorrect security answer" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    
    await PasswordReset.deleteMany({ userId: user._id });
    
    await PasswordReset.create({
      userId: user._id,
      token: resetToken,
    });

    console.log("=== PASSWORD RESET TOKEN ===");
    console.log(`User: ${user.email}`);
    console.log(`Token: ${resetToken}`);
    console.log("============================");

    res.json({ 
      msg: "Security answer verified!",
      resetToken: resetToken
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Step 3: Reset password with token
app.post("/forgot-password/reset", async (req, res) => {
  const { token, newPassword } = req.body;
  
  try {
    const resetRecord = await PasswordReset.findOne({ token });
    
    if (!resetRecord) {
      return res.status(400).json({ msg: "Invalid or expired reset token" });
    }

    const user = await User.findById(resetRecord.userId);
    
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    user.password = hashedPassword;
    await user.save();

    await PasswordReset.deleteMany({ userId: user._id });

    res.json({ msg: "Password reset successful!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// === EVENTS ===

app.post("/events", async (req, res) => {
  try {
    const { name, address, date, stime, etime, type, happend } = req.body;
    const newEvent = new Events({
      name,
      address,
      date: new Date(date),
      stime,
      etime,
      type,
      happend,
    });
    await newEvent.save();
    res.status(201).json({ msg: "Event saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to save event" });
  }
});

app.get("/events", async (req, res) => {
  try {
    const events = await Events.find();
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching events" });
  }
});

app.delete("/events/:id", async (req, res) => {
  try {
    await Events.findByIdAndDelete(req.params.id);
    res.json({ msg: "Event deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting event" });
  }
});

app.put("/events/:id", async (req, res) => {
  try {
    await Events.findByIdAndUpdate(req.params.id, req.body);
    res.json({ msg: "Event updated" });
  } catch (err) {
    res.status(500).json({ msg: "Error updating event" });
  }
});

// === DEPARTMENTS ===

app.post("/department", async (req, res) => {
  try {
    const { dname, email, number, nemployees, resp, budget, status, description } = req.body;
    const newDepartment = new Departments({
      dname,
      email,
      number,
      nemployees,
      resp,
      budget,
      status,
      description,
    });
    await newDepartment.save();
    res.status(201).json({ msg: "Department data submitted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error submitting department data" });
  }
});

app.get("/departments", async (req, res) => {
  try {
    const departments = await Departments.find();
    res.json(departments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching departments" });
  }
});

app.delete("/departments/:id", async (req, res) => {
  try {
    await Departments.findByIdAndDelete(req.params.id);
    res.json({ msg: "Department deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting department" });
  }
});

app.put("/departments/:id", async (req, res) => {
  try {
    await Departments.findByIdAndUpdate(req.params.id, req.body);
    res.json({ msg: "Department updated" });
  } catch (err) {
    res.status(500).json({ msg: "Error updating department" });
  }
});

// === EMPLOYEES ===

app.post("/employee", async (req, res) => {
  try {
    const {
      ename,
      dob,
      gender,
      email,
      pnumber,
      address,
      designation,
      salary,
      joining_date,
      aadhar
    } = req.body;
    const newEmployee = new Employees({
      ename,
      dob: new Date(dob),
      gender,
      email,
      pnumber,
      address,
      designation,
      salary,
      joining_date: new Date(joining_date),
      aadhar
    });
    await newEmployee.save();
    res.status(201).json({ msg: "Employee data submitted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error submitting employee data" });
  }
});

app.get("/employees", async (req, res) => {
  try {
    const employees = await Employees.find();
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching employees" });
  }
});

app.delete("/employees/:id", async (req, res) => {
  try {
    await Employees.findByIdAndDelete(req.params.id);
    res.json({ msg: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting employee" });
  }
});

app.put("/employees/:id", async (req, res) => {
  try {
    await Employees.findByIdAndUpdate(req.params.id, req.body);
    res.json({ msg: "Employee updated" });
  } catch (err) {
    res.status(500).json({ msg: "Error updating employee" });
  }
});

// === PROJECTS ===

app.post("/projects", async (req, res) => {
  try {
    const {
      pname,
      cname,
      pmanager,
      sdate,
      edate,
      status,
      pdescription,
    } = req.body;
    const newProject = new Projects({
      pname,
      cname,
      pmanager,
      sdate: new Date(sdate),
      edate: new Date(edate),
      status,
      pdescription,
    });
    await newProject.save();
    res.status(201).json({ msg: "Project created successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error creating project" });
  }
});

app.get("/projects", async (req, res) => {
  try {
    const projects = await Projects.find();
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching projects" });
  }
});

app.delete("/projects/:id", async (req, res) => {
  try {
    await Projects.findByIdAndDelete(req.params.id);
    res.json({ msg: "Project deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting project" });
  }
});

app.put("/projects/:id", async (req, res) => {
  try {
    await Projects.findByIdAndUpdate(req.params.id, req.body);
    res.json({ msg: "Project updated" });
  } catch (err) {
    res.status(500).json({ msg: "Error updating project" });
  }
});

// Start Server
app.listen(process.env.PORT || 5000, () =>
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
);

