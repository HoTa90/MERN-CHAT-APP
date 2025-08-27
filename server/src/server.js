import express from "express";
import router from "./routes/authRoute.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";

const app = express();

app.use(express.json());
app.use("/api/auth", router);
dotenv.config();

const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`Server is listening on http://localhost:${PORT}...`);
	connectDB();
});
