import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
	messages: [],
	users: [],
	selectedUser: null,
	isUsersLoading: false,
	isMessagesLoading: false,

	getUsers: async () => {
		set({ isUsersLoading: true });
		try {
			const res = await axiosInstance.get("/messages/users");
			set({ users: res.data.filteredUsers });
		} catch (err) {
			console.log("Error in getUsers ", err.message);
			toast.error(err.response.data.massage);
		} finally {
			set({ isUsersLoading: false });
		}
	},

	getMessages: async (userId) => {
		set({ isMessagesLoading: true });
		try {
			const res = await axiosInstance.get(`/messages/${userId}`);
			set({ messages: res.data });
		} catch (err) {
			console.log("Error in getMessages ", err.message);
			toast.error(err.response.data.massage);
		} finally {
			set({ isMessagesLoading: false });
		}
	},
	sendMessage: async (msgData) => {
		const { selectedUser, messages } = get();
		try {
			const res = await axiosInstance.post(
				`/messages/send/${selectedUser._id}`,
				msgData
			);
			set({ messages: [...messages, res.data] });
		} catch (err) {
			console.log("Error in sendMessage ", err.message);
			toast.error(err.response.data.massage);
		}
	},

	setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
