import {
    getSessionInfo,
    registerUser
} from "../services/sessions.service.js";

import { sendSuccess } from "../utils/response.js";

export const getSession = async (req, res, next) => {

    try {

        const session = await getSessionInfo();

        sendSuccess(res, session);

    } catch (error) {

        next(error);

    }

};

export const register = async (req, res, next) => {

    try {

        const user = await registerUser(req.body);

        sendSuccess(res, user, 201);

    } catch (error) {

        next(error);

    }

};