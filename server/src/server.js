import express from "express";
import authRouter from "./routes/authRouter.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";
import cookieParser from "cookie-parser";
import messageRouter from "./routes/messageRouter.js";
import cors from "cors";
import path from "path";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../client/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
	});
}

server.listen(PORT, () => {
	console.log(`Server is listening on http://localhost:${PORT}...`);
	connectDB();
});
