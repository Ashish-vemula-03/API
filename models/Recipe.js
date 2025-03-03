const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    ingredients: [{ type: String, required: true }],
    instructions: { type: [String], required: true },
    cuisine: { type: String },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"] },
    image: { type: String }, // ✅ Stores the uploaded image path (handled via multer)
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
    // ✅ Added ratings without touching old code
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        score: { type: Number, min: 1, max: 5 },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", RecipeSchema);
