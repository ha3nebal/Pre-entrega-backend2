import { Router } from "express";

import {
    getEvents,
    getEvent,
    createNewEvent,
    updateExistingEvent,
    deleteExistingEvent
} from "../controllers/events.controller.js";

const router = Router();


router.get("/", getEvents);


router.get("/:id", getEvent);


router.post("/", createNewEvent);


router.put("/:id", updateExistingEvent);


router.delete("/:id", deleteExistingEvent);


export default router;