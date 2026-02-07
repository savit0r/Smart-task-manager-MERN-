import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = express.Router();

// Validation helper functions
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    // At least 8 characters, one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
};

const validateName = (name) => {
    // 2-50 characters, letters and spaces only
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    return nameRegex.test(name.trim());
};

// POST /auth/register
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Basic field presence check
        if (!name || !email || !password) {
            console.log("❌ Validation failed: Missing required fields");
            return res.status(400).json({ 
                message: "All fields (name, email, password) are required",
                error: "MISSING_FIELDS"
            });
        }

        // Name validation
        if (!validateName(name)) {
            console.log("❌ Validation failed: Invalid name format");
            return res.status(400).json({ 
                message: "Name must be 2-50 characters and contain only letters and spaces",
                error: "INVALID_NAME"
            });
        }

        // Email validation
        if (!validateEmail(email)) {
            console.log("❌ Validation failed: Invalid email format");
            return res.status(400).json({ 
                message: "Please provide a valid email address",
                error: "INVALID_EMAIL"
            });
        }

        // Password validation
        if (!validatePassword(password)) {
            console.log("❌ Validation failed: Weak password");
            return res.status(400).json({ 
                message: "Password must be at least 8 characters with uppercase, lowercase, and number",
                error: "WEAK_PASSWORD"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            console.log("❌ User already exists with email:", email);
            return res.status(400).json({ 
                message: "User with this email already exists",
                error: "USER_EXISTS"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Response without password
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        };

        console.log("✅ User registered successfully:", userResponse);
        return res.status(201).json({ 
            message: "User registered successfully", 
            user: userResponse,
            token 
        });
    } catch (error) {
        console.error("💥 Server error during registration:", error);
        
        // Handle specific MongoDB errors
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: "User with this email already exists",
                error: "DUPLICATE_EMAIL"
            });
        }
        
        return res.status(500).json({ 
            message: "Internal server error during registration",
            error: "SERVER_ERROR"
        });
    }
});

// POST /auth/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic field presence check
        if (!email || !password) {
            console.log("❌ Login failed: Missing credentials");
            return res.status(400).json({ 
                message: "Email and password are required",
                error: "MISSING_CREDENTIALS"
            });
        }

        // Email format validation
        if (!validateEmail(email)) {
            console.log("❌ Login failed: Invalid email format");
            return res.status(400).json({ 
                message: "Please provide a valid email address",
                error: "INVALID_EMAIL"
            });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            console.log("❌ Login failed: User not found");
            return res.status(401).json({ 
                message: "Invalid email or password",
                error: "INVALID_CREDENTIALS"
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Login failed: Password mismatch");
            return res.status(401).json({ 
                message: "Invalid email or password",
                error: "INVALID_CREDENTIALS"
            });
        }

        // Generate JWT token
        const payload = {
            user: {
                id: user._id,
            },
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        console.log("✅ User logged in successfully:", { id: user._id, email: user.email });
        return res.json({
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("💥 Server error during login:", error);
        return res.status(500).json({ 
            message: "Internal server error",
            error: "SERVER_ERROR"
        });
    }
});

// GET /auth/me - Get current user
router.get("/me", async (req, res) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ 
                message: "No token provided",
                error: "NO_TOKEN"
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ 
                message: "User not found",
                error: "USER_NOT_FOUND"
            });
        }

        return res.json({ user });
    } catch (error) {
        console.error("💥 Auth verification error:", error);
        return res.status(401).json({ 
            message: "Invalid or expired token",
            error: "INVALID_TOKEN"
        });
    }
});

export default router;

