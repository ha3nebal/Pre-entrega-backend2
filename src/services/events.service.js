import eventRepository from "../repositories/event.repository.js";

const createServiceError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

export const getAllEvents = async () => {
    return await eventRepository.findAllEvents();
};

export const getPublishedEvents = async () => {
    return await eventRepository.findPublishedEvents();
};

export const getEventById = async (id) => {
    const event = await eventRepository.findEventById(id);

    if (!event) {
        throw createServiceError(
            "Evento no encontrado.",
            404
        );
    }

    return event;
    
};

export const createEvent = async (eventData) => {
    if (!eventData.title || !eventData.title.trim()) {
        throw createServiceError(
            "El título es obligatorio.",
            400
        );
    }

    if (!eventData.description || !eventData.description.trim()) {
        throw createServiceError(
            "La descripción es obligatoria.",
            400
        );
    }

    if (!eventData.date) {
        throw createServiceError(
            "La fecha es obligatoria.",
            400
        );
    }

    if (!eventData.location || !eventData.location.trim()) {
        throw createServiceError(
            "La ubicación es obligatoria.",
            400
        );
    }

    if (
        eventData.capacity === undefined ||
        eventData.capacity === null ||
        eventData.capacity < 1
    ) {
        throw createServiceError(
            "La capacidad debe ser mayor que cero.",
            400
        );
    }

    return await eventRepository.createEvent(eventData);

};

export const updateEvent = async (id, eventData) => {
    const event = await eventRepository.findEventById(id);

    if (!event) {
        throw createServiceError(
            "Evento no encontrado.",
            404
        );
    }

    if (
        eventData.capacity !== undefined &&
        eventData.capacity < 1
    ) {
        throw createServiceError(
            "La capacidad debe ser mayor que cero.",
            400
        );
    }

    return await eventRepository.updateEvent(
        id,
        eventData
    );
};

export const deleteEvent = async (id) => {
    const event = await eventRepository.findEventById(id);

    if (!event) {
        throw createServiceError(
            "Evento no encontrado.",
            404
        );
    }

    return await eventRepository.deleteEvent(id);

};