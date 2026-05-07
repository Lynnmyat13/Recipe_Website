import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import multer from "multer";
import User from "../models/User";
import {
  authenticate,
  createAuthToken,
  type AuthenticatedRequest,
} from "../middleware/auth";
import { uploadRecipeImage, deleteRecipeImage } from "../lib/supabase";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB for profile photos
});

const PASSWORD_RULE =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      res.status(400).json({ error: "Email, password and name are required" });
      return;
    }
    if (!PASSWORD_RULE.test(password)) {
      res.status(400).json({
        error:
          "Password must be at least 6 characters and include uppercase, lowercase, number, and special character",
      });
      return;
    }
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ error: "Email already registered" });
      return;
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, name });
    const token = createAuthToken({
      userId: String(user._id),
      role: user.role,
    });
    res.status(201).json({
      user: {
        id: String(user._id),
        email: user.email,
        name: user.name,
        role: user.role,
        profileImage: user.profileImage || "",
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }
    const token = createAuthToken({
      userId: String(user._id),
      role: user.role,
    });
    res.json({
      user: {
        id: String(user._id),
        email: user.email,
        name: user.name,
        role: user.role,
        profileImage: user.profileImage || "",
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// GET /api/auth/me - Get current user profile
router.get("/me", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({
      user: {
        id: String(user._id),
        email: user.email,
        name: user.name,
        role: user.role,
        profileImage: user.profileImage || "",
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// PUT /api/auth/profile - Update name and email
router.put("/profile", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Check if email is already taken by someone else
    if (email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ error: "Email already in use" });
    }

    user.name = name;
    user.email = email;
    await user.save();

    res.json({
      user: {
        id: String(user._id),
        email: user.email,
        name: user.name,
        role: user.role,
        profileImage: user.profileImage || "",
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// PUT /api/auth/password - Change password
router.put("/password", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new password are required" });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ error: "Incorrect current password" });

    if (!PASSWORD_RULE.test(newPassword)) {
      return res.status(400).json({
        error: "New password must be at least 6 characters and include uppercase, lowercase, number, and special character",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update password" });
  }
});

// POST /api/auth/profile-image - Upload profile photo
router.post(
  "/profile-image",
  authenticate,
  upload.single("image"),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const user = await User.findById(req.userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      // Convert buffer to Base64 string to store directly in MongoDB
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      
      user.profileImage = base64Image;
      await user.save();

      res.json({
        user: {
          id: String(user._id),
          email: user.email,
          name: user.name,
          role: user.role,
          profileImage: user.profileImage,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to upload profile image" });
    }
  }
);

export default router;
