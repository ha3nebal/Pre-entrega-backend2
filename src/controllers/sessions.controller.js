import { getSessionInfo } from "../services/sessions.service.js";

export const getSession = (req, res) => {

    const session = getSessionInfo();

    sendSuccess(res,session);

};