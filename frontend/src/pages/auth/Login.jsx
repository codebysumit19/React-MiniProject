import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import styles from "../../styles/auth.module.css";
import { FaReact } from "react-icons/fa";
import { isAuthenticated, setAuth } from "../../utils/auth";

const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const lockoutUntil = localStorage.getItem('lockoutUntil');
    if (lockoutUntil) {
      const remaining = parseInt(lockoutUntil) - Date.now();
      if (remaining > 0) {
        setIsLocked(true);
        setLockoutTimeRemaining(Math.ceil(remaining / 1000));
      } else {
        localStorage.removeItem('lockoutUntil');
        localStorage.removeItem('failedLoginAttempts');
      }
    }

    const storedAttempts = localStorage.getItem('failedLoginAttempts');
    if (storedAttempts) {
      setFailedAttempts(parseInt(storedAttempts));
    }
  }, []);

  useEffect(() => {
    if (isLocked && lockoutTimeRemaining > 0) {
      const timer = setInterval(() => {
        setLockoutTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setFailedAttempts(0);
            localStorage.removeItem('lockoutUntil');
            localStorage.removeItem('failedLoginAttempts');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLocked, lockoutTimeRemaining]);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

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

    if (isLocked) {
      const minutes = Math.floor(lockoutTimeRemaining / 60);
      const seconds = lockoutTimeRemaining % 60;
      setErrors({
        email: "",
        password: `Account locked. Try again in ${minutes}m ${seconds}s`,
      });
      return;
    }

    const emailError = validateEmail(form.email);
    
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
      
      localStorage.removeItem('failedLoginAttempts');
      localStorage.removeItem('lockoutUntil');
      setFailedAttempts(0);
      
      setAuth(res.data.token);
      navigate("/dashboard");
     } catch (err) {
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);
      localStorage.setItem('failedLoginAttempts', newFailedAttempts.toString());
      
      const statusCode = err.response?.status;
      const responseData = err.response?.data;
      const errorType = responseData?.type;

      if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
        const lockoutUntil = Date.now() + LOCKOUT_DURATION;
        localStorage.setItem('lockoutUntil', lockoutUntil.toString());
        setIsLocked(true);
        setLockoutTimeRemaining(LOCKOUT_DURATION / 1000);
        
        setErrors({
          email: "",
          password: `Too many failed attempts. Account locked for 5 minutes.`,
        });
      } else {
        const remainingAttempts = MAX_FAILED_ATTEMPTS - newFailedAttempts;
        
        if (errorType === "email" || statusCode === 404) {
          setErrors({ 
            email: "Email is incorrect", 
            password: `${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining` 
          });
        } else if (errorType === "password" || statusCode === 401) {
          setErrors({ 
            email: "", 
            password: `Password is incorrect. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining` 
          });
        } else {
          setErrors({ 
            email: "", 
            password: `Invalid credentials. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining` 
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = form.email.trim() !== "" && form.password.trim() !== "" && !isLocked;

  const formatLockoutTime = () => {
    const minutes = Math.floor(lockoutTimeRemaining / 60);
    const seconds = lockoutTimeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

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

          {isLocked && (
            <div className={styles.lockoutWarning}>
              <p>🔒 Account Locked</p>
              <p>Too many failed login attempts.</p>
              <p>Try again in: <strong>{formatLockoutTime()}</strong></p>
            </div>
          )}

          <h3>Email:</h3>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            maxLength={254}
            disabled={isLocked}
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
            disabled={isLocked}
            required
          />
          {errors.password && (
            <p className={styles.errorText}>{errors.password}</p>
          )}

          <button type="submit" disabled={!isFormValid || loading}>
            {isLocked ? "Locked" : "Login"}
          </button>

          <div className={styles.forgotPassword}>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

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

