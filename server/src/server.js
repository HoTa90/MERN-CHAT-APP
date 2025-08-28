import express from "express";
import authRouter from "./routes/authRouter.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRouter from "./routes/messageRouter.js";
import cors from 'cors'

const app = express();

dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
	origin: "http://localhost:5173",
	credentials: true
}))


app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter)

const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`Server is listening on http://localhost:${PORT}...`);
	connectDB();
});
