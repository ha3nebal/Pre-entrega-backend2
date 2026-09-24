import eventRepository from "../repositories/event.repository.js";

const validationError = (message) => {
    const error = new Error(message);
    error.statusCode = 400;
    return error;
};

export const getAllEvents = async (query = {}) => {

    const {
        status,
        category,
        location,
        dateFrom,
        dateTo,
        page = 1,
        limit = 10,
        sort
    } = query;

    const filters = {
        status,
        category,
        location,
        dateFrom,
        dateTo
    };

    return await eventRepository.getEvents({
        filters,
        page: Number(page),
        limit: Number(limit),
        sort
    });

};

export const getEventById = async (id) => {

    const event = await eventRepository.getEventById(id);

   if (!event) {
    const error = new Error("Evento no encontrado.");
    error.statusCode = 404;
    throw error;
}
    return event;

};

export const createEvent = async (eventData, user) => {

    if (!eventData.title) {
        throw validationError("El título es obligatorio.");
    }

    if (!eventData.description) {
        throw validationError("La descripción es obligatoria.");
    }

    if (!eventData.category) {
        throw validationError("La categoría es obligatoria.");
    }

    if (!eventData.date) {
        throw validationError("La fecha es obligatoria.");
    }

    if (!eventData.location) {
        throw validationError("La ubicación es obligatoria.");
    }

    if (eventData.capacity === undefined || eventData.capacity <= 0) {
        throw validationError("La capacidad debe ser mayor que cero.");
    }

    if (eventData.price === undefined || eventData.price < 0) {
        throw validationError("El precio no puede ser negativo.");
    }

    const eventDate = new Date(eventData.date);

    if (Number.isNaN(eventDate.getTime())) {
        throw validationError("La fecha del evento no es válida.");
    }

    if (eventDate <= new Date()) {
        throw validationError("La fecha del evento debe ser futura.");
    }

    const newEventData = {
        ...eventData,
        organizer: user.id
    };

    delete newEventData.status;

    return await eventRepository.createEvent(newEventData);

};

export const updateEvent = async (id, eventData, user) => {

    const event = await eventRepository.getEventById(id);

    if (!event) {
    const error = new Error("Evento no encontrado.");
    error.statusCode = 404;
    throw error;
}

    if (event.status === "cancelled") {
    const error = new Error(
        "Un evento cancelado no puede ser modificado."
    );

    error.statusCode = 400;

    throw error;
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
    delete updateData.status;

    if (
        updateData.capacity !== undefined &&
        updateData.capacity <= 0
    ) {
        throw validationError("La capacidad debe ser mayor que cero.");
    }

    if (
        updateData.price !== undefined &&
        updateData.price < 0
    ) {
        throw validationError("El precio no puede ser negativo.");
    }

    if (updateData.date !== undefined) {

        const eventDate = new Date(updateData.date);

        if (Number.isNaN(eventDate.getTime())) {
            throw validationError("La fecha del evento no es válida.");
        }

        if (eventDate <= new Date()) {
            throw validationError("La fecha del evento debe ser futura.");
        }
    }

    return await eventRepository.updateEvent(id, updateData);

};

export const updateEventStatus = async (id, status, user) => {

    const event = await eventRepository.getEventById(id);

   if (!event) {
    const error = new Error("Evento no encontrado.");
    error.statusCode = 404;
    throw error;
}

    if (
        user.role !== "admin" &&
        event.organizer.toString() !== user.id
    ) {
        const error = new Error(
            "No tenés permisos para cambiar el estado de este evento."
        );

        error.statusCode = 403;

        throw error;
    }

    if (event.status === "cancelled") {
    const error = new Error(
        "Un evento cancelado no puede cambiar de estado."
    );

    error.statusCode = 400;

    throw error;
}

    if (!["draft", "published", "cancelled", "finished"].includes(status)) {
        throw validationError("Estado de evento no válido.");
    }

    if (
        status === "published" &&
        ["finished", "cancelled"].includes(event.status)
    ) {
        throw validationError(
            "No se puede publicar un evento finalizado o cancelado."
        );
    }

    return await eventRepository.updateEventStatus(id, status);
};