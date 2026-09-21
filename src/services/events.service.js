import eventRepository from "../repositories/event.repository.js";

export const getAllEvents = async () => {

    return await eventRepository.getEvents();

};

export const getEventById = async (id) => {

    const event = await eventRepository.getEventById(id);

    if (!event) {
        throw new Error("Evento no encontrado.");
    }

    return event;

};

export const createEvent = async (eventData, user) => {

    if (!eventData.title) {
        throw new Error("El título es obligatorio.");
    }

    if (!eventData.description) {
        throw new Error("La descripción es obligatoria.");
    }

    if (!eventData.date) {
        throw new Error("La fecha es obligatoria.");
    }

    if (!eventData.location) {
        throw new Error("La ubicación es obligatoria.");
    }

    if (!eventData.capacity || eventData.capacity < 1) {
        throw new Error("La capacidad debe ser mayor que cero.");
    }

    eventData.organizer = user.id;

    return await eventRepository.createEvent(eventData);

};

export const updateEvent = async (id, eventData, user) => {

    const event = await eventRepository.getEventById(id);

    if (!event) {
        throw new Error("Evento no encontrado.");
    }

    if (
        user.role !== "admin" &&
        event.organizer.toString() !== user.id
    ) {
        const error = new Error(
            "No tenés permisos para modificar este evento."
        );

        error.statusCode = 403;

        throw error;
    }

    const updateData = { ...eventData };

    delete updateData.organizer;

    return await eventRepository.updateEvent(id, updateData);

};

export const deleteEvent = async (id, user) => {

    const event = await eventRepository.getEventById(id);

    if (!event) {
        throw new Error("Evento no encontrado.");
    }

    if (
        user.role !== "admin" &&
        event.organizer.toString() !== user.id
    ) {
        const error = new Error(
            "No tenés permisos para eliminar este evento."
        );

        error.statusCode = 403;

        throw error;
    }

    return await eventRepository.deleteEvent(id);

};