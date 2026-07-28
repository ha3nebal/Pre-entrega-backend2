import { getAllEvents } from "../services/events.service.js";

export const getEvents = (req, res) => {

    const events = getAllEvents();

    res.status(200).json({
        status: "success",
        payload: events
    });

};