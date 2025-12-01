import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "../styles/dashboard.module.css";
import Header from "../components/Header";

function Dashboard() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className={styles.pageWrapper}>
      <Header
        title="Welcome to Dashboard"
        showLogoutModal={showLogoutModal}
        setShowLogoutModal={setShowLogoutModal}
        handleLogout={handleLogout}
      />

      <div className={styles.all}>
        <div className={styles.container}>
          <table>
            <thead>
              <tr>
                <th>
                  <Link to="/eventform">Event Form</Link>
                </th>
                <th>
                  <Link to="/employeeform">Employees Form</Link>
                </th>
                <th>
                  <Link to="/departmentform">Departments Form</Link>
                </th>
                <th>
                  <Link to="/projectform">Project Form</Link>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Link to="/eventdata">Event Data</Link>
                </td>
                <td>
                  <Link to="/employeedata">Employees Data</Link>
                </td>
                <td>
                  <Link to="/departmentdata">Departments Data</Link>
                </td>
                <td>
                  <Link to="/projectdata">Project Data</Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <footer className={styles.footer}>
        <small>© 2025 My App React. All rights reserved.</small>
      </footer>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to log out?</p>
            <div className={styles.modalBtns}>
              <button className={styles.confirmBtn} onClick={handleLogout}>
                Yes
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
