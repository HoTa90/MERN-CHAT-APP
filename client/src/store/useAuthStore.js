import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
	authUser: null,
	isUpdatingProfile: false,
	isCheckingAuth: true,
	onlineUsers: [],
	socket: null,

	checkAuth: async () => {
		try {
			const res = await axiosInstance.get("/auth/check");
			set({ authUser: res.data });
			get().connectSocket();
		} catch (err) {
			console.log("Error in checkAuth ", err.message);
			set({ authUser: null });
		} finally {
			set({ isCheckingAuth: false });
		}
	},

	register: async (data) => {
		try {
			const res = await axiosInstance.post("/auth/register", data);
			set({ authUser: res.data });
			toast.success("Account Created successfully");
			get().connectSocket();
		} catch (err) {
			toast.error(err.response.data.message);
		}
	},
	login: async (data) => {
		try {
			const res = await axiosInstance.post("/auth/login", data);
			set({ authUser: res.data });
			toast.success("Logged In successfully");
			get().connectSocket();
		} catch (err) {
			toast.error(err.response.data.message);
		}
	},

	logout: async () => {
		try {
			await axiosInstance.post("/auth/logout");
			set({ authUser: null });
			toast.success("Loggout out successfully");
			get().disconnectSocket();
		} catch (err) {
			toast.error(err.response.data.message);
		}
	},

	updateProfile: async (data) => {
		set({ isUpdatingProfile: true });

		try {
			const res = await axiosInstance.put("/auth/update-profile", data);
			set({ authUser: res.data });
			toast.success("Profile image updated successfully!");
			return { user: res.data };
		} catch (err) {
			console.error("error in updateProfile", err.message);
			const msg = err.response?.data?.message ?? "Failed to update profile";
			toast.error(msg);
			return { error: msg };
		} finally {
			set({ isUpdatingProfile: false });
		}
	},

	connectSocket: () => {
		const { authUser } = get();
		if (!authUser || get().socket?.connected) {
			return;
		}
		const socket = io(BASE_URL, {
			query: {
				userId: authUser._id,
			},
		});
		socket.connect();
		set({ socket: socket });
		socket.on("getOnlineUsers", (userIds) => {
			set({ onlineUsers: userIds });
		});
	},
	disconnectSocket: () => {
		if (get().socket?.connected) {
			get().socket.disconnect();
		}
	},
}));
