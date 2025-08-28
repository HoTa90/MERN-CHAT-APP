import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useAuthStore = create((set) => ({
	authUser: null,
	isRegistering: false,
	isLogging: false,
	isUpdatingProfile: false,
	isCheckingAuth: true,

	checkAuth: async () => {
		try {
			const res = await axiosInstance.get("/auth/check");
			set({ authUser: res.data });
		} catch (err) {
            console.log('Error in checkAuth ', err.message)
			set({ authUser: null });
		} finally {
            set ({isCheckingAuth: false})
        }
	},
}));
