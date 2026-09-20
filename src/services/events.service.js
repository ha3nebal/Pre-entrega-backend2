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

export const createEvent = async (eventData) => {

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

    return await eventRepository.createEvent(eventData);

};

export const updateEvent = async (id, eventData) => {

    const event = await eventRepository.getEventById(id);

    if (!event) {
        throw new Error("Evento no encontrado.");
    }

    return await eventRepository.updateEvent(id, eventData);

};

export const deleteEvent = async (id) => {

    const event = await eventRepository.getEventById(id);

    if (!event) {
        throw new Error("Evento no encontrado.");
    }

    return await eventRepository.deleteEvent(id);

};