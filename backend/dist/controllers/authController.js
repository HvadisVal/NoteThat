"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityToken = void 0;
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.validateUserRegInfo = validateUserRegInfo;
exports.validateUserLogInfo = validateUserLogInfo;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const joi_1 = __importDefault(require("joi"));
// Project imports
const userModel_1 = require("../models/userModel");
const database_1 = require("../repository/database");
/**
 * Register a new user
 */
function registerUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Validate input data
            const { error } = validateUserRegInfo(req.body);
            if (error) {
                res.status(400).json({ error: error.details[0].message });
                return;
            }
            yield (0, database_1.connect)();
            // Check if email already exists
            const emailExist = yield userModel_1.UserModel.findOne({ email: req.body.email });
            if (emailExist) {
                res.status(400).json({ error: "Email already exists." });
                return;
            }
            // Hash the password
            const salt = yield bcrypt_1.default.genSalt(10);
            const hashedPass = yield bcrypt_1.default.hash(req.body.password, salt);
            // Create and save new user
            const userObject = new userModel_1.UserModel({
                name: req.body.name,
                email: req.body.email,
                password: hashedPass
            });
            const savedUser = yield userObject.save();
            res.status(201).json({ message: "User registered successfully!", userId: savedUser._id });
        }
        catch (error) {
            res.status(500).send("Error while registering the user. Error: " + error);
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
/**
 * Login an existing user
 */
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Validate login input
            const { error } = validateUserLogInfo(req.body);
            if (error) {
                res.status(400).json({ error: error.details[0].message });
                return;
            }
            yield (0, database_1.connect)();
            const user = yield userModel_1.UserModel.findOne({ email: req.body.email });
            if (!user || !(yield bcrypt_1.default.compare(req.body.password, user.password))) {
                res.status(400).json({ error: "Email or password is incorrect." });
                return;
            }
            // Generate JWT token
            const token = jsonwebtoken_1.default.sign({ id: user.id, name: user.name, email: user.email }, process.env.TOKEN_SECRET, { expiresIn: "2h" });
            res.status(200).json({ message: "Login successful!", token });
        }
        catch (error) {
            res.status(500).send("Error while logging in. Error: " + error);
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
/**
 * Middleware to verify JWT and attach user to request
 */
const securityToken = (req, res, next) => {
    var _a;
    const raw = req.get("Authorization") || req.get("auth-token") || "";
    console.log("🛡️ token received:", raw);
    console.log("🔐 CI JWT_SECRET (length):", (_a = process.env.JWT_SECRET) === null || _a === void 0 ? void 0 : _a.length);
    if (!raw.startsWith("Bearer ")) {
        res.status(403).json({ message: "Access Denied. No token provided." });
        return;
    }
    const token = raw.split(" ")[1];
    try {
        console.log("🔐 JWT_SECRET loaded:", process.env.JWT_SECRET);
        const verified = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    }
    catch (err) {
        console.error("❌ JWT verification error:", err);
        res.status(401).json({ error: "Invalid token" });
    }
};
exports.securityToken = securityToken;
/**
 * Validation for user registration
 */
function validateUserRegInfo(data) {
    const schema = joi_1.default.object({
        name: joi_1.default.string().min(6).max(255).required(),
        email: joi_1.default.string().email().min(6).max(255).required(),
        password: joi_1.default.string().min(6).max(20).required()
    });
    return schema.validate(data);
}
/**
 * Validation for user login
 */
function validateUserLogInfo(data) {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().min(6).max(255).required(),
        password: joi_1.default.string().min(6).max(20).required()
    });
    return schema.validate(data);
}
