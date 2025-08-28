import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const authGuard = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;
		if (!token) {
			return res.status(401).json({ message: "Unauthorized - No token" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			return res
				.status(401)
				.json({ message: "Unauthorized - Token is invalid" });
		}

		const user = await User.findById(decoded.userId).select("-password");
		req.user = user;
		next();
	} catch (err) {
		console.log("Error in authGuard ", err.message);
		return res.status(500).json({ message: "Internal server error" });
	}
};
