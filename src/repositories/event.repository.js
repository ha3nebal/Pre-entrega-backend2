import eventDAO from "../dao/EventDAO.js";

class EventRepository {

    async getEvents(options) {
        return await eventDAO.findAll(options);
    }

    async getEventById(id) {
        return await eventDAO.findById(id);
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

}

export default new EventRepository();