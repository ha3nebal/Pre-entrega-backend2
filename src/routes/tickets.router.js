import { Router } from "express";

import {
    getMyTicketsController,
    cancelTicketController
} from "../controllers/tickets.controller.js";

import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/my-tickets", auth, getMyTicketsController);

router.patch("/:tid/cancel", auth, cancelTicketController);

export default router;