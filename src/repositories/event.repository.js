import eventDAO from "../dao/EventDAO.js";

class EventRepository {

    async getEvents(options) {
        return await eventDAO.findAll(options);
    }

    async findEventById(id) {
        return await eventDAO.findById(id);
    }

    async findPublishedEvents() {
        return await eventDAO.findPublishedEvents();
    }

    async createEvent(eventData) {
        return await eventDAO.create(eventData);
    }

    async updateEvent(id, eventData) {
        return await eventDAO.update(id, eventData);
    }

    async updateEventStatus(id, status) {
        return await eventDAO.updateStatus(id, status);
    }

    async deleteEvent(id) {
        return await eventDAO.delete(id);
    }
}

export default new EventRepository();