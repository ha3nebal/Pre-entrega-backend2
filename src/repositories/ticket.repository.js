import ticketDAO from "../dao/TicketDAO.js";

class TicketRepository {
    async findAllTickets() {
        return await ticketDAO.findAll();
    }

    async findTicketById(id) {
        return await ticketDAO.findById(id);
    }

    async findTicketsByUser(userId) {
        return await ticketDAO.findByUser(userId);
    }

    async findTicketByUserAndEvent(userId, eventId) {
        return await ticketDAO.findByUserAndEvent(userId, eventId);
    }

    async findActiveTicketsByEvent(eventId) {
        return await ticketDAO.findActiveByEvent(eventId);
    }

    async countActiveTicketsByEvent(eventId) {
        return await ticketDAO.countActiveByEvent(eventId);
    }

    async createTicket(ticketData) {
        return await ticketDAO.create(ticketData);
    }

    async updateTicket(id, ticketData) {
        return await ticketDAO.update(id, ticketData);
    }
}

export default new TicketRepository();