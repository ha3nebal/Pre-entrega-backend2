import {
    createTicket,
    getMyTickets,
    getEventTickets,
    cancelTicket
} from "../services/tickets.service.js";

import { sendSuccess } from "../utils/response.js";

export const createTicketController = async (req, res, next) => {
    try {
        const { eid } = req.params;
        const { quantity } = req.body;

        const ticket = await createTicket(eid, quantity, req.user);

        sendSuccess(res, ticket, 201);
    } catch (error) {
        next(error);
    }
};

export const getMyTicketsController = async (req, res, next) => {
    try {
        const tickets = await getMyTickets(req.user.id);

        sendSuccess(res, tickets);
    } catch (error) {
        next(error);
    }
};

export const getEventTicketsController = async (req, res, next) => {
    try {
        const { eid } = req.params;

        const tickets = await getEventTickets(eid, req.user);

        sendSuccess(res, tickets);
    } catch (error) {
        next(error);
    }
};

export const cancelTicketController = async (req, res, next) => {
    try {
        const { tid } = req.params;

        const ticket = await cancelTicket(tid, req.user);

        sendSuccess(res, ticket);
    } catch (error) {
        next(error);
    }
};