import mongoose from "mongoose";
import Ticket from "../models/Ticket.js";

class TicketDAO {

    async findAll() {
        return await Ticket.find()
            .populate("user", "first_name last_name email role")
            .populate("event");
    }

    async findById(id) {
        return await Ticket.findById(id)
            .populate("user", "first_name last_name email role")
            .populate("event");
    }

    async findByUser(userId) {
        return await Ticket.find({
            user: userId
        }).populate("event", "title date location");
    }

    async findByEvent(eventId) {
        return await Ticket.find({
            event: eventId
        }).populate("user", "first_name last_name email role");
    }

    async findByUserAndEvent(userId, eventId) {
        return await Ticket.findOne({
            user: userId,
            event: eventId
        })
            .populate("user", "first_name last_name email role")
            .populate("event");
    }

    async findActiveByUserAndEvent(userId, eventId) {
        return await Ticket.findOne({
            user: userId,
            event: eventId,
            status: { $ne: "cancelled" }
        })
            .populate("user", "first_name last_name email role")
            .populate("event");
    }

    async findActiveByEvent(eventId) {
        return await Ticket.find({
            event: eventId,
            status: { $ne: "cancelled" }
        });
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

    async create(ticketData) {
        return await Ticket.create(ticketData);
    }

    async update(id, ticketData) {
        return await Ticket.findByIdAndUpdate(
            id,
            ticketData,
            {
                new: true,
                runValidators: true
            }
        )
            .populate("user", "first_name last_name email role")
            .populate("event");
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
        )
            .populate("user", "first_name last_name email role")
            .populate("event");
    }
}

export default new TicketDAO();