import ticketRepository from "../repositories/ticket.repository.js";
import eventRepository from "../repositories/event.repository.js";
import userRepository from "../repositories/user.repository.js";

const createServiceError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

export const createTicket = async (userId, eventId) => {
    // 1. Comprobar que el usuario exista
    const user = await userRepository.getUserById(userId);

    if (!user) {
        throw createServiceError(
            "El usuario no existe.",
            404
        );
    }

    // 2. Comprobar que el evento exista
    const event = await eventRepository.findEventById(eventId);

    if (!event) {
        throw createServiceError(
            "El evento no existe.",
            404
        );
    }

    // 3. Comprobar que el evento esté activo
    if (event.status !== "ACTIVE") {
        throw createServiceError(
            "No es posible inscribirse en un evento que no está activo.",
            409
        );
    }

    // 4. Buscar una inscripción previa del usuario en ese evento
    const existingTicket =
        await ticketRepository.findTicketByUserAndEvent(
            userId,
            eventId
        );

    // 5. Si ya existe una inscripción activa, evitar duplicados
    if (existingTicket && existingTicket.status === "ACTIVE") {
        throw createServiceError(
            "El usuario ya está inscrito en este evento.",
            409
        );
    }

    // 6. Comprobar capacidad disponible
    const activeTickets =
        await ticketRepository.countActiveTicketsByEvent(eventId);

    if (activeTickets >= event.capacity) {
        throw createServiceError(
            "El evento no tiene cupos disponibles.",
            409
        );
    }

    // 7. Si existía un ticket cancelado, lo reactivamos
    if (existingTicket && existingTicket.status === "CANCELLED") {
        return await ticketRepository.updateTicket(
            existingTicket._id,
            {
                status: "ACTIVE"
            }
        );
    }

    // 8. Crear una nueva inscripción
    return await ticketRepository.createTicket({
        user: userId,
        event: eventId,
        status: "ACTIVE"
    });
};

export const getTicketById = async (ticketId) => {
    const ticket = await ticketRepository.findTicketById(ticketId);

    if (!ticket) {
        throw createServiceError(
            "Ticket no encontrado.",
            404
        );
    }

    return ticket;
};

export const getMyTickets = async (userId) => {
    return await ticketRepository.findTicketsByUser(userId);
};

export const cancelTicket = async (ticketId, userId) => {
    // 1. Buscar el ticket
    const ticket = await ticketRepository.findTicketById(ticketId);

    if (!ticket) {
        throw createServiceError(
            "Ticket no encontrado.",
            404
        );
    }

    // 2. Comprobar que el ticket pertenece al usuario autenticado
    const ticketUserId =
        ticket.user?._id?.toString() ||
        ticket.user?.toString();

    if (ticketUserId !== userId.toString()) {
        throw createServiceError(
            "No tienes permiso para cancelar este ticket.",
            403
        );
    }

    // 3. Evitar cancelar un ticket ya cancelado
    if (ticket.status === "CANCELLED") {
        throw createServiceError(
            "El ticket ya está cancelado.",
            409
        );
    }

    // 4. Cambiar el estado a CANCELLED
    return await ticketRepository.updateTicket(
        ticketId,
        {
            status: "CANCELLED"
        }
    );
};