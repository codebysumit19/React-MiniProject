import React from "react";
import { Link } from "react-router-dom";
import { FaReact } from "react-icons/fa";
import styles from "../styles/dashboard.module.css";

function Header({
  title = "Welcome to Dashboard",
  showExport = false,
  onExport,
  showLogoutModal,
  setShowLogoutModal,
  handleLogout,
  remainingTime, // Keep this for warning banner functionality
}) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link to="/dashboard">
          <FaReact size={40} style={{ marginLeft: "15px", color: "white" }} />
        </Link>
        <h3 className={styles.welcome}>{title}</h3>
      </div>
      <nav className={styles.Sections}>
        <Link to="/dashboard"><h5>Home</h5></Link>
        <h5>Services / Products</h5>
        <h5>Team</h5>
        <h5>Careers</h5>
        <h5>About</h5>
        <h5>Privacy Policy & Terms</h5>
        <h5>Contact Us</h5>
      </nav>
      <div className={styles.right}>
        {/* Session Timer Removed */}

        {showExport && typeof onExport === "function" && (
          <h5 type="button" className={styles.btnExport} onClick={onExport}>
            Export
          </h5>
        )}
        <h5 onClick={() => setShowLogoutModal(true)} className={styles.logoutBtn}>
          Logout
        </h5>
      </div>

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
    </header>
  );
}

export default Header;
