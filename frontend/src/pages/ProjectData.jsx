import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import Project from "../edit/Project";
import axios from "axios";
import styles from "../styles/data.module.css";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { isAuthenticated, logout, getRemainingTime } from "../utils/auth";

function ProjectData() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [remainingTime, setRemainingTime] = useState(getRemainingTime());
  const navigate = useNavigate();

  const headerTitle = editing ? "Edit Project Data" : "Projects Data";

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }

    const interval = setInterval(() => {
      if (!isAuthenticated()) {
        logout();
        navigate("/login", { replace: true });
      } else {
        setRemainingTime(getRemainingTime());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  const fetchProjects = async () => {
    const { data } = await axios.get("http://localhost:5000/projects");
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this project?")) {
      await axios.delete(`http://localhost:5000/projects/${id}`);
      fetchProjects();
    }
  };

  const handleEdit = (proj) => setEditing(proj);
  const handleEditComplete = () => {
    setEditing(null);
    fetchProjects();
  };

  const handleExport = () => {
    if (projects.length === 0) {
      alert("No data to export.");
      return;
    }
    const headers = [
      "Project Name",
      "Client / Company Name",
      "Project Manager",
      "Start Date",
      "End Date / Deadline",
      "Project Status",
      "Description",
    ];
    const csvRows = [
      headers.join(","),
      ...projects.map((proj) =>
        [
          `"${proj.pname}"`,
          `"${proj.cname}"`,
          `"${proj.pmanager}"`,
          `"${proj.sdate ? new Date(proj.sdate).toLocaleDateString() : ""}"`,
          `"${proj.edate ? new Date(proj.edate).toLocaleDateString() : ""}"`,
          `"${proj.status}"`,
          `"${proj.pdescription}"`,
        ].join(",")
      ),
    ];
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "projects.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className={styles.pageWrapper}>
      <Header
        title={headerTitle}
        showExport={true}
        onExport={handleExport}
        showLogoutModal={showLogoutModal}
        setShowLogoutModal={setShowLogoutModal}
        handleLogout={handleLogout}
        remainingTime={remainingTime}
      />

    

      <main className={styles.mainContent}>
        {editing ? (
          <div style={{ background: "#f9f9f9", padding: "20px", margin: "16px 0" }}>
            <h2 style={{ textAlign: "center" }}>Edit Project Data</h2>
            <Project existingProject={editing} onComplete={handleEditComplete} />
            <button
              className={styles.btnCancel}
              style={{ marginTop: "5px" }}
              onClick={() => setEditing(null)}
            >
              Cancel
            </button>
          </div>
        ) : loading ? (
          <p>Loading...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Client / Company Name</th>
                <th>Project Manager</th>
                <th>Start Date</th>
                <th>End Date / Deadline</th>
                <th>Project Status</th>
                <th>Description</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj) => (
                <tr key={proj._id}>
                  <td>{proj.pname}</td>
                  <td>{proj.cname}</td>
                  <td>{proj.pmanager}</td>
                  <td>{proj.sdate ? new Date(proj.sdate).toLocaleDateString() : ""}</td>
                  <td>{proj.edate ? new Date(proj.edate).toLocaleDateString() : ""}</td>
                  <td>{proj.status}</td>
                  <td>{proj.pdescription}</td>
                  <td>
                    <FaEdit
                      style={{ cursor: "pointer" }}
                      title="Edit"
                      onClick={() => handleEdit(proj)}
                    />
                  </td>
                  <td>
                    <MdDelete
                      style={{ cursor: "pointer" }}
                      title="Delete"
                      onClick={() => handleDelete(proj._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
      <footer className={styles.footer}>
        <small>© 2025 My App React. All rights reserved.</small>
      </footer>
    </div>
  );
}

export default ProjectData;
