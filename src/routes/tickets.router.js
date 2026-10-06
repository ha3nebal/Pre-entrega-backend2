import { Router } from "express";

import {
    getMyTicketsController,
    cancelTicketController
} from "../controllers/tickets.controller.js";

import { auth } from "../middlewares/auth.middleware.js";

const router = Router();


// Obtener los tickets del usuario autenticado
router.get(
    "/my-tickets",
    auth,
    getMyTicketsController
);


// Cancelar un ticket
router.patch(
    "/:tid/cancel",
    auth,
    cancelTicketController
);


export default router;