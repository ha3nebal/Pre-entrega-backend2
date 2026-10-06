import {
    createTicket,
    getMyTickets,
    getEventTickets,
    cancelTicket
} from "../services/tickets.service.js";

import {
    toTicketDTO,
    toTicketListDTO
} from "../dto/ticket.dto.js";

import { sendSuccess } from "../utils/response.js";

export const createTicketController = async (req, res, next) => {
    try {
        const ticket = await createTicket(
            req.params.eid,
            req.body.quantity,
            req.user
        );

        sendSuccess(
            res,
            toTicketDTO(ticket),
            201
        );
    } catch (error) {
        next(error);
    }
};

export const getMyTicketsController = async (req, res, next) => {
    try {
        const tickets = await getMyTickets(req.user.id);

        sendSuccess(
            res,
            toTicketListDTO(tickets)
        );
    } catch (error) {
        next(error);
    }
};

export const getEventTicketsController = async (req, res, next) => {
    try {
        const tickets = await getEventTickets(
            req.params.eid,
            req.user
        );

        sendSuccess(
            res,
            toTicketListDTO(tickets)
        );
    } catch (error) {
        next(error);
    }
};

export const cancelTicketController = async (req, res, next) => {
    try {
        const ticket = await cancelTicket(
            req.params.tid,
            req.user
        );

        sendSuccess(
            res,
            toTicketDTO(ticket)
        );
    } catch (error) {
        next(error);
    }
};