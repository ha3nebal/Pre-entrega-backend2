import { getAllEvents } from "../services/events.service.js";

export const getEvents = async (req, res) => {

    const events = await getAllEvents();

   sendSuccess(res,events);

};