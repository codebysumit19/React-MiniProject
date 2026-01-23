import { useState, useEffect } from "react";
import api from "../../utils/api";
import { useNavigate, Link } from "react-router-dom";
import styles from "../../styles/auth.module.css";
import { FaReact } from "react-icons/fa";
import { isAuthenticated } from "../../utils/auth";

const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()[\]{}\\|;:'",.<>/?`~+=_-]).{8,20}$/;

function SignUp() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    securityQuestion: "",
    securityAnswer: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const validatePassword = (rawPassword) => {
    const password = rawPassword;
    if (!password.trim()) return "Password cannot be empty or only spaces";
    if (password.length < 8) return "Password is too short";
    if (password.length > 20) return "Password is too long";
    if (!passwordRegex.test(password)) {
      return "Password does not meet requirements";
    }
    return "";
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return "Please confirm your password";
    if (password !== confirmPassword) return "Passwords do not match";
    return "";
  };

  const handleChange = (field, value) => {
    const newValue = field === "email" ? value.toLowerCase() : value;

    setForm((prev) => ({ ...prev, [field]: newValue }));
    setErrors((prev) => ({ ...prev, [field]: "" }));

    if (field === "email") {
      setErrors((prev) => ({ ...prev, email: validateEmail(newValue) }));
    }

    if (field === "confirmPassword") {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateConfirmPassword(form.password, newValue),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameError = form.name.trim() ? "" : "Name is required";
    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);
    const confirmError = validateConfirmPassword(
      form.password,
      form.confirmPassword,
    );
    const securityQuestionError = !form.securityQuestion
      ? "Please select a security question"
      : "";
    const securityAnswerError = !form.securityAnswer.trim()
      ? "Please provide an answer"
      : "";

    if (
      nameError ||
      emailError ||
      passwordError ||
      confirmError ||
      securityQuestionError ||
      securityAnswerError
    ) {
      setErrors({
        name: nameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmError,
        securityQuestion: securityQuestionError,
        securityAnswer: securityAnswerError,
      });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await api.post("/register", {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        securityQuestion: form.securityQuestion,
        securityAnswer: form.securityAnswer.trim(),
      });
      navigate("/login");
    } catch (err) {
      const statusCode = err.response?.status;
      const responseData = err.response?.data;
      const errorType = responseData?.type;
      const msg = responseData?.msg || "Registration failed";

      if (errorType === "email" || statusCode === 400) {
        setErrors((prev) => ({
          ...prev,
          email: "Email already exists",
        }));
      } else if (
        msg.toLowerCase().includes("email") &&
        msg.toLowerCase().includes("exist")
      ) {
        setErrors((prev) => ({
          ...prev,
          email: "Email already exists",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          password: msg,
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    form.name.trim() &&
    form.email.trim() &&
    form.password.trim() &&
    form.confirmPassword.trim() &&
    form.securityQuestion &&
    form.securityAnswer.trim();

  return (
    <div className={styles.pageWrapper}>
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinnerLarge}></div>
          <p className={styles.loadingText}>Creating your account...</p>
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
          <h1>Sign Up</h1>

          <h3>Name:</h3>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
          {errors.name && <p className={styles.errorText}>{errors.name}</p>}

          <h3>Email:</h3>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            maxLength={254}
            required
          />
          {errors.email && <p className={styles.errorText}>{errors.email}</p>}

          <h3>Password:</h3>
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            maxLength={20}
            required
          />
          <div className={styles.passwordInfo}>
            <p>Password must contain:</p>
            <ul>
              <li>8-20 characters</li>
              <li>Uppercase letter (A-Z)</li>
              <li>Lowercase letter (a-z)</li>
              <li>Number (0-9)</li>
              <li>Special character (!@#$%...)</li>
            </ul>
          </div>
          {errors.password && (
            <p className={styles.errorText}>{errors.password}</p>
          )}

          <h3>Confirm Password:</h3>
          <input
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            maxLength={20}
            required
          />
          {errors.confirmPassword && (
            <p className={styles.errorText}>{errors.confirmPassword}</p>
          )}

          <h3>Security Question:</h3>
          <select
            value={form.securityQuestion}
            onChange={(e) => handleChange("securityQuestion", e.target.value)}
            required
          >
            <option value="">--Select a security question--</option>
            <option value="pet">What was your first pet's name?</option>
            <option value="city">In which city were you born?</option>
            <option value="school">
              What was the name of your first school?
            </option>
            <option value="color">What is your favorite color?</option>
          </select>
          {errors.securityQuestion && (
            <p className={styles.errorText}>{errors.securityQuestion}</p>
          )}

          <h3>Security Answer:</h3>
          <input
            type="text"
            placeholder="Your answer"
            value={form.securityAnswer}
            onChange={(e) => handleChange("securityAnswer", e.target.value)}
            required
          />
          <p className={styles.hintText}>
            ℹ️ This will be used to verify your identity if you forget your
            password
          </p>
          {errors.securityAnswer && (
            <p className={styles.errorText}>{errors.securityAnswer}</p>
          )}

          <button type="submit" disabled={!isFormValid || loading}>
            Sign Up
          </button>

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
