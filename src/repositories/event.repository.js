import eventDAO from "../dao/EventDAO.js";

class EventRepository {

    async getEvents() {
        return await eventDAO.getAll();
    }

    async getEventById(id) {
        return await eventDAO.getById(id);
    }

    async createEvent(event) {
        return await eventDAO.create(event);
    }

}

export default new EventRepository();