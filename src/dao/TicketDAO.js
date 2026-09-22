import mongoose from "mongoose";
import Ticket from "../models/Ticket.js";

class TicketDAO {
    async create(ticketData) {
        return await Ticket.create(ticketData);
    }

    async findById(id) {
        return await Ticket.findById(id);
    }

    async findActiveByUserAndEvent(userId, eventId) {
        return await Ticket.findOne({
            user: userId,
            event: eventId,
            status: { $ne: "cancelled" }
        });
    }

    async findByUser(userId) {
        return await Ticket.find({
            user: userId
        }).populate("event", "title date location");
    }

    async findByEvent(eventId) {
        return await Ticket.find({
            event: eventId
        }).populate("user", "first_name last_name email");
    }

   async countActiveByEvent(eventId) {
    const result = await Ticket.aggregate([
        {
            $match: {
                event: new mongoose.Types.ObjectId(eventId),
                status: { $ne: "cancelled" }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$quantity" }
            }
        }
    ]);

    return result.length > 0 ? result[0].total : 0;
}

    async cancel(id) {
        return await Ticket.findByIdAndUpdate(
            id,
            {
                status: "cancelled",
                cancelledAt: new Date()
            },
            {
                new: true,
                runValidators: true
            }
        );
    }
}

export default new TicketDAO();