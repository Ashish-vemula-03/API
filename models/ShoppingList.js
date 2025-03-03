// models/ShoppingList.js
const mongoose = require("mongoose");

const ShoppingListSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  week: { type: String, required: true },
  ingredients: [{ name: String, quantity: String }],
}, { timestamps: true });

module.exports = mongoose.model("ShoppingList", ShoppingListSchema);
