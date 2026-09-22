import ticketRepository from "../repositories/ticket.repository.js";
import eventRepository from "../repositories/event.repository.js";
import { sendTicketConfirmationEmail } from "./email.service.js";

const validationError = (message) => {
    const error = new Error(message);
    error.statusCode = 400;
    return error;
};

const notFoundError = (message) => {
    const error = new Error(message);
    error.statusCode = 404;
    return error;
};

const forbiddenError = (message) => {
    const error = new Error(message);
    error.statusCode = 403;
    return error;
};

export const createTicket = async (eventId, quantity, user) => {
    // 1. Verificar que el evento exista
    const event = await eventRepository.getEventById(eventId);

    if (!event) {
        throw notFoundError("Evento no encontrado.");
    }

  // 2. Verificar estado del evento
if (["cancelled", "finished"].includes(event.status)) {
    throw validationError(
        "No se puede realizar una inscripción en un evento cancelado o finalizado."
    );
}

if (event.status !== "published") {
    throw validationError(
        "Solo se puede realizar una inscripción en eventos publicados."
    );
}

    // 3. Validar cantidad
    const parsedQuantity = Number(quantity);

    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
        throw validationError(
            "La cantidad debe ser un número entero mayor que cero."
        );
    }

    // 4. Evitar inscripción duplicada activa
    const existingTicket =
        await ticketRepository.getActiveTicketByUserAndEvent(
            user.id,
            eventId
        );

    if (existingTicket) {
        throw validationError(
            "El usuario ya tiene una inscripción activa para este evento."
        );
    }

    // 5. Contar cupos actualmente ocupados
    const occupiedCapacity =
        await ticketRepository.countActiveTicketsByEvent(eventId);

    // 6. Verificar capacidad disponible
    const availableCapacity = event.capacity - occupiedCapacity;

    if (availableCapacity < parsedQuantity) {
        throw validationError(
            `No hay cupos suficientes. Cupos disponibles: ${availableCapacity}.`
        );
    }

    // 7. Crear ticket
    const reservationCode = `RES-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`;

    const ticket = await ticketRepository.createTicket({
    user: user.id,
    event: eventId,
    status: "confirmed",
    quantity: parsedQuantity,
    reservationCode
});

await sendTicketConfirmationEmail({
    to: user.email,
    eventTitle: event.title,
    eventDate: event.date,
    eventLocation: event.location,
    quantity: parsedQuantity,
    reservationCode
});

return ticket;

};

export const getMyTickets = async (userId) => {
    return await ticketRepository.getTicketsByUser(userId);
};

export const getEventTickets = async (eventId, user) => {
    // Verificar que el evento exista
    const event = await eventRepository.getEventById(eventId);

    if (!event) {
        throw notFoundError("Evento no encontrado.");
    }

    // Admin puede consultar cualquier evento
    if (user.role === "admin") {
        return await ticketRepository.getTicketsByEvent(eventId);
    }

    // Organizer solo puede consultar sus propios eventos
    if (
        user.role !== "organizer" ||
        event.organizer.toString() !== user.id
    ) {
        throw forbiddenError(
            "No tenés permisos para consultar los tickets de este evento."
        );
    }

    return await ticketRepository.getTicketsByEvent(eventId);
};

export const cancelTicket = async (ticketId, user) => {
    // Buscar ticket
    const ticket = await ticketRepository.getTicketById(ticketId);

    if (!ticket) {
        throw notFoundError("Ticket no encontrado.");
    }

    // No permitir cancelar dos veces
    if (ticket.status === "cancelled") {
        throw validationError("El ticket ya se encuentra cancelado.");
    }

    // El dueño o un administrador pueden cancelar
    const isOwner = ticket.user.toString() === user.id;
    const isAdmin = user.role === "admin";

    if (!isOwner && !isAdmin) {
        throw forbiddenError(
            "No tenés permisos para cancelar este ticket."
        );
    }

    return await ticketRepository.cancelTicket(ticketId);
};