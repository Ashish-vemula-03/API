const express = require("express");
const Recipe = require("../models/Recipe");

const router = express.Router();


// Search recipes by title (case-insensitive)
router.get("/search", async (req, res) => {
  try {
    const { title } = req.query; // Get search query

    if (!title) {
      return res.status(400).json({ message: "Please provide a title to search" });
    }

    // Search for recipes where the title contains the search term (case-insensitive)
    const recipes = await Recipe.find({ title: { $regex: title, $options: "i" } });

    if (recipes.length === 0) {
      return res.status(404).json({ message: "No recipes found!" });
    }

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


// ✅ Create Recipe (POST)
router.post("/add", async (req, res) => {
  try {
    const newRecipe = new Recipe(req.body);
    await newRecipe.save();
    res.status(201).json({ message: "Recipe added successfully!", newRecipe });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get All Recipes (GET)
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get Single Recipe by ID (GET)
router.get("/api/recipes/name/:title", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found!" });
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update Recipe (PUT)
router.put("/:id", async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRecipe) return res.status(404).json({ message: "Recipe not found!" });
    res.status(200).json({ message: "Recipe updated successfully!", updatedRecipe });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete Recipe (DELETE)
router.delete("/:id", async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!deletedRecipe) return res.status(404).json({ message: "Recipe not found!" });
    res.status(200).json({ message: "Recipe deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
