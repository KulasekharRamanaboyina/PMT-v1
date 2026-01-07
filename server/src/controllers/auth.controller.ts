// import { Request, Response } from "express";
// import User from "../models/User";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export const login = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "Email and password required" });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET as string,
//       { expiresIn: "7d" }
//     );

//     res.json({
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Login failed" });
//   }
// };

// export const register = async (req: Request, res: Response) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(409).json({ message: "User already exists" });
//     }

//     // 🔐 HASH PASSWORD (THIS IS THE KEY FIX)
//     const hashedPassword = await bcrypt.hash(password, 10);


//     // Register user 
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: "ADMIN",
//       avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
//     });

//     res.status(201).json({
//       message: "User registered successfully",
//       user,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Registration failed" });
//   }
// };
import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
// import { sendEmail } from "../../utils/sendEmail";


/* ================= LOGIN ================= */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};

/* ================= REGISTER ================= */
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "ADMIN",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this email does not exist" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    await user.save();

    //  Email integration later – for now log
    // console.log(
    //   `RESET PASSWORD LINK http://localhost:3000/reset-password/${resetToken}`
    // );
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

// await sendEmail({
//   to: user.email,
//   subject: "Reset your Nexus password",
//   html: `
//     <h2>Password Reset</h2>
//     <p>You requested a password reset.</p>
//     <p>Click the link below to reset your password:</p>
//     <a href="${resetUrl}" target="_blank">Reset Password</a>
//     <p>This link is valid for 15 minutes.</p>
//   `,
// });


    res.json({
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    res.status(500).json({ message: "Forgot password failed" });
  }
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // FIX 1: password validation
    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Reset token is invalid or expired",
      });
    }

    //  FIX 2: properly hash & save
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({
      message: "Password reset successful. You can login now",
    });
  } catch (error) {
    res.status(500).json({
      message: "Reset password failed",
    });
  }
};