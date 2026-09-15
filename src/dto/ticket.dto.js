export const toTicketDTO = (ticket) => {
    if (!ticket) {
        return null;
    }

    const user = ticket.user
        ? {
              id: ticket.user._id?.toString() || ticket.user.id,
              first_name: ticket.user.first_name,
              last_name: ticket.user.last_name,
              email: ticket.user.email,
              role: ticket.user.role
          }
        : null;

    const event = ticket.event
        ? {
              id: ticket.event._id?.toString() || ticket.event.id,
              title: ticket.event.title,
              description: ticket.event.description,
              date: ticket.event.date,
              location: ticket.event.location,
              capacity: ticket.event.capacity,
              organizer: ticket.event.organizer,
              status: ticket.event.status
          }
        : null;

    return {
        id: ticket._id?.toString() || ticket.id,
        user,
        event,
        status: ticket.status,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt
    };
};

export const toTicketListDTO = (tickets) => {
    if (!Array.isArray(tickets)) {
        return [];
    }

    return tickets.map(toTicketDTO);
};