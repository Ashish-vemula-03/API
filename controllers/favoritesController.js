const mongoose = require("mongoose");
const User = require("../models/User");
const Recipe = require("../models/Recipe");

// ✅ Add a recipe to favorites
const addFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const { recipeId } = req.params;

    // Validate recipeId format
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return res.status(400).json({ message: "Invalid recipe ID format." });
    }

    // Check if recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Ensure `favorites` field exists (avoiding null errors)
    if (!Array.isArray(user.favorites)) {
      user.favorites = [];
    }

    // Convert recipeId to ObjectId for consistency
    const recipeObjectId = new mongoose.Types.ObjectId(recipeId);

    // Check if the recipe is already in favorites
    if (user.favorites.some(fav => fav.equals(recipeObjectId))) {
      return res.status(400).json({ message: "Recipe already in favorites." });
    }

    // Add recipe to favorites & save user
    user.favorites.push(recipeObjectId);
    await user.save();

    res.status(200).json({ message: "Recipe added to favorites!", favorites: user.favorites });
  } catch (error) {
    console.error("Error adding to favorites:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get all favorite recipes of a user with pagination & search
const getFavorites = async (req, res) => {
  try {
    const userId = req.user._id;
    const { search = "", page = 1, limit = 10 } = req.query; // Default pagination values

    // Find user & populate favorites with pagination & search
    const user = await User.findById(userId)
      .populate({
        path: "favorites",
        match: search ? { name: { $regex: search, $options: "i" } } : {}, // Search by name (case-insensitive)
        select: "name description imageUrl createdAt updatedAt", // Select specific fields
        options: { sort: { createdAt: -1 }, skip: (page - 1) * limit, limit: parseInt(limit) }, // Pagination
      });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Handle empty favorites list
    if (!user.favorites || user.favorites.length === 0) {
      return res.status(200).json({ message: "No favorite recipes found.", favorites: [] });
    }

    res.status(200).json({ 
      favorites: user.favorites,
      pagination: {
        currentPage: parseInt(page),
        pageSize: parseInt(limit),
        totalFavorites: user.favorites.length
      }
    });
  } catch (error) {
    console.error("Error fetching favorites:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Remove a recipe from favorites
const removeFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const { recipeId } = req.params;

    // Validate recipeId format
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return res.status(400).json({ message: "Invalid recipe ID format." });
    }

    // Find the user and remove the recipe from favorites
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { favorites: recipeId } }, // Remove from favorites
      { new: true }
    ).populate("favorites", "name description imageUrl createdAt updatedAt");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "Recipe removed from favorites.", favorites: user.favorites });
  } catch (error) {
    console.error("Error removing favorite:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addFavorite, getFavorites, removeFavorite };
