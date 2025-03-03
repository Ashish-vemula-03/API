const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }], // Reference to Recipe Model
  dietPreferences: { 
    type: String, 
    enum: ["Vegetarian", "Vegan", "Keto", "High-Protein", "Balanced"] 
  },
  recommendations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }], // Reference to Recipe Model
  allergies: [{ type: String }],
  shoppingList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" }], // Reference to Ingredient Model 
  mealPlans: [{ type: mongoose.Schema.Types.ObjectId, ref: "MealPlan" }], // Reference to MealPlan Model

});

module.exports = mongoose.model("User", UserSchema);
