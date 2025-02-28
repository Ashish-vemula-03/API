const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: { type: [String], required: true },
  instructions: { type: [String], required: true }, // ✅ Change this to an array
  image: { type: String },
  category: { type: String },
  prepTime: { type: Number },
  cookTime: { type: Number },
  servings: { type: Number },
  nutrition: {
    calories: Number,
    protein: Number,
    fat: Number,
    carbs: Number,
  }
});

module.exports = mongoose.model("Recipe", RecipeSchema);
