import express from "express";

import eventsRouter from "./routes/events.router.js";
import sessionsRouter from "./routes/sessions.router.js";

import { notFound } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {

    res.status(200).json({
        status: "ok",
        message: "Servidor activo"
    });

});

app.use("/api/events", eventsRouter);

app.use("/api/sessions", sessionsRouter);

// Siempre al final

app.use(notFound);

app.use(errorHandler);

export default app;