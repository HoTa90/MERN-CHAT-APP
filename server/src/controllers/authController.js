import { generateToken } from "../lib/utils.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
	const { fullName, email, password } = req.body;

	try {

		if (!fullName || !email || !password){
			return res
				.status(400)
				.json({ message: "Please fill all fields!" });
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
		console.log('Error in register controller', err.message);
		res.status(500).json({message: 'Internal Server Error!'});
	}
};
export const login = (req, res) => {
	res.send("register");
};
export const logout = (req, res) => {
	res.send("register");
};
