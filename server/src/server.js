import express from "express";
import router from "./routes/authRoute.js";

const app = express();

app.use("/api/auth", router)

app.listen(5001, () =>
	console.log("Server is listening on http://localhost:5001...")
);
