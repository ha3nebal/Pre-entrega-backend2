import { Router } from "express";

import {
    getEvents,
    getEvent,
    createNewEvent,
    updateExistingEvent,
    deleteExistingEvent
} from "../controllers/events.controller.js";

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
 * Crear un nuevo evento
 */
router.post("/", createNewEvent);

/**
 * Actualizar un evento existente
 */
router.put("/:id", updateExistingEvent);

/**
 * Eliminar un evento
 */
router.delete("/:id", deleteExistingEvent);

export default router;