const express = require("express");
const User = require("../models/User");
const Recipe = require("../models/Recipe"); // Import Recipe model
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// ✅ Add a Recipe to Favorites
router.post("/favorites/:recipeId", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const recipeId = req.params.recipeId;

    // Check if already in favorites
    if (user.favorites.includes(recipeId)) {
      return res.status(400).json({ message: "Recipe already in favorites" });
    }

    user.favorites.push(recipeId);
    await user.save();

    res.status(200).json({ message: "Recipe added to favorites!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Remove a Recipe from Favorites
router.delete("/favorites/:recipeId", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.favorites = user.favorites.filter((id) => id.toString() !== req.params.recipeId);

    await user.save();
    res.status(200).json({ message: "Recipe removed from favorites!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get All Favorite Recipes
router.get("/favorites", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    res.status(200).json(user.favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
