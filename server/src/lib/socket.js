import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: ["http://localhost:5173"],
	},
});

const userSockets = new Map();

function emitOnlineUsers() {
	io.emit("getOnlineUsers", Array.from(userSockets.keys()));
}

io.on("connection", (socket) => {
	console.log("connected:", socket.id);

	const userId = socket.handshake.query.userId;

	if (userId) {
		if (!userSockets.has(userId)) userSockets.set(userId, new Set());
		userSockets.get(userId).add(socket.id);
		emitOnlineUsers();
	}

	socket.on("disconnect", () => {
		console.log("disconnected:", socket.id);
		if (!userId) return;

		const set = userSockets.get(userId);
		if (set) {
			set.delete(socket.id);
			if (set.size === 0) userSockets.delete(userId);
		}
		emitOnlineUsers();
	});
});

export { io, app, server };
