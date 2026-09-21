import { getAllUsers } from "../services/users.service.js";
import { sendSuccess } from "../utils/response.js";

export const getUsers = async (req, res, next) => {
    try {
        const users = await getAllUsers();

        // Nunca debemos devolver las contraseñas
        const usersWithoutPassword = users.map((user) => {
            const userObject = user.toObject();
            delete userObject.password;
            return userObject;
        });

        sendSuccess(res, usersWithoutPassword);
    } catch (error) {
        next(error);
    }
};