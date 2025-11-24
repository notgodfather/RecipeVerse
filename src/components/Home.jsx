// src/components/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { auth } from "../firebaseConfig";
import "./Home.css";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Listen to auth state
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(user => setCurrentUser(user));
    return unsub;
  }, []);

  useEffect(() => {
    api.get("/recipes")
      .then(res => {
        setRecipes(res.data);
        setFilteredRecipes(res.data);
      })
      .catch(() => {
        setRecipes([]);
        setFilteredRecipes([]);
      });
  }, []);

  useEffect(() => {
    let temp = [...recipes];
    if (filter === "veg") temp = temp.filter(r => r.veg);
    else if (filter === "nonveg") temp = temp.filter(r => !r.veg);
    else if (filter === "top") temp = temp.filter(r => (r.stars || 0) >= 4.8);

    if (search)
      temp = temp.filter(r =>
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        (r.description && r.description.toLowerCase().includes(search.toLowerCase()))
      );
    setFilteredRecipes(temp);
  }, [recipes, filter, search]);

  return (
    <div className="home-bg">
      <header className="home-header">
        <div className="brand">RecipeVerse</div>
        <input
          className="home-search"
          placeholder="Search delicious recipes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="user-menu" style={{display:"flex", alignItems:"center", gap:"12px"}}>
          <button
            onClick={() => navigate("/profile")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center"
            }}
            title="My Profile"
          >
            {currentUser && currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="Profile"
                width={38}
                style={{ borderRadius: "50%" }}
              />
            ) : (
              <img
                src="https://img.icons8.com/fluency/48/000000/user-male-circle--v1.png"
                alt="Profile"
                width={38}
                style={{ borderRadius: "50%" }}
              />
            )}
            <span style={{
              marginLeft: "9px",
              color: "#684a03",
              fontWeight: 600,
              fontSize: "1em"
            }}>Profile</span>
          </button>
        </div>
      </header>

      <div className="home-main">
        <aside className="home-sidebar">
          <button className={`filter-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>All</button>
          <button className={`filter-btn ${filter === "veg" ? "active" : ""}`} onClick={() => setFilter("veg")}>🌱 Veg</button>
          <button className={`filter-btn ${filter === "nonveg" ? "active" : ""}`} onClick={() => setFilter("nonveg")}>🍗 Non-Veg</button>
          <button className={`filter-btn ${filter === "top" ? "active" : ""}`} onClick={() => setFilter("top")}>⭐ Top Rated</button>
        </aside>

        <main className="recipe-feed">
          {filteredRecipes.length === 0 ? (
            <p className="no-results">No recipes found. Be the first to post!</p>
          ) : (
            filteredRecipes.map(recipe => (
              <div
                key={recipe.id}
                className="recipe-card clickable"
                onClick={() => navigate(`/recipe/${recipe.id}`)}
                tabIndex={0}
              >
                <img
                  src={
                    recipe.imageUrl ||
                    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"
                  }
                  alt={recipe.title}
                />
                <div className="card-content">
                  <h2>{recipe.title}</h2>
                  <div className="stars">
                    {Array(Math.round(recipe.stars || 5))
                      .fill()
                      .map((_, i) => (
                        <span key={i}>⭐</span>
                      ))}{" "}
                    <span className="star-num">{recipe.stars ? recipe.stars.toFixed(1) : "5.0"}</span>
                  </div>
                  <div className="desc">{recipe.description.slice(0, 60)}{recipe.description.length > 60 ? "..." : ""}</div>
                  <div className="tags">
                    {recipe.veg ? (
                      <span className="tag veg">🌱 Veg</span>
                    ) : (
                      <span className="tag nonveg">🍗 Non-Veg</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </main>

        <aside className="home-widgets">
          <div className="widget trending">
            <h4>Trending 🔥</h4>
            <p>Top recipes soon!</p>
          </div>
          <div className="widget new">
            <h4>New Recipes</h4>
            <p>Latest recipes soon!</p>
          </div>
        </aside>
      </div>

      <a href="/create-recipe">
        <button className="fab">＋</button>
      </a>
    </div>
  );
}
