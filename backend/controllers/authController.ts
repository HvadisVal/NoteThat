// Imports
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Joi, { ValidationResult } from "joi";

// Project imports
import { UserModel } from "../models/userModel"; 
import { User } from "../interfaces/user";
import { connect, disconnect } from "../repository/database";

// Extend Express Request to include `user`
export interface AuthRequest extends Request {
    user?: User;
}

/**
 * Register a new user
 */
export async function registerUser(req: Request, res: Response) {
    try {
        // Validate input data
        const { error } = validateUserRegInfo(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }

        await connect();

        // Check if email already exists
        const emailExist = await UserModel.findOne({ email: req.body.email });
        if (emailExist) {
            res.status(400).json({ error: "Email already exists." });
            return;
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        // Create and save new user
        const userObject = new UserModel({
            name: req.body.name,
            email: req.body.email,
            password: hashedPass
        });

        const savedUser = await userObject.save();
        res.status(201).json({ message: "User registered successfully!", userId: savedUser._id });

    } catch (error) {
        res.status(500).send("Error while registering the user. Error: " + error);
    } finally {
        await disconnect();
    }
}

/**
 * Login an existing user
 */
export async function loginUser(req: Request, res: Response) {
    try {
        // Validate login input
        const { error } = validateUserLogInfo(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }

        await connect();
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
            res.status(400).json({ error: "Email or password is incorrect." });
            return;
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email },
            process.env.TOKEN_SECRET as string,
            { expiresIn: "2h" }
        );

        res.status(200).json({ message: "Login successful!", token });

    } catch (error) {
        res.status(500).send("Error while logging in. Error: " + error);
    } finally {
        await disconnect();
    }
}

/**
 * Middleware to verify JWT and attach user to request
 */
export const securityToken = (req: Request, res: Response, next: NextFunction): void => {
    const raw = req.get("Authorization") || req.get("auth-token") || "";
  
    console.log("🛡️ token received:", raw);
    console.log("🔐 CI JWT_SECRET (length):", process.env.JWT_SECRET?.length);
  
    if (!raw.startsWith("Bearer ")) {
      res.status(403).json({ message: "Access Denied. No token provided." });
      return;
    }
  
    const token = raw.split(" ")[1];
  

    try {
        console.log("🔐 JWT_SECRET loaded:", process.env.JWT_SECRET);
      const verified = jwt.verify(token, process.env.JWT_SECRET!);
      (req as any).user = verified;
      next();
    } catch (err) {
      console.error("❌ JWT verification error:", err);
      res.status(401).json({ error: "Invalid token" });
    }
  };
  
  
  

/**
 * Validation for user registration
 */
export function validateUserRegInfo(data: User): ValidationResult {
    const schema = Joi.object({
        name: Joi.string().min(6).max(255).required(),
        email: Joi.string().email().min(6).max(255).required(),
        password: Joi.string().min(6).max(20).required()
    });

    return schema.validate(data);
}

/**
 * Validation for user login
 */
export function validateUserLogInfo(data: User): ValidationResult {
    const schema = Joi.object({
        email: Joi.string().email().min(6).max(255).required(),
        password: Joi.string().min(6).max(20).required()
    });

    return schema.validate(data);
}
