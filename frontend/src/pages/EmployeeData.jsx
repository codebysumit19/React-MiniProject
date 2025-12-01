import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import Employee from "../edit/Employee"; // Make sure this is your form component!
import axios from "axios";
import styles from "../styles/data.module.css";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

function EmployeeData() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const navigate = useNavigate();

    const headerTitle = editing ? "Edit Employee Data" : "Employees Data";


  const fetchEmployees = async () => {
    const { data } = await axios.get("http://localhost:5000/employees");
    setEmployees(data);
    setLoading(false);
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this employee?")) {
      await axios.delete(`http://localhost:5000/employees/${id}`);
      fetchEmployees();
    }
  };

  const handleEdit = (emp) => setEditing(emp);
  const handleEditComplete = () => {
    setEditing(null);
    fetchEmployees();
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const handleExport = () => {
    if (employees.length === 0) {
      alert("No data to export.");
      return;
    }
    const headers = [
      "Full Name",
      "Date of Birth",
      "Gender",
      "Email",
      "Phone Number",
      "Address",
      "Designation",
      "Salary",
      "Date of Joining",
      "Aadhar Number / ID Proof"
    ];
    const csvRows = [
      headers.join(","),
      ...employees.map(emp =>
        [
          `"${emp.ename}"`,
          `"${emp.dob ? new Date(emp.dob).toLocaleDateString() : ""}"`,
          `"${emp.gender}"`,
          `"${emp.email}"`,
          `"${emp.pnumber}"`,
          `"${emp.address}"`,
          `"${emp.designation}"`,
          `"${emp.salary}"`,
          `"${emp.joining_date ? new Date(emp.joining_date).toLocaleDateString() : ""}"`,
          `"${emp.aadhar}"`
        ].join(",")
      )
    ];
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], {type: "text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employees.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
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
      />

      <main className={styles.mainContent}>
        {editing ? (
          <div style={{ background: "#f9f9f9", padding: "20px", margin: "16px 0" }}>
            <h2 style={{ textAlign: "center" }}>Edit Employee Data</h2>
            <Employee
              existingEmployee={editing}
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
                <th>Full Name</th>
                <th>Date of Birth</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Address</th>
                <th>Designation</th>
                <th>Salary</th>
                <th>Date of Joining</th>
                <th>Aadhar Number / ID Proof</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp._id}>
                  <td>{emp.ename}</td>
                  <td>{emp.dob ? new Date(emp.dob).toLocaleDateString() : ""}</td>
                  <td>{emp.gender}</td>
                  <td>{emp.email}</td>
                  <td>{emp.pnumber}</td>
                  <td>{emp.address}</td>
                  <td>{emp.designation}</td>
                  <td>{emp.salary}</td>
                  <td>{emp.joining_date ? new Date(emp.joining_date).toLocaleDateString() : ""}</td>
                  <td>{emp.aadhar}</td>
                  <td>
                    <FaEdit
                      style={{ cursor: "pointer" }}
                      title="Edit"
                      onClick={() => handleEdit(emp)}
                    />
                  </td>
                  <td>
                    <MdDelete
                      style={{ cursor: "pointer" }}
                      title="Delete"
                      onClick={() => handleDelete(emp._id)}
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

export default EmployeeData;
