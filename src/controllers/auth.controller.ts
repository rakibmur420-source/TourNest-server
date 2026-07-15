import { Request, Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import { getAuth } from "firebase-admin/auth";
import User from "../models/User";
import { AuthRequest } from "../types";
import { isFirebaseAdminReady } from "../config/firebaseAdmin";

const generateToken = (id: string, email: string, role: string): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"],
  };
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET as string, options);
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, photoURL } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "An account with this email already exists" });
    }

    const user = await User.create({ name, email, password, photoURL });
    const token = generateToken(user._id.toString(), user.email, user.role);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, photoURL: user.photoURL, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Registration failed", error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "This account uses Google Sign-In. Please continue with Google instead.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(user._id.toString(), user.email, user.role);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, photoURL: user.photoURL, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Login failed", error: (error as Error).message });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch user", error: (error as Error).message });
  }
};

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ success: false, message: "Google ID token is required" });
    }

    if (!isFirebaseAdminReady()) {
      return res.status(503).json({
        success: false,
        message: "Google Sign-In is not configured on the server yet.",
      });
    }

    const decoded = await getAuth().verifyIdToken(idToken);
    const { email, name, picture, uid } = decoded;

    if (!email) {
      return res.status(400).json({ success: false, message: "Google account has no email" });
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      user = await User.create({
        name: name || email.split("@")[0],
        email: email.toLowerCase(),
        googleId: uid,
        photoURL: picture || "",
      });
    } else if (!user.googleId) {
      // Link existing email/password account to Google on first Google login
      user.googleId = uid;
      if (!user.photoURL && picture) user.photoURL = picture;
      await user.save();
    }

    const token = generateToken(user._id.toString(), user.email, user.role);

    res.status(200).json({
      success: true,
      message: "Google sign-in successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, photoURL: user.photoURL, role: user.role },
    });
  } catch (error) {
    res.status(401).json({ success: false, message: "Google sign-in failed", error: (error as Error).message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, photoURL } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Name cannot be empty" });
    }

    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.name = name.trim();
    if (photoURL !== undefined) user.photoURL = photoURL;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: { id: user._id, name: user.name, email: user.email, photoURL: user.photoURL, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update profile", error: (error as Error).message });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Current and new password are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to change password", error: (error as Error).message });
  }
};
