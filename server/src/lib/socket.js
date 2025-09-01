import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const allowedOrigin =
	process.env.NODE_ENV === "production" ? process.env.CLIENT_ORIGIN || true : "http://localhost:5173";

const io = new Server(server, {
	cors: {
		origin: allowedOrigin,
		credentials: true,
	},
});

const userSockets = new Map(); // userId - socketId

function emitOnlineUsers() {
	io.emit("getOnlineUsers", Array.from(userSockets.keys()));
}

io.on("connection", (socket) => {
	console.log("connected:", socket.id);

	const userId = socket.handshake.query.userId;

	if (userId) {
		userSockets.set(userId, socket.id);
		emitOnlineUsers();
	}

	socket.on("disconnect", () => {
		console.log("disconnected:", socket.id);
		if (!userId) return;

		if (userSockets.get(userId) === socket.id) {
			userSockets.delete(userId);
			emitOnlineUsers();
		}
	});
});

export const getReceiverSocketId = (userId) => {
	return userSockets.get(userId) || null;
};

export { io, app, server };
