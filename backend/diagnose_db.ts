import "dotenv/config";
import mongoose from "mongoose";
import Recipe from "./src/models/Recipe";

async function diagnose() {
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/recipe_web";
  console.log("Connecting to:", MONGODB_URI.replace(/:[^:]+@/, ":****@"));

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully");

    console.log("Model collection name:", Recipe.collection.name);
    const count = await Recipe.countDocuments({});
    console.log(`Total recipes in '${Recipe.collection.name}' collection:`, count);

    // Count by category
    const categories = await Recipe.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);
    console.log("Recipes by category:", categories);

    if (count > 0) {
      const sample = await Recipe.findOne().lean();
      console.log("Sample recipe:", JSON.stringify(sample, null, 2));
    }

    // Check all collections in the database
    const db = mongoose.connection.db;
    if (db) {
      const collections = await db.listCollections().toArray();
      console.log("Available collections:", collections.map(c => c.name));

      for (const col of collections) {
        const cCount = await db.collection(col.name).countDocuments();
        console.log(`Collection '${col.name}' count:`, cCount);
      }
    }

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

diagnose();
