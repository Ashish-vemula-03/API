const mongoose = require("mongoose");

const MealPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  breakfast: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
  lunch: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
  dinner: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
});

module.exports = mongoose.model("MealPlan", MealPlanSchema);
