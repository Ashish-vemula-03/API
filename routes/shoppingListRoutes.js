// routes/shoppingListRoutes.js
const express = require("express");
const router = express.Router();
const ShoppingList = require("../models/ShoppingList");
const MealPlan = require("../models/MealPlan");

// Generate Shopping List from Meal Plan
router.post("/generate/:userId/:week", async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOne({ user: req.params.userId, week: req.params.week }).populate("days.recipes");

    if (!mealPlan) return res.status(404).json({ message: "Meal plan not found" });

    let ingredientsMap = {};

    mealPlan.days.forEach(day => {
      day.recipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => {
          if (ingredientsMap[ingredient]) {
            ingredientsMap[ingredient] += 1; // Counting duplicates
          } else {
            ingredientsMap[ingredient] = 1;
          }
        });
      });
    });

    const shoppingList = new ShoppingList({
      user: req.params.userId,
      week: req.params.week,
      ingredients: Object.keys(ingredientsMap).map(name => ({ name, quantity: ingredientsMap[name].toString() })),
    });

    await shoppingList.save();
    res.status(201).json({ message: "Shopping list generated", shoppingList });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Shopping List
router.get("/:userId/:week", async (req, res) => {
  try {
    const shoppingList = await ShoppingList.findOne({ user: req.params.userId, week: req.params.week });
    res.status(200).json(shoppingList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

