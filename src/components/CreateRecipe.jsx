// src/components/CreateRecipe.jsx
import React, { useState } from "react";
import api from "../api";
import { auth } from "../firebaseConfig";
import "./CreateRecipe.css";

export default function CreateRecipe() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [veg, setVeg] = useState(true);
  const [stars, setStars] = useState(5);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const postRecipe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    const user = auth.currentUser;

    // Require login to post
    if (!user) {
      setLoading(false);
      setErrorMsg("You must log in to post.");
      return;
    }

    const data = {
      title,
      description,
      ingredients: ingredients.split(",").map(i => i.trim()),
      veg,
      stars: Number(stars),
      authorID: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL
    };
    try {
      await api.post("/recipes", data);
      setSuccessMsg("Recipe posted successfully!");
      setTitle("");
      setDescription("");
      setIngredients("");
      setVeg(true);
      setStars(5);
      setImage(null);
      setImagePreview(null);
    } catch (err) {
      setErrorMsg("Failed to post recipe.");
    }
    setLoading(false);
  };

  return (
    <div className="create-bg">
      <form className="create-card" onSubmit={postRecipe}>
        <h2 className="create-title">Post a New Recipe</h2>
        {/* ... all fields as previous ... */}
        <label>
          <span>Title</span>
          <input required type="text" value={title} onChange={e => setTitle(e.target.value)} />
        </label>
        <label>
          <span>Description</span>
          <textarea required value={description} onChange={e => setDescription(e.target.value)} />
        </label>
        <label>
          <span>Ingredients<span className="mini-help"> (comma separated)</span></span>
          <input required type="text" value={ingredients} onChange={e => setIngredients(e.target.value)} />
        </label>
        <div className="row">
          <label>
            <span>Type</span>
            <select value={veg ? "veg" : "nonveg"} onChange={e => setVeg(e.target.value === "veg")}>
              <option value="veg">Veg</option>
              <option value="nonveg">Non-Veg</option>
            </select>
          </label>
          <label>
            <span>Stars</span>
            <input required type="number" min="1" max="5" step="0.1" value={stars} onChange={e => setStars(e.target.value)} />
          </label>
        </div>
        <label>
          <span>Recipe Photo</span>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && <img src={imagePreview} alt="Preview" className="preview-img" />}
        </label>
        <button className="submit-btn" type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post Recipe"}
        </button>
        {successMsg && <div className="form-success">{successMsg}</div>}
        {errorMsg && <div className="form-error">{errorMsg}</div>}
      </form>
    </div>
  );
}
