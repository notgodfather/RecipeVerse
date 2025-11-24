import React, { useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import api from "../api";

export default function MyProfile() {
  const [userData, setUserData] = useState(null);
  const [myRecipes, setMyRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        // User profile info
        const userRes = await api.get(`/recipes/user/${user.uid}`);
        setUserData(userRes.data);

        // All recipes, filter by authorID for "My Recipes"
        const recipeRes = await api.get("/recipes");
        setMyRecipes(recipeRes.data.filter(x => x.authorID === user.uid));
        setFavorites(recipeRes.data.filter(x => (userRes.data.favorites || []).includes(x.id)));
      } catch (err) {
        setUserData(null);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    auth.signOut();
    window.location.href = "/";
  };

  if (loading) return <div style={{textAlign:"center",marginTop:"60px"}}>Loading profile...</div>;
  const user = auth.currentUser;
  if (!user) return <div style={{textAlign:"center",marginTop:"60px"}}>Please log in with Google to view your profile.</div>;

  return (
    <div style={{maxWidth: "800px", margin: "40px auto", padding: "30px"}}>
      <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "32px" }}>
        <img src={user.photoURL} alt={user.displayName} width={90} style={{borderRadius: "50%", border: "3px solid #FFD17E"}} />
        <div>
          <h2 style={{margin: "0 0 5px 0"}}>{user.displayName}</h2>
          <div style={{color: "#444"}}>{user.email}</div>
          <button
            style={{
              marginTop: "16px",
              background: "linear-gradient(90deg, #ffb900, #ff6c29 90%)",
              color: "#fff",
              border: "none",
              borderRadius: "15px",
              padding: "10px 26px",
              fontWeight: 700,
              fontSize: "1.05em",
              boxShadow: "0 2px 10px #ffb15b50",
              cursor: "pointer"
            }}
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </div>

      <h3 style={{borderBottom: "2px solid #fff3d9", paddingBottom: "7px"}}>My Recipes</h3>
      {myRecipes.length === 0 ? (
        <div style={{color: "#d47b04", margin: "17px 0 25px 0"}}>You haven't posted any recipes yet.</div>
      ) : (
        <ul>
          {myRecipes.map(r => (
            <li key={r.id} style={{marginBottom: "7px"}}>
              <a href={`/recipe/${r.id}`} style={{textDecoration: "none", color: "#FF8C3A"}}>{r.title}</a>
            </li>
          ))}
        </ul>
      )}

      <h3 style={{borderBottom: "2px solid #fff3d9", paddingBottom: "7px", marginTop: "36px"}}>Favorites</h3>
      {favorites.length === 0 ? (
        <div style={{color: "#c9271d", margin: "17px 0"}}>No favorites yet. Bookmark recipes you love!</div>
      ) : (
        <ul>
          {favorites.map(r => (
            <li key={r.id} style={{marginBottom: "7px"}}>
              <a href={`/recipe/${r.id}`} style={{textDecoration: "none", color: "#27c947"}}>{r.title}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
