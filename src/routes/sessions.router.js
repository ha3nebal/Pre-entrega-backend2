import { Router } from "express";
import passport from "passport";

import {
    getSession,
    register,
    login,
    currentUser,
    logout
} from "../controllers/sessions.controller.js";



const router = Router();

router.get("/", getSession);

router.post(
    "/register",
    passport.authenticate("register", {
        session: false
    }),
    register
);

router.post(
    "/login",
    passport.authenticate("login", {
        session: false
    }),
    login
);

router.get(
    "/current",
    (req, res, next) => {
        passport.authenticate(
            "current",
            {
                session: false
            },
            (error, user, info) => {

                if (error) {
                    return next(error);
                }

                if (!user) {
                    const authError = new Error("No autenticado");
                    authError.statusCode = 401;

                    return next(authError);
                }

                req.user = user;

                next();
            }
        )(req, res, next);
    },
    currentUser
);

router.post(
    "/logout",
    logout
);

export default router;