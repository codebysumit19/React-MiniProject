import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import styles from "../styles/department.module.css";

function Department({ existingDepartment, onComplete }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dname: "",
    email: "",
    number: "",
    nemployees: "",
    resp: "",
    budget: "",
    status: "",
    description: "",
  });

  useEffect(() => {
    if (existingDepartment) {
      setFormData({
        dname: existingDepartment.dname || "",
        email: existingDepartment.email || "",
        number: existingDepartment.number || "",
        nemployees: existingDepartment.nemployees || "",
        resp: existingDepartment.resp || "",
        budget: existingDepartment.budget || "",
        status: existingDepartment.status || "",
        description: existingDepartment.description || "",
      });
    }
  }, [existingDepartment]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (existingDepartment) {
        await axios.put(
          `http://localhost:5000/departments/${existingDepartment._id}`,
          formData
        );
        alert("Department updated!");
      } else {
        await axios.post("http://localhost:5000/department", formData);
        alert("Department added!");
        navigate("/departmentdata");
      }
      if (onComplete) onComplete();
    } catch {
      alert("Error saving department.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <div className={styles.formPage}>
      <div className={styles.formHeader}></div>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <h3>
          Department Name:
          <input
            type="text"
            name="dname"
            pattern="[A-Za-z\s]+"
            placeholder="Department Name"
            value={formData.dname}
            onChange={handleChange}
            required
          />
        </h3>
        <h3>
          Email:
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </h3>
        <h3>
          Contact Number:
          <input
            type="number"
            name="number"
            placeholder="Contact Number"
            value={formData.number}
            onChange={handleChange}
            required
          />
        </h3>
        <h3>
          Number of Employees:
          <input
            type="number"
            name="nemployees"
            placeholder="Number of Employees"
            value={formData.nemployees}
            onChange={handleChange}
            required
          />
        </h3>
        <h3>
          Department Responsibilities:
          <input
            type="text"
            name="resp"
            placeholder="Responsibilities"
            value={formData.resp}
            onChange={handleChange}
            required
          />
        </h3>
        <h3>
          Annual Budget:
          <input
            type="text"
            name="budget"
            placeholder="Annual Budget"
            value={formData.budget}
            onChange={handleChange}
            required
          />
        </h3>
        <h3>
          Department Status:
          <input
            type="radio"
            name="status"
            value="Active"
            checked={formData.status === "Active"}
            onChange={handleChange}
            required
          />{" "}
          Active
          <input
            type="radio"
            name="status"
            value="Inactive"
            checked={formData.status === "Inactive"}
            onChange={handleChange}
            required
          />{" "}
          Inactive
        </h3>
        <h3>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            required
          />
        </h3>
        <button type="submit" className={styles.btnSubmit}>
          {existingDepartment ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
}
export default Department;
