import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore.js";
import ChatHeader from "./ChatHeader.jsx";
import MessageInput from "./MessageInput.jsx";
import MessagesSkeleton from "./skeletons/MessagesSkeleton.jsx";
import { useAuthStore } from "../store/useAuthStore.js";
import { formatDate } from "../lib/utils.js";

export default function ChatContainer() {
	const {
		messages,
		getMessages,
		isMessagesLoading,
		selectedUser,
		subscribeToMessages,
		unsubscribeFromMessages,
	} = useChatStore();

	const { authUser } = useAuthStore();
	const msgEndRef = useRef(null);

	useEffect(() => {
		getMessages(selectedUser._id);
		subscribeToMessages();

		return () => {
			unsubscribeFromMessages();
		};
	}, [
		getMessages,
		selectedUser._id,
		subscribeToMessages,
		unsubscribeFromMessages,
	]);

	useEffect(() => {
		if (msgEndRef.current && messages) {
			msgEndRef.current.scrollIntoView({ behaviour: "smooth" });
		}
	}, [messages]);

	if (isMessagesLoading) {
		return (
			<div className="flex-1 flex flex-col overflow-auto">
				<ChatHeader />

				<MessagesSkeleton />

				<MessageInput />
			</div>
		);
	}

	return (
		<div className="flex-1 flex flex-col overflow-auto">
			<ChatHeader />

			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{messages.map((message) => (
					<div
						key={message._id}
						className={`chat ${
							message.senderId === authUser._id
								? "chat-end"
								: "chat-start"
						}`}
						ref={msgEndRef}>
						<div className=" chat-image avatar">
							<div className="size-10 rounded-full border">
								<img
									src={
										message.senderId === authUser._id
											? authUser.profilePic ||
											  "/avatar.png"
											: selectedUser.profilePic ||
											  "/avatar.png"
									}
									alt="profile pic"
								/>
							</div>
						</div>
						<div className="chat-header mb-1">
							<time className="text-xs opacity-50 ml-1">
								{formatDate(message.createdAt)}
							</time>
						</div>
						<div className="chat-bubble flex flex-col">
							{message.image && (
								<img
									src={message.image}
									alt="Attachment"
									className="sm:max-w-[200px] rounded-md mb-2"
								/>
							)}
							{message.text && <p>{message.text}</p>}
						</div>
					</div>
				))}
			</div>

			<MessageInput />
		</div>
	);
}
