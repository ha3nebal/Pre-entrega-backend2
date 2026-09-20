import eventDAO from "../dao/EventDAO.js";

class EventRepository {

    async getEvents() {
        return await eventDAO.findAll();
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

    async deleteEvent(id) {
        return await eventDAO.delete(id);
    }

}

export default new EventRepository();