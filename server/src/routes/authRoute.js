import expres from "express";
import {
    checkAuth,
	login,
	logout,
	register,
	updateProfile,
} from "../controllers/authController.js";
import { authGuard } from "../middlewares/authGuard.js";

const router = expres.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", authGuard, updateProfile);
router.get("/check", authGuard, checkAuth)

export default router;
