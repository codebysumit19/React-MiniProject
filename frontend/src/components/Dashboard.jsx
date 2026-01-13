import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "../styles/dashboard.module.css";
import Header from "./Header";
import { isAuthenticated, logout, getRemainingTime } from "../utils/auth";

function Dashboard() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [remainingTime, setRemainingTime] = useState(getRemainingTime());

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

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className={styles.pageWrapper}>
      <Header
        title="Welcome to Dashboard"
        showLogoutModal={showLogoutModal}
        setShowLogoutModal={setShowLogoutModal}
        handleLogout={handleLogout}
        remainingTime={remainingTime}
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
    </div>
  );
}

export default Dashboard;
