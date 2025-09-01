import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";

export const getSideBarUsers = async (req, res) => {
	try {
		const loggedUserId = req.user._id;
		const filteredUsers = await User.find({
			_id: { $ne: loggedUserId },
		}).select("-password");
		res.status(200).json({ filteredUsers });
	} catch (err) {
		console.log("Error in getSideBarUsers ", err.message);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const getMessages = async (req, res) => {
	try {
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		const messages = await Message.find({
			$or: [
				{ senderId, receiverId },
				{ senderId: receiverId, receiverId: senderId },
			],
		});

		res.status(200).json(messages);
	} catch (err) {
		console.log("Error in getMessages ", err.message);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const sendMessage = async (req, res) => {
	try {
		const { text, image } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		let imageUrl;
		if (image) {
			const uploadedResponse = await cloudinary.uploader.upload(image);
			imageUrl = uploadedResponse.secure_url;
		}

		const newMessage = new Message( {
			senderId,
			receiverId,
			text,
			image: imageUrl,
		});

		await newMessage.save();

		const receiverSocketId = getReceiverSocketId(receiverId);

		if (receiverSocketId){
			io.to(receiverSocketId).emit("newMessage", newMessage)
		}
		res.status(201).json(newMessage);
	} catch (err) {
		console.log("Error in sendMessage ", err.message);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
