import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  favorites: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true, minlength: 6 },
    name: { type: String, required: true, trim: true },
    favorites: [{ type: Schema.Types.ObjectId, ref: "Recipe", default: [] }],
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
