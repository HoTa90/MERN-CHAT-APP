import express from "express"
import { authGuard } from "../middlewares/authGuard.js";
import { getMessages, getSideBarUsers, sendMessage } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/users", authGuard, getSideBarUsers);
messageRouter.get("/:id", authGuard, getMessages);
messageRouter.post("/send/:id", authGuard, sendMessage)


export default messageRouter;