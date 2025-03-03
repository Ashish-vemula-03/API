const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const cron = require("node-cron");
const multer = require("multer");
const path = require("path");

const Recipe = require("./models/Recipe");
const Ingredient = require("./models/Ingredient");
const User = require("./models/User");
const MealPlan = require("./models/MealPlan");
const recipeRoutes = require("./routes/recipeRoutes");
const favoritesRoutes = require("./routes/favoritesRoutes");
const recommendations = require("./routes/recommendations");
const nutrition = require("./routes/nutrition");
const shoppingListRoutes = require("./routes/shoppingListRoutes");
const mealPlanRoutes = require("./routes/mealPlanRoutes");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/recommendations", recommendations);
app.use("/api/nutrition", nutrition);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/shopping-list", shoppingListRoutes);
app.use("/api/meal-plan", mealPlanRoutes);


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


  // ✅ Daily at midnight (00:00)
cron.schedule("0 0 * * *", async () => {
  console.log("Running daily recommendation refresh...");
  
  try {
    const users = await User.find();

    for (const user of users) {
      const favoriteCuisines = user.favorites.map(recipe => recipe.cuisine).filter(Boolean);
      const favoriteCategories = user.favorites.map(recipe => recipe.category).filter(Boolean);

      const newRecommendations = await Recipe.find({
        $or: [
          { cuisine: { $in: favoriteCuisines } },
          { category: { $in: favoriteCategories } },
        ],
        _id: { $nin: user.favorites },
      }).limit(10);

      // Optionally, save precomputed recommendations into User model:
      user.recommendations = newRecommendations.map(recipe => recipe._id);
      await user.save();
    }
    console.log("Daily recommendations updated.");
  } catch (error) {
    console.error("Error updating recommendations:", error);
  }
});


app.use("/api/recipes", recipeRoutes);