import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebaseConfig";
import { signInWithPopup } from "firebase/auth";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/home");
    } catch (err) {
      alert("Login failed!");
    }
  };

  return (
    <div className="landing-bg">
      <header className="landing-header">
        <div className="brand">
          <img
            src="https://img.icons8.com/color/48/000000/salad.png"
            alt="Logo"
          />
          <span>RecipeVerse</span>
        </div>
        <nav>
          <a>Home</a>
          <a>About</a>
          <a>Explore</a>
          <a>Contact</a>
        </nav>
      </header>

      <section className="main-hero">
        <div className="left-col">
          <h1>
            Discover &amp;<br />
            <span className="highlight">Share</span> Recipes
          </h1>
          <p>
            The modern recipe community: Share, browse, and rate brilliant dishes
            with beautiful photos and full nutrition info.<br />
            <b>Join foodies &amp; chefs in your college and beyond!</b>
          </p>
          <button className="google-btn" onClick={handleGoogleLogin}>
            <img
              className="g-icon"
              src="https://img.icons8.com/color/48/000000/google-logo.png"
              alt="Google"
            />
            Sign in with Google
          </button>
        </div>
        <div className="right-col">
          <img
            className="hero-food-img"
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=560&q=80"
            alt="Food"
          />
          <div className="mini-cards">
            <div className="mini-card" style={{ background: "#cbe7fc" }}>
              <b>🌱 Veg</b>
            </div>
            <div className="mini-card" style={{ background: "#faeed6" }}>
              <b>🍗 Non-veg</b>
            </div>
            <div className="mini-card" style={{ background: "#eae9f5" }}>
              <span role="img" aria-label="star">⭐</span> 4.9+ Rated
            </div>
          </div>
        </div>
      </section>

      <section className="feature-section">
        <div className="feature-card" style={{ background: "#f7e4e4" }}>
          <img src="https://img.icons8.com/emoji/48/000000/green-apple.png" />
          <span>Nutrition break-down<br />for every recipe</span>
        </div>
        <div className="feature-card" style={{ background: "#e1f9e2" }}>
          <img src="https://img.icons8.com/emoji/48/000000/red-heart.png" />
          <span>Like, star, or bookmark<br />what you love</span>
        </div>
        <div className="feature-card" style={{ background: "#fff4c1" }}>
          <img src="https://img.icons8.com/emoji/48/000000/cooking.png" />
          <span>Post step-by-step dishes<br />with images</span>
        </div>
      </section>
    </div>
  );
}
