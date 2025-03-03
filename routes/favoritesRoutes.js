const express = require("express");
const User = require("../models/User");
const Recipe = require("../models/Recipe");
const authMiddleware = require("../middlewares/authMiddleware");
const { addFavorite, getFavorites } = require("../controllers/favoritesController");


const router = express.Router();

// ✅ Add Recipe to Favorites
router.post("/favorites/:recipeId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { recipeId } = req.params;

    // 🔍 Check if the recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found!" });
    }

    // 🔍 Find user & update favorites
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // ✅ Add recipe to favorites if not already added
    if (!user.favorites.includes(recipeId)) {
      user.favorites.push(recipeId);
      await user.save();
      return res.status(200).json({ message: "Recipe added to favorites!", favorites: user.favorites });
    }

    res.status(400).json({ message: "Recipe is already in favorites!" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
