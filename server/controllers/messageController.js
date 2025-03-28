import Message from "../models/Message.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

export const sendMessage = async (req, res) => {
    const { receiver, content } = req.body;
    const sender = req.user._id;

    if (!receiver || !content || !sender) {
        return res.status(400).json({ message: "Sva polja su obavezna." });
    }

    try {
        const message = await Message.create({ sender, receiver, text: content });

        await Notification.create({
            recipient: receiver,
            sender,
            type: "message"
        });

        res.status(201).json(message);
    } catch (err) {
        console.error("Greška u sendMessage:", err);
        res.status(500).json({ message: "Greška pri slanju poruke." });
    }
};

export const getConversations = async (req, res) => {
    try {
        const userId = req.user._id;

        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }],
        });

        const userIds = new Set();

        messages.forEach((msg) => {
            if (msg.sender.toString() !== userId.toString()) userIds.add(msg.sender.toString());
            if (msg.receiver.toString() !== userId.toString()) userIds.add(msg.receiver.toString());
        });

        const users = await User.find({ _id: { $in: Array.from(userIds) } }).select("firstName lastName _id");

        res.status(200).json(users);
    } catch (err) {
        console.error("Greška pri dohvatanju razgovora:", err);
        res.status(500).json({ message: "Greška pri dohvatanju razgovora." });
    }
};


export const getChatWithUser = async (req, res) => {
    try {
        const { partnerId } = req.params;
        const userId = req.user._id;

        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: partnerId },
                { sender: partnerId, receiver: userId },
            ],
        }).sort({ createdAt: 1 });

        const partner = await User.findById(partnerId).select("firstName lastName _id");

        res.status(200).json({ messages, partner });
    } catch (err) {
        res.status(500).json({ message: "Greška pri učitavanju poruka." });
    }
};

export const getMessagesWithUser = async (req, res) => {
    const { user } = req;
    const receiverId = req.params.userId;

    try {
        const messages = await Message.find({
            $or: [
                { sender: user._id, receiver: receiverId },
                { sender: receiverId, receiver: user._id },
            ],
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ message: "Greška pri pristupu poruka." });
    }
};
