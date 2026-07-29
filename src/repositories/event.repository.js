import eventDAO from "../dao/EventDAO.js";

class EventRepository {

    async getEvents() {

        return await eventDAO.getAll();

    }

}

export default new EventRepository();