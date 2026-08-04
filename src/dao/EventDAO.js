import Event from "../models/Event.js";

class EventDAO {

    async getAll() {
        return await Event.find();
    }

    async getById(id) {
        return await Event.findById(id);
    }

    async create(eventData) {
        return await Event.create(eventData);
    }

}

export default new EventDAO();