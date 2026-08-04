import { getSessionInfo } from "../services/sessions.service.js";
import { sendSuccess } from "../utils/response.js";

export const getSession = async (req, res, next) => {

    try {

        const session = await getSessionInfo();

        sendSuccess(res, session);

    } catch (error) {

        next(error);

    }

};