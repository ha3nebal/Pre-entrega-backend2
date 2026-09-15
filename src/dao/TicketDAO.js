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
        return await Ticket.find({ user: userId })
            .populate("event")
            .populate("user", "first_name last_name email role");
    }

    async findByUserAndEvent(userId, eventId) {
        return await Ticket.findOne({
            user: userId,
            event: eventId
        })
            .populate("user", "first_name last_name email role")
            .populate("event");
    }

    async findActiveByEvent(eventId) {
        return await Ticket.find({
            event: eventId,
            status: "ACTIVE"
        });
    }

    async countActiveByEvent(eventId) {
        return await Ticket.countDocuments({
            event: eventId,
            status: "ACTIVE"
        });
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
}

export default new TicketDAO();