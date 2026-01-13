import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/project.module.css";

function Project({ existingProject, onComplete }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pname: "",
    cname: "",
    pmanager: "",
    sdate: "",
    edate: "",
    status: "",
    pdescription: "",
  });

    useEffect(() => {
    if (existingProject) {
      setFormData({
        pname: existingProject.pname || "",
        cname: existingProject.cname || "",
        pmanager: existingProject.pmanager || "",
        sdate: existingProject.sdate ? existingProject.sdate.substr(0, 10) : "",
        edate: existingProject.edate ? existingProject.edate.substr(0, 10) : "",
        status: existingProject.status || "",
        pdescription: existingProject.pdescription || "",
      });
    }
  }, [existingProject]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (existingProject) {
        await axios.put(
          `http://localhost:5000/projects/${existingProject._id}`,
          formData
        );
        alert("Project updated!");
      } else {
        await axios.post("http://localhost:5000/projects", formData);
        alert("Project added!");
        navigate("/projectdata");
      }
      if (onComplete) onComplete();
    } catch {
      alert("Error saving project.");
    }
  };

  return (
    <div className={styles.formPage}>
      <div className={styles.formHeader}></div>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <h3>
          Project Name:
          <input
            type="text"
            name="pname"
            placeholder="Project Name"
            value={formData.pname}
            onChange={handleChange}
            required
          />
        </h3>
        <h3>
          Client / Company Name:
          <input
            type="text"
            name="cname"
            placeholder="Client / Company Name"
            value={formData.cname}
            onChange={handleChange}
            required
          />
        </h3>
        <h3>
          Project Manager Name:
          <input
            type="text"
            name="pmanager"
            pattern="[A-Za-z\s]+"
            title="Only letters and spaces allowed"
            placeholder="Project Manager Name"
            value={formData.pmanager}
            onChange={handleChange}
            required
          />
        </h3>
        <h3>
          Start Date:
          <input
            type="date"
            name="sdate"
            value={formData.sdate}
            onChange={handleChange}
            required
          />
        </h3>
        <h3>
          End Date / Deadline:
          <input
            type="date"
            name="edate"
            value={formData.edate}
            onChange={handleChange}
            required
          />
        </h3>
        <h3>
          Project Status:
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="">--Select--</option>
            <option value="Planning">Planning</option>
            <option value="In Progress">In Progress</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
          </select>
        </h3>
        <h3>
          Description:
          <textarea
            name="pdescription"
            placeholder="Description"
            value={formData.pdescription}
            onChange={handleChange}
            required
          />
        </h3>
        <button type="submit" className={styles.btnSubmit}>
          {existingProject ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default Project;

