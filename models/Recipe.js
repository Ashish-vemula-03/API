const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    ingredients: [{ type: String, required: true }], // ✅ Accepts an array of strings
    instructions: { type: [String], required: true },  // ✅ Correctly expects an array of strings
    image: { type: String }, // Optional
    category: { type: String },
    prepTime: { type: Number },
    cookTime: { type: Number },
    servings: { type: Number },
    nutrition: {
      calories: { type: Number },
      protein: { type: Number },
      fat: { type: Number },
      carbs: { type: Number },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", RecipeSchema);
