import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { auth } from "../firebaseConfig"; // ADDED for currentUser
import "./RecipeDetail.css";

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [rating, setRating] = useState(0);

  // "rated" disables further voting by this user in this session
  const [rated, setRated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch recipe by ID
  useEffect(() => {
    api.get(`/recipes/${id}`)
      .then(res => {
        setRecipe(res.data);
        setLoading(false);

        // If current user has already rated, show it
        const userId = auth.currentUser?.uid;
        if (userId && res.data.ratings && res.data.ratings[userId]) {
          setRating(res.data.ratings[userId]);
          setRated(true);
        } else {
          setRated(false);
          setRating(0);
        }
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Submit rating
  const handleRate = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in with Google to rate!");
      return;
    }
    if (rating < 1 || rating > 5) return;
    try {
      await api.patch(`/recipes/${id}/rate`, {
        userId: user.uid,
        rating
      });
      setRated(true);

      // Re-fetch recipe to update community average and UI
      const { data } = await api.get(`/recipes/${id}`);
      setRecipe(data);
    } catch (err) {
      alert("Failed to submit rating.");
    }
  };

  if (loading) return <div className="detail-bg"><p>Loading...</p></div>;
  if (!recipe) return <div className="detail-bg"><p>Recipe not found.</p></div>;

  // Compute average for safety (should already be precomputed but for UI fallback)
  const computeAvg = ratings => {
    if (!ratings) return 5;
    const values = Object.values(ratings);
    if (values.length === 0) return 5;
    return values.reduce((a, b) => a + b, 0) / values.length;
  };
  const avg = recipe.stars || computeAvg(recipe.ratings);

  return (
    <div className="detail-bg">
      <div className="detail-card">
        <img className="detail-img" src={recipe.imageUrl || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=560&q=80"} alt={recipe.title} />
        <div className="detail-content">
          <h1>
            {recipe.title}{" "}
            {recipe.veg ? <span className="tag veg">🌱 Veg</span> : <span className="tag nonveg">🍗 Non-Veg</span>}
          </h1>
          <p className="detail-desc">{recipe.description}</p>
          <div>
            <b>Ingredients:</b>
            <ul>
              {recipe.ingredients && recipe.ingredients.map((ing, idx) => <li key={idx}>{ing}</li>)}
            </ul>
          </div>
          {/* Add steps/how-to-prep in schema later */}
          <div className="detail-rating">
            <span>Community Rating: </span>
            <span>
              {Array(Math.round(avg)).fill().map((_, i) => (<span key={i}>⭐</span>))}
              {" "}
              <span className="star-num">{avg.toFixed(1)}</span>
            </span>
          </div>
          <div className="detail-user-rate">
            <span>Your Rating:</span>
            {[1,2,3,4,5].map(num =>
              <span
                className={rating >= num ? "user-star active" : "user-star"}
                style={{cursor: rated ? "not-allowed" : "pointer"}}
                key={num}
                onClick={() => !rated && setRating(num)}
              >⭐</span>
            )}
            {rating > 0 && !rated && (
              <button className="rate-btn" onClick={handleRate}>Submit Rating</button>
            )}
            {rated && <span className="thanks-msg">Thank you for rating!</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
