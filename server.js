const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Recipe = require("./models/Recipe");
const Ingredient = require("./models/Ingredient");
const User = require("./models/User");
const MealPlan = require("./models/MealPlan");
const recipeRoutes = require("./routes/recipeRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// Test Route
app.get("/", (req, res) => {
  res.send("Welcome to the Indian Recipe API! 🍛");
});

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));



app.use("/api/recipes", recipeRoutes);