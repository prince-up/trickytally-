import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Side: Premium Card Game Image */}
      <div style={styles.imageSection}>
        <div style={styles.imageOverlay}>
          <div style={styles.imageContent}>
            <h1 style={styles.brandTitle}>🃏 TrickTally</h1>
            <p style={styles.brandTagline}>The Ultimate Call Break Experience</p>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div style={styles.formSection}>
        <div style={styles.card}>
          <div style={styles.mobileHeader}>
            <h1 style={styles.title}>🃏 TrickTally</h1>
          </div>
          <h2 style={styles.subtitle}>Welcome Back</h2>
          <p style={styles.formInstruction}>Please login to your account to continue</p>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Logging in..." : "Login to Dashboard →"}
            </button>
          </form>

          <p style={styles.footer}>
            Don't have an account?{" "}
            <Link to="/signup" style={styles.link}>
              Create one for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    display: "flex",
    backgroundColor: "#0a2e1c", // Deep forest green
    fontFamily: "'Inter', sans-serif",
  },
  imageSection: {
    flex: 1,
    backgroundImage: "url('/auth_banner.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "none", // Hide on mobile
    position: "relative",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(10, 46, 28, 0.4)", // Tint to match theme
    display: "flex",
    alignItems: "flex-end",
    padding: "4rem",
  },
  imageContent: {
    color: "#ffffff",
    textShadow: "0 4px 12px rgba(0,0,0,0.5)",
  },
  brandTitle: {
    fontSize: "3.5rem",
    fontWeight: "800",
    margin: 0,
    color: "#ffd700", // Gold
  },
  brandTagline: {
    fontSize: "1.2rem",
    margin: "0.5rem 0 0 0",
    opacity: 0.9,
  },
  formSection: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    backgroundColor: "#0a2e1c",
  },
  mobileHeader: {
    display: "none",
    textAlign: "center",
    marginBottom: "1rem",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(10px)",
    padding: "3rem",
    borderRadius: "24px",
    border: "1px solid rgba(255, 215, 0, 0.2)", // Subtle gold border
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    width: "100%",
    maxWidth: "460px",
  },
  title: {
    fontSize: "2.2rem",
    color: "#ffd700",
    fontWeight: "800",
    margin: 0,
  },
  subtitle: {
    fontSize: "1.8rem",
    color: "#ffffff",
    fontWeight: "700",
    marginBottom: "0.5rem",
  },
  formInstruction: {
    color: "#b8e6d5",
    marginBottom: "2rem",
    fontSize: "0.95rem",
  },
  error: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    color: "#f87171",
    padding: "1rem",
    borderRadius: "12px",
    marginBottom: "1.5rem",
    fontSize: "0.9rem",
    border: "1px solid rgba(239, 68, 68, 0.2)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    fontSize: "0.9rem",
    color: "#ffd700",
    fontWeight: "600",
    marginLeft: "0.2rem",
  },
  input: {
    width: "100%",
    padding: "1rem 1.25rem",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    border: "2px solid rgba(255, 215, 0, 0.1)",
    borderRadius: "14px",
    fontSize: "1rem",
    color: "#ffffff",
    outline: "none",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
  },
  button: {
    backgroundColor: "#ffd700",
    color: "#0a2e1c",
    padding: "1.1rem",
    border: "none",
    borderRadius: "14px",
    fontSize: "1.1rem",
    fontWeight: "800",
    cursor: "pointer",
    marginTop: "1rem",
    transition: "all 0.3s ease",
    boxShadow: "0 10px 15px -3px rgba(255, 215, 0, 0.3)",
  },
  footer: {
    textAlign: "center",
    marginTop: "2.5rem",
    color: "#b8e6d5",
    fontSize: "0.95rem",
  },
  link: {
    color: "#ffd700",
    textDecoration: "none",
    fontWeight: "700",
  },
};

// Media query logic via window size in real apps, 
// but for static styles we rely on the flexbox behavior
if (typeof window !== 'undefined' && window.innerWidth > 1024) {
  (styles.imageSection as any).display = 'block';
  (styles.mobileHeader as any).display = 'none';
} else if (typeof window !== 'undefined') {
  (styles.mobileHeader as any).display = 'block';
}


export default Login;
