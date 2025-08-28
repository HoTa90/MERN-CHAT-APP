import express from "express";
import {
    checkAuth,
	login,
	logout,
	register,
	updateProfile,
} from "../controllers/authController.js";
import { authGuard } from "../middlewares/authGuard.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.put("/update-profile", authGuard, updateProfile);
authRouter.get("/check", authGuard, checkAuth)

export default authRouter;
