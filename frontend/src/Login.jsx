import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import styles from "./styles/signup.module.css";
import { FaReact } from "react-icons/fa";

const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const navigate = useNavigate();

  const validateEmail = (rawEmail) => {
    const email = rawEmail.trim().toLowerCase();
    if (!email) return "Email is required";
    if (email.length > 254) return "Email must be 254 characters or less";
    if (!emailRegex.test(email)) {
      return "Please enter a valid email (no #, ! and similar characters)";
    }
    return "";
  };

  const handleChange = (field, value) => {
    const newValue = field === "email" ? value.toLowerCase() : value;
    setForm((prev) => ({ ...prev, [field]: newValue }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(form.email);
    
    // Check if password is only whitespace
    if (!form.password.trim()) {
      setErrors({
        email: emailError,
        password: "Password cannot be empty or only spaces",
      });
      return;
    }

    if (emailError) {
      setErrors({
        email: emailError,
        password: "",
      });
      return;
    }

    setLoading(true);
    setErrors({ email: "", password: "" });

    try {
      const res = await axios.post("http://localhost:5000/login", {
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      localStorage.setItem("token", res.data.token);
      setFailedAttempts(0);
      navigate("/dashboard");
    } catch (err) {
      setFailedAttempts((prev) => prev + 1);
      
      const statusCode = err.response?.status;
      const responseData = err.response?.data;
      const errorType = responseData?.type;

      if (errorType === "email" || statusCode === 404) {
        setErrors({ email: "Email is incorrect", password: "" });
      } else if (errorType === "password" || statusCode === 401) {
        setErrors({ email: "", password: "Password is incorrect" });
      } else {
        setErrors({ email: "", password: "Invalid credentials" });
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = form.email.trim() !== "" && form.password.trim() !== "";

  const showAttemptsWarning = failedAttempts >= 3;

  return (
    <div className={styles.pageWrapper}>
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinnerLarge}></div>
          <p className={styles.loadingText}>Logging in...</p>
        </div>
      )}

      <header className={styles.header}>
        <div className={styles.leftIcon}>
          <FaReact size={40} style={{ marginLeft: "15px", color: "white" }} />
        </div>
        <div className={styles.headerCenter}>
          <h2>My React App</h2>
        </div>
      </header>

      <div className={styles.formWrapper}>
        <form className={styles.formContainer} onSubmit={handleSubmit}>
          <h1>Login</h1>

          {showAttemptsWarning && (
            <p className={styles.warningText}>
              Multiple failed attempts detected. Please check your credentials.
            </p>
          )}

          <h3>Email:</h3>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            maxLength={254}
            required
          />
          {errors.email && (
            <p className={styles.errorText}>{errors.email}</p>
          )}

          <h3>Password:</h3>
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            maxLength={20}
            required
          />
          {errors.password && (
            <p className={styles.errorText}>{errors.password}</p>
          )}

          <button type="submit" disabled={!isFormValid || loading}>
            Login
          </button>

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
