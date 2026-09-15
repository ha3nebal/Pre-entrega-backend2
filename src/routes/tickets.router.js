import { Router } from "express";
import passport from "passport";

import {
    createNewTicket,
    getTicket,
    getMyTicketsList,
    cancelExistingTicket
} from "../controllers/tickets.controller.js";

const router = Router();

const authenticateCurrentUser = (req, res, next) => {
    passport.authenticate(
        "current",
        { session: false },
        (error, user) => {
            if (error) {
                return next(error);
            }

            if (!user) {
                const authError = new Error(
                    "No autenticado. Debes iniciar sesión."
                );

                authError.statusCode = 401;

                return next(authError);
            }

            req.user = user;
            next();
        }
    )(req, res, next);
};

router.post(
    "/",
    authenticateCurrentUser,
    createNewTicket
);

router.get(
    "/my",
    authenticateCurrentUser,
    getMyTicketsList
);

router.get(
    "/:id",
    authenticateCurrentUser,
    getTicket
);

router.delete(
    "/:id",
    authenticateCurrentUser,
    cancelExistingTicket
);

export default router;