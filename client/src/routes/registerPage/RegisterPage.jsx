import "./registerpage.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await apiRequest.post("/auth/register", formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registerWrapper">
      <div className="leftPane">
        <h2>Join the trusted.</h2>
        <p>Unlock opportunities. Buy, sell, and rent with ease.</p>
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Your username"
            value={formData.username}
            onChange={onChange}
            required
          />

          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={onChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Set a strong password"
            value={formData.password}
            onChange={onChange}
            required
            minLength={6}
          />

          {error && <p className="errorMsg">{error}</p>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        <p className="loginLink">
          Already a member? <Link to="/login">Sign in here</Link>
        </p>
      </div>

      <div className="rightPane">
        <img
          src="./reg.png"
          alt="Modern real estate scene"
          loading="lazy"
        />
      </div>
    </div>
  );
}

export default Register;
