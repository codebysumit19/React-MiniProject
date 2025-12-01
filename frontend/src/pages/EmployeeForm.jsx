import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import styles from "../styles/employee.module.css";
import Header from "../components/Header";



function EmployeeForm({ existingEmployee, onComplete }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ename: "", dob: "", gender: "", email: "", pnumber: "",
    address: "", designation: "", salary: "", joining_date: "", aadhar: ""
  });

  useEffect(() => {
    if (existingEmployee) {
      setFormData({
        ename: existingEmployee.ename || "",
        dob: existingEmployee.dob ? existingEmployee.dob.substr(0, 10) : "",
        gender: existingEmployee.gender || "",
        email: existingEmployee.email || "",
        pnumber: existingEmployee.pnumber || "",
        address: existingEmployee.address || "",
        designation: existingEmployee.designation || "",
        salary: existingEmployee.salary || "",
        joining_date: existingEmployee.joining_date ? existingEmployee.joining_date.substr(0, 10) : "",
        aadhar: existingEmployee.aadhar || "",
      });
    }
  }, [existingEmployee]);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (existingEmployee) {
        await axios.put(`http://localhost:5000/employees/${existingEmployee._id}`, formData);
        alert("Employee updated!");
      } else {
        await axios.post("http://localhost:5000/employee", formData);
        alert("Employee added!");
        navigate("/employeedata");
      }
      if (onComplete) onComplete();
    } catch {
      alert("Error saving employee.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);


  return (
    <div className={styles.formPage}>
      <Header
        title="Employee Form"                  // Dynamic! Set based on page
        showExport={false}                        // Only for pages needing Export
        showLogoutModal={showLogoutModal}
        setShowLogoutModal={setShowLogoutModal}
        handleLogout={handleLogout}
      />
      <div className={styles.formHeader}>
       
      </div>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <h3>Full Name:
          <input type="text" name="ename"
                 pattern="[A-Za-z\s]+" title="Only letters and spaces allowed"
                 placeholder="Enter full name"
                 value={formData.ename} onChange={handleChange} required />
        </h3>
        <h3>Date of Birth:
          <input type="date" name="dob"
                 value={formData.dob} onChange={handleChange} required />
        </h3>
        <h3>Gender:
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">--Select--</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </h3>
        <h3>Email:
          <input type="email" name="email" placeholder="Enter email"
                 value={formData.email} onChange={handleChange} required />
        </h3>
        <h3>Phone Number:
          <input type="number" name="pnumber" placeholder="Enter phone number"
                 value={formData.pnumber} onChange={handleChange} required />
        </h3>
        <h3>Address:
          <input type="text" name="address" placeholder="Enter address"
                 value={formData.address} onChange={handleChange} required />
        </h3>
        <h3>Designation:
          <input type="text" name="designation" placeholder="Enter designation"
                 value={formData.designation} onChange={handleChange} required />
        </h3>
        <h3>Salary:
          <input type="text" name="salary" placeholder="Enter salary"
                 value={formData.salary} onChange={handleChange} required />
        </h3>
        <h3>Date of Joining:
          <input type="date" name="joining_date"
                 value={formData.joining_date} onChange={handleChange} required />
        </h3>
        <h3>Aadhar Number / ID Proof:
          <input type="text" name="aadhar" placeholder="Enter ID proof"
                 value={formData.aadhar} onChange={handleChange} required />
        </h3>
        <button type="submit" className={styles.btnSubmit}>
          {existingEmployee ? "Update" : "Submit"}
        </button>
      </form>
      <footer className={styles.footer}>
      <small>© 2025 My App React. All rights reserved.</small>
    </footer>

    </div>
  );
}
export default EmployeeForm;
