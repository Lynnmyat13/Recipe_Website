import mongoose, { Document, Schema } from "mongoose";

export type UserRole = "admin" | "user";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  profileImage?: string;
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
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      required: true,
    },
    profileImage: { type: String, default: "" },
    favorites: [{ type: Schema.Types.ObjectId, ref: "Recipe", default: [] }],
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
