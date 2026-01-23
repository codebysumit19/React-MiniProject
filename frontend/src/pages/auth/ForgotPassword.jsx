import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/auth.module.css";
import { FaReact, FaCheckCircle } from "react-icons/fa";

const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()[\]{}\\|;:'",.<>/?`~+=_-]).{8,20}$/;

const SECURITY_QUESTIONS = {
  pet: "What was your first pet's name?",
  city: "In which city were you born?",
  school: "What was the name of your first school?",
  color: "What is your favorite color?",
};

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (rawEmail) => {
    const email = rawEmail.trim().toLowerCase();
    if (!email) return "Email is required";
    if (email.length > 254) return "Email must be 254 characters or less";
    if (!emailRegex.test(email)) {
      return "Please enter a valid email";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password.trim()) return "Password cannot be empty";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (password.length > 20) return "Password must be max 20 characters";
    if (!passwordRegex.test(password)) {
      return "Password does not meet requirements";
    }
    return "";
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await axios.post("http://localhost:5000/forgot-password/check-email", {
        email: email.trim().toLowerCase(),
      });
      
      setSecurityQuestion(res.data.securityQuestion);
      setStep(2);
    } catch (err) {
      setErrors({ email: err.response?.data?.msg || "Email not found" });
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();

    if (!securityAnswer.trim()) {
      setErrors({ securityAnswer: "Please provide an answer" });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await axios.post("http://localhost:5000/forgot-password/verify-answer", {
        email: email.trim().toLowerCase(),
        securityAnswer: securityAnswer.trim(),
      });
      
      setResetToken(res.data.resetToken);
      setStep(3);
    } catch (err) {
      setErrors({ securityAnswer: err.response?.data?.msg || "Incorrect answer" });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const passwordError = validatePassword(newPassword);
    const confirmError = newPassword !== confirmPassword ? "Passwords do not match" : "";

    if (passwordError || confirmError) {
      setErrors({ newPassword: passwordError, confirmPassword: confirmError });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await axios.post("http://localhost:5000/forgot-password/reset", {
        token: resetToken,
        newPassword: newPassword,
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setErrors({ newPassword: err.response?.data?.msg || "Error resetting password" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setEmail("");
    setSecurityAnswer("");
    setNewPassword("");
    setConfirmPassword("");
    setResetToken("");
    setErrors({});
  };

  return (
    <div className={styles.pageWrapper}>
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinnerLarge}></div>
          <p className={styles.loadingText}>
            {step === 1 && "Checking email..."}
            {step === 2 && "Verifying answer..."}
            {step === 3 && "Resetting password..."}
          </p>
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
        <div className={styles.formContainer}>
          <div className={styles.progressBar}>
            <div className={`${styles.progressStep} ${step >= 1 ? styles.active : ""}`}>
              <span>1</span>
              <p>Email</p>
            </div>
            <div className={styles.progressLine}></div>
            <div className={`${styles.progressStep} ${step >= 2 ? styles.active : ""}`}>
              <span>2</span>
              <p>Verify</p>
            </div>
            <div className={styles.progressLine}></div>
            <div className={`${styles.progressStep} ${step >= 3 ? styles.active : ""}`}>
              <span>3</span>
              <p>Reset</p>
            </div>
          </div>

          <h1>Forgot Password</h1>

          {success && (
            <div className={styles.successMessage}>
              <FaCheckCircle size={50} color="#4caf50" />
              <p>Password Reset Successful!</p>
              <p>Redirecting to login...</p>
            </div>
          )}

          {!success && (
            <>
              {step === 1 && (
                <form onSubmit={handleEmailSubmit}>
                  <p className={styles.instructionText}>
                    Enter your registered email address
                  </p>

                  <h3>Email:</h3>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value.toLowerCase());
                      setErrors({});
                    }}
                    maxLength={254}
                    required
                  />
                  {errors.email && (
                    <p className={styles.errorText}>{errors.email}</p>
                  )}

                  <button type="submit" disabled={loading || !email.trim()}>
                    Continue
                  </button>

                  <div className={styles.backToLogin}>
                    <Link to="/login">← Back to Login</Link>
                  </div>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleSecuritySubmit}>
                  <p className={styles.instructionText}>
                    Answer your security question to verify your identity
                  </p>

                  <div className={styles.infoBox}>
                    <p><strong>Email:</strong> {email}</p>
                  </div>

                  <div className={styles.securityQuestionBox}>
                    <p><strong>Security Question:</strong></p>
                    <p className={styles.questionText}>
                      {SECURITY_QUESTIONS[securityQuestion]}
                    </p>
                  </div>

                  <h3>Your Answer:</h3>
                  <input
                    type="text"
                    placeholder="Enter your answer"
                    value={securityAnswer}
                    onChange={(e) => {
                      setSecurityAnswer(e.target.value);
                      setErrors({});
                    }}
                    required
                  />
                  {errors.securityAnswer && (
                    <p className={styles.errorText}>{errors.securityAnswer}</p>
                  )}

                  <button type="submit" disabled={loading || !securityAnswer.trim()}>
                    Verify Answer
                  </button>

                  <div className={styles.backToLogin}>
                    <button
                      type="button"
                      onClick={resetForm}
                      className={styles.linkButton}
                    >
                      ← Start Over
                    </button>
                  </div>
                </form>
              )}

              {step === 3 && (
                <form onSubmit={handlePasswordSubmit}>
                  <p className={styles.instructionText}>
                    Create a strong new password
                  </p>

                  <div className={styles.infoBox}>
                    <p><strong>Email:</strong> {email}</p>
                  </div>

                  <h3>New Password:</h3>
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setErrors({});
                    }}
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
                  {errors.newPassword && (
                    <p className={styles.errorText}>{errors.newPassword}</p>
                  )}

                  <h3>Confirm New Password:</h3>
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors({});
                    }}
                    maxLength={20}
                    required
                  />
                  {errors.confirmPassword && (
                    <p className={styles.errorText}>{errors.confirmPassword}</p>
                  )}

                  <button 
                    type="submit" 
                    disabled={loading || !newPassword.trim() || !confirmPassword.trim()}
                  >
                    Reset Password
                  </button>

                  <div className={styles.backToLogin}>
                    <button
                      type="button"
                      onClick={resetForm}
                      className={styles.linkButton}
                    >
                      ← Start Over
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>

      <footer className={styles.footer}>
        <small>© 2025 My App React. All rights reserved.</small>
      </footer>
    </div>
  );
}

export default ForgotPassword;

