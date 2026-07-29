import { getAllEvents } from "../services/events.service.js";

export const getEvents = async (req, res) => {

    const events = await getAllEvents();

    res.status(200).json({
        status: "success",
        payload: events
    });

};