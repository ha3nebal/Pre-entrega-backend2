import Event from "../models/Event.js";

class EventDAO {

    // Obtener todos los eventos
        async findAll(options = {}) {

        const {
            filters = {},
            page = 1,
            limit = 10,
            sort
        } = options;

        const query = {};

        if (filters.status) {
            query.status = filters.status;
        }

        if (filters.category) {
            query.category = filters.category;
        }

        if (filters.location) {
            query.location = filters.location;
        }

        if (filters.dateFrom || filters.dateTo) {
            query.date = {};

            if (filters.dateFrom) {
                query.date.$gte = new Date(filters.dateFrom);
            }

            if (filters.dateTo) {
                query.date.$lte = new Date(filters.dateTo);
            }
        }

        const skip = (page - 1) * limit;

        let eventsQuery = Event
            .find(query)
            .skip(skip)
            .limit(limit);

       if (sort === "date") {
        eventsQuery = eventsQuery.sort({ date: 1 });
        }

       if (sort === "-date") {
       eventsQuery = eventsQuery.sort({ date: -1 });
    }

        const [data, total] = await Promise.all([
            eventsQuery,
            Event.countDocuments(query)
        ]);

        return {
            data,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        };
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

        // Cambiar estado de un evento
    async updateStatus(id, status) {
        return await Event.findByIdAndUpdate(
            id,
            { status },
            {
                new: true,
                runValidators: true
            }
        );
    }
    

}

export default new EventDAO();