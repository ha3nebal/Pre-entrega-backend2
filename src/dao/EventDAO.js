import Event from "../models/Event.js";

class EventDAO {

    // Obtener todos los eventos
    async findAll() {
        return await Event.find();
    }

    // Obtener un evento por ID
    async findById(id) {
        return await Event.findById(id);
    }

    // Crear un nuevo evento
    async create(eventData) {
        return await Event.create(eventData);
    }

    // Actualizar un evento
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

    // Eliminar un evento
    async delete(id) {
        return await Event.findByIdAndDelete(id);
    }

}

export default new EventDAO();