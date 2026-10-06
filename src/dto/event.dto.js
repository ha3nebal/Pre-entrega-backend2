export const toEventDTO = (event) => {
    if (!event) {
        return null;
    }

    return {
        id: event._id?.toString() || event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        location: event.location,
        capacity: event.capacity,
        organizer: event.organizer,
        status: event.status,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt
    };
};

export const toEventListDTO = (events) => {
    if (!events) {
        return {
            data: [],
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0
        };
    }

    return {
        data: Array.isArray(events.data)
            ? events.data.map(toEventDTO)
            : [],
        page: events.page,
        limit: events.limit,
        total: events.total,
        totalPages: events.totalPages
    };
    };