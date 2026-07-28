import { getSessionInfo } from "../services/sessions.service.js";

export const getSession = (req, res) => {

    const session = getSessionInfo();

    res.status(200).json(session);

};