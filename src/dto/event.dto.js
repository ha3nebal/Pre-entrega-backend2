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
    if (!Array.isArray(events)) {
        return [];
    }

    return events.map(toEventDTO);
};