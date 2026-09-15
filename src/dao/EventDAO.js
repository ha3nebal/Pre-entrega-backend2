import Event from "../models/Event.js";

class EventDAO {

    
    async findAll() {
        return await Event.find();
    }


    async findById(id) {
        return await Event.findById(id);
    }

    async findPublishedEvents() {
        return await Event.find({
            status: "ACTIVE"
        });
    }

    async create(eventData) {
        return await Event.create(eventData);
    }


    async update(id, eventData) {
        return await Event.findByIdAndUpdate(
            id,
            eventData,
            {
                new: true,
                runValidators: true
            }
        );
    }


    async delete(id) {
        return await Event.findByIdAndDelete(id);
    }
    
}

export default new EventDAO();