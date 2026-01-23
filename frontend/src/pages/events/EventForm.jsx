import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../styles/event.module.css";
import Header from "../../components/Header";
import { isAuthenticated, logout, getRemainingTime } from "../../utils/auth";

function EventForm({ existingEvent, onComplete }) {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [remainingTime, setRemainingTime] = useState(getRemainingTime());
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    date: "",
    stime: "",
    etime: "",
    type: "",
    happend: "",
  });

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

  useEffect(() => {
    if (existingEvent) {
      setFormData({
        name: existingEvent.name || "",
        address: existingEvent.address || "",
        date: existingEvent.date ? existingEvent.date.substr(0, 10) : "",
        stime: existingEvent.stime || "",
        etime: existingEvent.etime || "",
        type: existingEvent.type || "",
        happend: existingEvent.happend || "",
      });
    }
  }, [existingEvent]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (existingEvent) {
        await axios.put(
          `http://localhost:5000/events/${existingEvent._id}`,
          formData
        );
        alert("Event updated!");
      } else {
        await axios.post("http://localhost:5000/events", formData);
        alert("Event added!");
        navigate("/eventdata");
      }
      if (onComplete) onComplete();
    } catch {
      alert("Error saving event.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className={styles.formPage}>
      <Header
        title="Event Form"
        showExport={false}
        showLogoutModal={showLogoutModal}
        setShowLogoutModal={setShowLogoutModal}
        handleLogout={handleLogout}
        remainingTime={remainingTime}
      />
      <div className={styles.formHeader}></div>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <h3>
          Event Name:
          <input
            type="text"
            name="name"
            pattern="[A-Za-z\s]+"
            title="Only letters and spaces allowed"
            placeholder="Write your event name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </h3>
        <h3>
          Event Address:
          <input
            type="text"
            name="address"
            pattern="[A-Za-z\s]+"
            title="Only letters and spaces allowed"
            placeholder="Write your event address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </h3>
        <h3>
          Event Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </h3>
        <h3>
          Event Start Time:
          <input
            type="time"
            name="stime"
            value={formData.stime}
            onChange={handleChange}
            required
          />
        </h3>
        <h3>
          Event End Time:
          <input
            type="time"
            name="etime"
            value={formData.etime}
            onChange={handleChange}
            required
          />
        </h3>
        <h3>
          Type of Event:
          <input
            type="text"
            name="type"
            placeholder="Write event type"
            value={formData.type}
            onChange={handleChange}
            required
          />
        </h3>
        <h3>
          Event Happened:
          <label>
            <input
              type="radio"
              name="happend"
              value="Yes"
              checked={formData.happend === "Yes"}
              onChange={handleChange}
              required
            />{" "}
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="happend"
              value="No"
              checked={formData.happend === "No"}
              onChange={handleChange}
              required
            />{" "}
            No
          </label>
        </h3>
        <button type="submit" className={styles.btnSubmit}>
          {existingEvent ? "Update" : "Submit"}
        </button>
      </form>
      <footer className={styles.footer}>
        <small>© 2025 My App React. All rights reserved.</small>
      </footer>
    </div>
  );
}

export default EventForm;
