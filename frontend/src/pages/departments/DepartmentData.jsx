import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import Department from "../../edit/Department";
import axios from "axios";
import styles from "../../styles/data.module.css";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { isAuthenticated, logout, getRemainingTime } from "../../utils/auth";

function DepartmentData() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [remainingTime, setRemainingTime] = useState(getRemainingTime());
  const navigate = useNavigate();

  const headerTitle = editing ? "Edit Department Data" : "Departments Data";

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

  const fetchDepartments = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/departments");
      setDepartments(data);
    } catch (error) {
      alert("Error fetching departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this department?")) {
      await axios.delete(`http://localhost:5000/departments/${id}`);
      fetchDepartments();
    }
  };

  const handleEdit = (dep) => setEditing(dep);
  const handleEditComplete = () => {
    setEditing(null);
    fetchDepartments();
  };

  const handleExport = () => {
    if (departments.length === 0) {
      alert("No data to export.");
      return;
    }
    const headers = [
      "Department Name",
      "Email",
      "Contact Number",
      "Number of Employees",
      "Responsibilities",
      "Annual Budget",
      "Status",
      "Description",
    ];
    const csvRows = [
      headers.join(","),
      ...departments.map((dep) =>
        [
          `"${dep.dname}"`,
          `"${dep.email}"`,
          `"${dep.number}"`,
          `"${dep.nemployees}"`,
          `"${dep.resp}"`,
          `"${dep.budget}"`,
          `"${dep.status}"`,
          `"${dep.description}"`,
        ].join(",")
      ),
    ];
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "departments.csv";
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
            <h2 style={{ textAlign: "center" }}>Edit Department Data</h2>
            <Department
              existingDepartment={editing}
              onComplete={handleEditComplete}
            />
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
                <th>Department Name</th>
                <th>Email</th>
                <th>Contact Number</th>
                <th>Number of Employees</th>
                <th>Responsibilities</th>
                <th>Annual Budget</th>
                <th>Status</th>
                <th>Description</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {departments.length > 0 ? (
                departments.map((dep) => (
                  <tr key={dep._id}>
                    <td>{dep.dname}</td>
                    <td>{dep.email}</td>
                    <td>{dep.number}</td>
                    <td>{dep.nemployees}</td>
                    <td>{dep.resp}</td>
                    <td>{dep.budget}</td>
                    <td>{dep.status}</td>
                    <td>{dep.description}</td>
                    <td>
                      <FaEdit
                        style={{ cursor: "pointer" }}
                        title="Edit"
                        onClick={() => handleEdit(dep)}
                      />
                    </td>
                    <td>
                      <MdDelete
                        style={{ cursor: "pointer" }}
                        title="Delete"
                        onClick={() => handleDelete(dep._id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10}>No departments found.</td>
                </tr>
              )}
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

export default DepartmentData;

