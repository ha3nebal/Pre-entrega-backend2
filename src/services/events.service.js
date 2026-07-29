import eventRepository from "../repositories/event.repository.js";

export const getAllEvents = async () => {
    return await eventRepository.getEvents();
};