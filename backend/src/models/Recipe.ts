import mongoose, { Document, Schema } from "mongoose";

export interface IRecipe extends Document {
  recipe_name: string;
  category: string;
  ingredients: string;
  cooking_time_minutes: number;
  instructions: string;
  calories_per_serving: number;
  imageName: string;
}

const recipeSchema = new Schema<IRecipe>(
  {
    recipe_name: { type: String, required: true, trim: true, unique: true },
    category: { type: String, required: true, trim: true },
    ingredients: { type: String, required: true },
    cooking_time_minutes: { type: Number, required: true, min: 1 },
    instructions: { type: String, required: true, trim: true },
    calories_per_serving: { type: Number, required: true, min: 0 },
    imageName: { type: String, required: false, trim: true, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model<IRecipe>("Recipe", recipeSchema);
