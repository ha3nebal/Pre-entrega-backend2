import { Router } from "express";

import {
    getSession,
    register,
    login,
    currentUser,
    logout
} from "../controllers/sessions.controller.js";

import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getSession);

router.post("/register", register);

router.post("/login", login);

router.get("/current", auth, currentUser);

router.post("/logout", logout);

export default router;