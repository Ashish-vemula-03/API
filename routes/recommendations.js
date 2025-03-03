const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Recipe = require("../models/Recipe");

// ✅ Similarity scoring function
function calculateSimilarity(recipe, favoriteCuisines, favoriteCategories, favoriteIngredients) {
  let score = 0;

  if (favoriteCuisines.includes(recipe.cuisine)) score += 3;
  if (favoriteCategories.includes(recipe.category)) score += 2;

  const sharedIngredients = recipe.ingredients.filter(ing =>
    favoriteIngredients.includes(ing)
  );
  score += sharedIngredients.length; // 1 point per shared ingredient

  // Bonus for high average rating
  if (recipe.ratings.length > 0) {
    const avgRating =
      recipe.ratings.reduce((acc, r) => acc + r.score, 0) / recipe.ratings.length;
    score += avgRating; // Add average rating directly to score
  }

  return score;
}

// GET /api/recommendations/:userId
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).populate("favorites");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let recommendations = [];

    if (user.favorites.length > 0) {
      const favoriteCuisines = user.favorites.map(r => r.cuisine).filter(Boolean);
      const favoriteCategories = user.favorites.map(r => r.category).filter(Boolean);
      const favoriteIngredients = user.favorites.flatMap(r => r.ingredients);

      let potentialRecipes = await Recipe.find({
        $or: [
          { cuisine: { $in: favoriteCuisines } },
          { category: { $in: favoriteCategories } },
        ],
        _id: { $nin: user.favorites.map(fav => fav._id) },
      });

      // ✅ Score and sort recipes
      recommendations = potentialRecipes
        .map(recipe => {
          const score = calculateSimilarity(recipe, favoriteCuisines, favoriteCategories, favoriteIngredients);
          return {
            ...recipe._doc,
            similarityScore: score,
            reason: `Matched on ${
              favoriteCuisines.includes(recipe.cuisine) ? `cuisine: ${recipe.cuisine}` : ''
            } ${
              favoriteCategories.includes(recipe.category) ? `category: ${recipe.category}` : ''
            } with shared ingredients: ${
              recipe.ingredients.filter(ing => favoriteIngredients.includes(ing)).join(", ")
            }`,
          };
        })
        .sort((a, b) => b.similarityScore - a.similarityScore)
        .slice(0, 10);
    }

    // Fallback: Latest trending recipes
    if (recommendations.length === 0) {
      const trendingRecipes = await Recipe.find()
        .sort({ createdAt: -1 })
        .limit(10);

      recommendations = trendingRecipes.map(recipe => ({
        ...recipe._doc,
        similarityScore: 0,
        reason: "Trending recipe based on latest uploads.",
      }));
    }

    // Final Fallback: Random recipes
    if (recommendations.length === 0) {
      const randomRecipes = await Recipe.aggregate([{ $sample: { size: 10 } }]);
      recommendations = randomRecipes.map(recipe => ({
        ...recipe,
        similarityScore: 0,
        reason: "Random recipe selection.",
      }));
    }

    res.status(200).json(recommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
