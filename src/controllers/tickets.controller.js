import {
    createTicket,
    getTicketById,
    getMyTickets,
    cancelTicket
} from "../services/tickets.service.js";

import { toTicketDTO, toTicketListDTO } from "../dto/ticket.dto.js";
import { sendSuccess } from "../utils/response.js";

export const createNewTicket = async (req, res, next) => {
    try {
        const { eventId } = req.body;
        const userId = req.user.id;

        const ticket = await createTicket(userId, eventId);

        sendSuccess(res, toTicketDTO(ticket), 201);
    } catch (error) {
        next(error);
    }
};

export const getTicket = async (req, res, next) => {
    try {
        const { id } = req.params;

        const ticket = await getTicketById(id);

        sendSuccess(res, toTicketDTO(ticket));
    } catch (error) {
        next(error);
    }
};

export const getMyTicketsList = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const tickets = await getMyTickets(userId);

        sendSuccess(res, toTicketListDTO(tickets));
    } catch (error) {
        next(error);
    }
};

export const cancelExistingTicket = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const ticket = await cancelTicket(id, userId);

        sendSuccess(res, toTicketDTO(ticket));
    } catch (error) {
        next(error);
    }
};