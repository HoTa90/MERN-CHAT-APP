import ChatContainer from "../components/ChatContainer.jsx";
import NoSelectedChat from "../components/NoSelectedChat.jsx";
import SideBar from "../components/SideBar.jsx";
import { useChatStore } from "../store/useChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { useEffect } from "react";

export default function HomePage() {
	const { selectedUser, unsubscribeFromMessages, subscribeToMessages } = useChatStore();
	const { socket } = useAuthStore();

	useEffect(() => {
		const handleSocketConnect = () => {
			if (socket && socket.connected) {
				subscribeToMessages();
				console.log("subscribed after socket connection");
			}
		};

		if (socket && socket.connected) {
			subscribeToMessages();
			console.log("subscribed (socket already connected)");
		}

		if (socket) {
			socket.on("connect", handleSocketConnect);
		}

		return () => {
			unsubscribeFromMessages();
			console.log("unsubscribed");

			if (socket) {
				socket.off("connect", handleSocketConnect);
			}
		};
	}, [unsubscribeFromMessages, socket, subscribeToMessages]);

	return (
		<div className="h-screen bg-base-200">
			<div className="flex items-center justify-center pt-24 px-4">
				<div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
					<div className="flex h-full rounded-lg overflow-hidden">
						<SideBar />

						{!selectedUser ? <NoSelectedChat /> : <ChatContainer />}
					</div>
				</div>
			</div>
		</div>
	);
}
