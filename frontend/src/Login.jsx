import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import styles from "./styles/signup.module.css"; // Use your own CSS module
import { FaReact } from "react-icons/fa";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
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
          <h1>Login</h1>
          <h3>Email:</h3>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <h3>Password:</h3>
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button type="submit">Login</button>
          <div>
            Don't have an account? <Link to="/">Sign Up here</Link>
          </div>
        </form>
      </div>
      <footer className={styles.footer}>
        <small>© 2025 My App React. All rights reserved.</small>
      </footer>
    </div>
  );
}

export default Login;
