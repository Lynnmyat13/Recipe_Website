import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { UserRole } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userRole?: UserRole;
}

export interface AuthTokenPayload {
  userId: string;
  role: UserRole;
}

export function createAuthToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    const authReq = req as AuthenticatedRequest;
    authReq.userId = payload.userId;
    authReq.userRole = payload.role ?? "user";
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authReq = req as AuthenticatedRequest;

  if (authReq.userRole !== "admin") {
    res.status(403).json({ error: "Admin access required" });
    return;
  }

  next();
};
