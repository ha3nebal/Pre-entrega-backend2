import { Router } from "express";

import {
    getEvents,
    getEvent,
    createNewEvent,
    updateExistingEvent,
    updateEventStatusController
} from "../controllers/events.controller.js";

import {
    createTicketController,
    getEventTicketsController
} from "../controllers/tickets.controller.js";

import { auth } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

/**
 * Obtener todos los eventos
 */
router.get("/", getEvents);

/**
 * Obtener un evento por ID
 */
router.get("/:id", getEvent);

/**
 * Registrar una inscripción en un evento
 */
router.post(
    "/:eid/tickets",
    auth,
    createTicketController
);

/**
 * Obtener los tickets de un evento
 */
router.get(
    "/:eid/tickets",
    auth,
    getEventTicketsController
);

/**
 * Crear un nuevo evento
 */
router.post(
    "/",
    auth,
    authorize("organizer", "admin"),
    createNewEvent
);

/**
 * Actualizar un evento existente
 */
router.put(
    "/:id",
    auth,
    authorize("organizer", "admin"),
    updateExistingEvent
);

router.patch(
    "/:id/status",
    auth,
    authorize("organizer", "admin"),
    updateEventStatusController
);

export default router;