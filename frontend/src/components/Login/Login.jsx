import React, { useState, useEffect } from "react";
import "./Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "../../utils/axiosConfig";
import { useNavigate, Link } from "react-router-dom";
import TGLOGO from "../../images/tgLOGO.png";

const Login = ({ onClose, setUser }) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const checkExistingLogin = async () => {
      const token = localStorage.getItem("authToken");
      const user = localStorage.getItem("user");

      if (token && user) {
        try {
          const response = await axios.get("/api/auth/verify-token", {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.data.valid) {
            setToastMessage("Already logged in! Redirecting...");
            if (onClose && typeof onClose === 'function') {
              onClose();
            }
            setTimeout(() => {
              handlePostLoginRedirect("/student/dashboard");
            }, 500);
            return;
          }
        } catch (err) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
        }
      }
      setIsCheckingAuth(false);
    };

    checkExistingLogin();
  }, []);

  const handlePostLoginRedirect = (serverRedirectTo) => {
    const pendingCourse = localStorage.getItem('pendingCourse');
    const redirectAfterLogin = localStorage.getItem('redirectAfterLogin');

    if (pendingCourse) {
      const course = JSON.parse(pendingCourse);
      localStorage.removeItem('pendingCourse');
      navigate('/course-purchase', {
        state: {
          ...course,
          price: course.price || 30000,
          oldPrice: course.oldPrice || 120000,
          features: [
            'Complete CAT preparation material',
            'Live interactive classes',
            'Mock tests and practice sets',
            'Doubt clearing sessions',
            'Performance analysis',
            'Study materials download'
          ]
        }
      });
    } else if (redirectAfterLogin) {
      localStorage.removeItem('redirectAfterLogin');
      navigate(redirectAfterLogin);
    } else {
      navigate(serverRedirectTo || "/student/dashboard");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoggingIn) return;

    setError("");
    setToastMessage("");

    if (!phone || !password) {
      setError("Please enter your mobile number and password.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setIsLoggingIn(true);
    try {
      const response = await axios.post("/api/auth/phone/login-password", {
        phoneNumber: phone,
        password,
      });

      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (setUser && typeof setUser === 'function') {
        setUser(response.data.user);
      }

      setToastMessage("Login successful!");

      setTimeout(() => {
        if (onClose && typeof onClose === 'function') {
          onClose();
        }
        handlePostLoginRedirect(response.data.redirectTo);
      }, 1000);
    } catch (err) {
      const msg = err?.response?.data?.message || "Login failed. Please try again.";
      setError(msg);
      setTimeout(() => setError(""), 5000);
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="tllogin-fullscreen-wrapper">
        <div className="tllogin-popup" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>Loading...</div>
            <p>Checking login status...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tllogin-fullscreen-wrapper">
      <div className="tllogin-popup" onClick={(e) => e.stopPropagation()}>

        {error && (
          <div className="toast-top">
            <span>{error}</span>
            <button className="toast-close-btn" onClick={() => setError("")}>x</button>
          </div>
        )}
        {toastMessage && (
          <div className="toast-top success">{toastMessage}</div>
        )}

        <div className="tllogin-left-panel">
          <div className="tllogin-logo">
            <img src={TGLOGO} alt="TathaGat Logo" />
            <p className="tllogin-tagline">
              Access Your Personalized <br />
              <strong>Dashboard</strong> –{" "}
              <span>
                Where Preparation
                <br />
                Meets Performance.
              </span>
            </p>
          </div>
        </div>

        <div className="tllogin-right-panel">
          <div className="tllogin-box">
            <div className="tllogin-lock-icon">🔒</div>
            <h2>Welcome Back</h2>
            <p>Login to your account</p>

            <form onSubmit={handleLogin}>
              <input
                type="tel"
                placeholder="Mobile Number"
                className="tlotp-input"
                value={phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setPhone(val);
                }}
                maxLength={10}
              />

              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="tlotp-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    color: '#888',
                    fontSize: '16px',
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button
                type="submit"
                className="tllogin-btn"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="help-text" style={{ marginTop: '20px' }}>
              Don't have an account?{" "}
              <Link to="/signup" style={{ color: '#d3544b', fontWeight: 600, textDecoration: 'none' }}>
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
