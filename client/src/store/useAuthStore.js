import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
	authUser: null,
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

    register: async (data) => {
        try {
           const res = await axiosInstance.post("/auth/register", data);
           set({authUser: res.data})
           toast.success("Account Created successfully");

        } catch  (err){
            toast.error(err.response.data.message)

        }
    }
}));
