import express from "express"
import { authGuard } from "../middlewares/authGuard.js";
import { getMessages, getSideBarUsers, sendMessage } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/users", authGuard, getSideBarUsers);
messageRouter.post("/send/:id", authGuard, sendMessage)
messageRouter.get("/:id", authGuard, getMessages);


export default messageRouter;