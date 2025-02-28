const mongoose = require("mongoose");
const Recipe = require("./models/recipeModel");
const fs = require("fs");
const path = require("path");

// Connect to MongoDB
mongoose.connect("mongodb+srv://apimate:apimate@api.u4z67.mongodb.net/?retryWrites=true&w=majority&appName=api", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ Database Connected"))
  .catch(err => console.error("❌ DB Connection Error:", err));

// Load JSON data (Ensure correct path)
const filePath = path.join(__dirname, "recipes.json");
if (!fs.existsSync(filePath)) {
  console.error("❌ Error: recipes.json file not found!");
  process.exit(1);
}

const recipes = JSON.parse(fs.readFileSync(filePath, "utf-8"));
console.log("📄 Recipe Data Before Saving:", JSON.stringify(recipes, null, 2)); // ✅ Fixed here

// Bulk Insert
const importData = async () => {
  try {
    await Recipe.insertMany(recipes);
    console.log("🎉 Recipes Imported Successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

// Run import function
importData();
