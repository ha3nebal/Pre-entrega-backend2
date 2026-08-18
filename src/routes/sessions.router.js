import { Router } from "express";

import {
    getSession,
    register
} from "../controllers/sessions.controller.js";

const router = Router();

router.get("/", getSession);

router.post("/register", register);

export default router;