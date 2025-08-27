import { generateToken } from "../lib/utils.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
	const { fullName, email, password } = req.body;

	try {
		if (!fullName || !email || !password) {
			return res.status(400).json({ message: "Please fill all fields!" });
		}

		if (password.length < 6) {
			return res
				.status(400)
				.json({ message: "Password must be at least 6 characters!" });
		}

		const user = await User.findOne({ email });

		if (user) {
			return res.status(400).json({ message: "Email already exists!" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPW = await bcrypt.hash(password, salt);

		const newUser = new User({
			fullName,
			email,
			password: hashedPW,
		});

		if (newUser) {
			generateToken(newUser._id, res);
			await newUser.save();
			res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
				email: newUser.email,
				profilePic: newUser.profilePic,
			});
		} else {
			res.status(400).json({ message: "Invalid User data!" });
		}
	} catch (err) {
		console.log("Error in register controller", err.message);
		res.status(500).json({ message: "Internal Server Error!" });
	}
};
export const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res
				.status(400)
				.json({ message: "Invalid email or password!" });
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		if (!isPasswordCorrect) {
			return res
				.status(400)
				.json({ message: "Invalid email or password!" });
		}

		generateToken(user._id, res);
		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			email: user.email,
			profilePic: user.profilePic,
		});
	} catch (err) {
		console.log("Error in login controller", err.message);
		res.status(500).json({ message: "Internal Server Error!" });
	}
};
export const logout = (req, res) => {
	try {
		res.clearCookie("jwt", {
			httpOnly: true,
			sameSite: "strict",
			secure: process.env.NODE_ENV !== "development",
		});
		res.status(200).json({ message: "Logged out successfully" });
	} catch (err) {
		console.log("Error in logout controller", err.message);
		res.status(500).json({ message: "Internal Server Error!" });
	}
};
