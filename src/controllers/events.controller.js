import {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
} from "../services/events.service.js";

import {
    toEventDTO,
    toEventListDTO
} from "../dto/event.dto.js";

import { sendSuccess } from "../utils/response.js";

export const getEvents = async (req, res, next) => {
    try {
        
        const events = await getAllEvents();

        sendSuccess(
            res,
            toEventListDTO(events)
        );
    } catch (error) {

        next(error);

    }

};

export const getEvent = async (req, res, next) => {
    try {

        const { id } = req.params;

        const event = await getEventById(id);

        sendSuccess(
            res,
            toEventDTO(event)
        );
    } catch (error) {

        next(error);

    }
};

export const createNewEvent = async (req, res, next) => {
    try {

        const event = await createEvent(req.body);

        sendSuccess(
            res,
            toEventDTO(event),
            201
        );
    } catch (error) {

        next(error);

    }
};

export const updateExistingEvent = async (req, res, next) => {
    try {

        const { id } = req.params;

        const event = await updateEvent(
            id,
            req.body
        );

        sendSuccess(
            res,
            toEventDTO(event)
        );

    } catch (error) {

        next(error);

    }
};

export const deleteExistingEvent = async (req, res, next) => {
    try {

        const { id } = req.params;

        const event = await deleteEvent(id);

        sendSuccess(
            res,
            toEventDTO(event)
        );

    } catch (error) {

        next(error);

    }
};