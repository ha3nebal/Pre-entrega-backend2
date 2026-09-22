import ticketDAO from "../dao/TicketDAO.js";

class TicketRepository {
    async createTicket(ticketData) {
        return await ticketDAO.create(ticketData);
    }

    async getTicketById(id) {
        return await ticketDAO.findById(id);
    }

    async getActiveTicketByUserAndEvent(userId, eventId) {
        return await ticketDAO.findActiveByUserAndEvent(userId, eventId);
    }

    async getTicketsByUser(userId) {
        return await ticketDAO.findByUser(userId);
    }

    async getTicketsByEvent(eventId) {
        return await ticketDAO.findByEvent(eventId);
    }

    async countActiveTicketsByEvent(eventId) {
        return await ticketDAO.countActiveByEvent(eventId);
    }

    async cancelTicket(id) {
        return await ticketDAO.cancel(id);
    }
}

export default new TicketRepository();