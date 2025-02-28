const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  dietPreferences: { type: String, enum: ["Vegetarian", "Vegan", "Keto", "High-Protein", "Balanced"] },
});

module.exports = mongoose.model("User", UserSchema);
