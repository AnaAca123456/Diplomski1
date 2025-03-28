import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .sort({ createdAt: -1 })
            .populate("sender", "firstName lastName")
            .populate("post", "title");

        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ message: "Greška pri učitavanju notifikacija." });
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ recipient: req.user._id }, { isRead: true });
        res.status(200).json({ message: "Sve notifikacije su označene kao pročitane." });
    } catch (err) {
        res.status(500).json({ message: "Greška pri ažuriranju notifikacija." });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Notifikacija obrisana." });
    } catch (err) {
        res.status(500).json({ message: "Greška pri brisanju notifikacije." });
    }
};
