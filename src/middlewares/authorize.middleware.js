import { sendError } from "../utils/response.js";

export const authorize = (...allowedRoles) => {

    return (req, res, next) => {

        if (!req.user) {
            return sendError(
                res,
                "No autenticado",
                401
            );
        }

        if (!allowedRoles.includes(req.user.role)) {
            return sendError(
                res,
                "No tenés permisos para realizar esta acción",
                403
            );
        }

        next();
    };
};