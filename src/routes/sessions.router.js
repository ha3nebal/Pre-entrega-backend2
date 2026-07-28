import { Router } from "express";

import { getSession } from "../controllers/sessions.controller.js";

const router = Router();

router.get("/", getSession);

export default router;