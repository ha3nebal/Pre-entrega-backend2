import { verifyToken } from "../utils/jwt.js";
import { sendError } from "../utils/response.js";

export const auth = (req, res, next) => {

    try {

        const token = req.cookies.currentUser;

        if (!token) {
            return sendError(res, "No autenticado", 401);
        }

        const payload = verifyToken(token);

        req.user = payload;

        next();

    } catch (error) {

        return sendError(res, "No autenticado", 401);

    }
};