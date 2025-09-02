import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
	messages: [],
	users: [],
	selectedUser: null,
	isUsersLoading: false,
	isMessagesLoading: false,
	unreadByUserId: {},

	getUsers: async () => {
		set({ isUsersLoading: true });
		try {
			const res = await axiosInstance.get("/messages/users");
			set({ users: res.data.filteredUsers });
		} catch (err) {
			console.log("Error in getUsers ", err.message);
			toast.error(err.response.data.massage ?? "failed to load users");
		} finally {
			set({ isUsersLoading: false });
		}
	},

	getMessages: async (userId) => {
		set({ isMessagesLoading: true });
		try {
			const res = await axiosInstance.get(`/messages/${userId}`);
			set({ messages: res.data });
			get().clearUnread(userId); // Clear unread msgs
		} catch (err) {
			console.log("Error in getMessages ", err.message);
				toast.error(err.response.data.massage ?? "failed to load messages");
		} finally {
			set({ isMessagesLoading: false });
		}
	},

	sendMessage: async (msgData) => {
		const { selectedUser, messages } = get();
		try {
			const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, msgData);
			set({ messages: [...messages, res.data] });
		} catch (err) {
			console.log("Error in sendMessage ", err.message);
			toast.error(err.response.data.massage ?? "failed to send message");
		}
	},

	_incUnread: (userId) =>
		set((state) => ({
			unreadByUserId: {
				...state.unreadByUserId,
				[userId]: (state.unreadByUserId[userId] ?? 0) + 1,
			},
		})),

	clearUnread: (userId) =>
		set((state) => {
			if (!state.unreadByUserId[userId]) return state;
			const next = { ...state.unreadByUserId };
			delete next[userId];
			return { unreadByUserId: next };
		}),

	clearAllUnread: () => set({ unreadByUserId: {} }),

	setSelectedUser: (selectedUser) => {
		set({ selectedUser });
		if (selectedUser?._id) {
			get().clearUnread(selectedUser._id);
		}
	},

	subscribeToMessages: () => {
		const socket = useAuthStore.getState().socket;
		if (!socket) {
			console.log("Socket not available for message subscription");
			return;
		}

		socket.off("newMessage");

		socket.on("newMessage", (data) => {
			console.log("New message received:", data);

			const { selectedUser, messages, users } = get();

			if (selectedUser?._id === data.senderId) {
				set({ messages: [...messages, data] });
				return;
			}

			get()._incUnread(data.senderId);

			const fromUser = users.find((u) => u._id === data.senderId);
			const senderName = fromUser ? fromUser.fullName : "Someone";

			let messageText = "New message";
			if (data.text) {
				messageText = data.text;
			}

			toast(`${senderName}: ${messageText.slice(0, 80)}`, {
				duration: 3000,
				icon: "✉️",
			});
		});
	},

	unsubscribeFromMessages: () => {
		const socket = useAuthStore.getState().socket;
		if (socket) {
			socket.off("newMessage");
		}
	},
}));
