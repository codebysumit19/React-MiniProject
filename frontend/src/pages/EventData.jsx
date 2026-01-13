import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import EventForm from "../edit/Event";
import axios from "axios";
import styles from "../styles/data.module.css";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { isAuthenticated, logout, getRemainingTime } from "../utils/auth";

function EventData() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [remainingTime, setRemainingTime] = useState(getRemainingTime());
  const navigate = useNavigate();

  const headerTitle = editingEvent ? "Edit Event Data" : "Events Data";

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

  const fetchEvents = async () => {
    const { data } = await axios.get("http://localhost:5000/events");
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this event?")) {
      await axios.delete(`http://localhost:5000/events/${id}`);
      fetchEvents();
    }
  };

  const handleEdit = (event) => setEditingEvent(event);
  const handleEditComplete = () => {
    setEditingEvent(null);
    fetchEvents();
  };

  const handleExport = () => {
    if (events.length === 0) {
      alert("No data to export.");
      return;
    }
    const headers = [
      "Event Name",
      "Event Address",
      "Event Date",
      "Start Time",
      "End Time",
      "Type",
      "Happened",
    ];
    const csvRows = [
      headers.join(","),
      ...events.map((event) =>
        [
          `"${event.name}"`,
          `"${event.address}"`,
          `"${event.date ? new Date(event.date).toLocaleDateString() : ""}"`,
          `"${event.stime}"`,
          `"${event.etime}"`,
          `"${event.type}"`,
          `"${event.happend}"`,
        ].join(",")
      ),
    ];
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "events.csv";
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
        {editingEvent ? (
          <div style={{ background: "#f9f9f9", padding: "20px", margin: "16px 0" }}>
            <h2 style={{ textAlign: "center" }}>Edit Event Data</h2>
            <EventForm
              existingEvent={editingEvent}
              onComplete={handleEditComplete}
            />
            <button
              className={styles.btnCancel}
              style={{ marginTop: "5px" }}
              onClick={() => setEditingEvent(null)}
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
                <th>Event Name</th>
                <th>Event Address</th>
                <th>Event Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Type</th>
                <th>Happened</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id}>
                  <td>{event.name}</td>
                  <td>{event.address}</td>
                  <td>{event.date ? new Date(event.date).toLocaleDateString() : ""}</td>
                  <td>{event.stime}</td>
                  <td>{event.etime}</td>
                  <td>{event.type}</td>
                  <td>{event.happend}</td>
                  <td>
                    <FaEdit
                      style={{ cursor: "pointer" }}
                      title="Edit"
                      onClick={() => handleEdit(event)}
                    />
                  </td>
                  <td>
                    <MdDelete
                      style={{ cursor: "pointer" }}
                      title="Delete"
                      onClick={() => handleDelete(event._id)}
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

export default EventData;
