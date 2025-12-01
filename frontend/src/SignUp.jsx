import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import styles from "./styles/signup.module.css";
import { FaReact } from "react-icons/fa";

function SignUp() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:5000/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      alert("Registration successful");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.msg || "Server error");
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <div className={styles.leftIcon}>
          <FaReact size={40} style={{ marginLeft: "15px", color: "white" }} />{" "}
        </div>
        <div className={styles.headerCenter}>
          <h2>My React App</h2>
        </div>
      </header>

      <div className={styles.formWrapper}>
        <form className={styles.formContainer} onSubmit={handleSubmit}>
          <h1>Sign Up</h1>
          <h3>Name:</h3>
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <h3>Email:</h3>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <h3>Password:</h3>
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <h3>Confirm Password:</h3>
          <input
            type="password"
            placeholder="Confirm Password"
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
            required
          />
          <button type="submit">Sign Up</button>
          <div>
            Already have an account? <Link to="/login">Login here</Link>
          </div>
        </form>
      </div>
      <footer className={styles.footer}>
        <small>© 2025 My App React. All rights reserved.</small>
      </footer>
    </div>
  );
}

export default SignUp;
