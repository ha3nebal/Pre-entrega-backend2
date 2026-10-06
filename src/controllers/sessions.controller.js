import {
    getSessionInfo
} from "../services/sessions.service.js";

import {
    toAuthenticatedUserDTO
} from "../dto/user.dto.js";

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

        sendSuccess(
            res,
            req.user,
            201
        );

    } catch (error) {

        next(error);

    }

};


export const login = async (req, res, next) => {
    try {
        const { token, user } = req.user;

        res.cookie(
            "currentUser",
            token,
            {
                httpOnly: true,
                sameSite: "lax",
                maxAge: 3600000,
                secure: process.env.NODE_ENV === "production"
            }
        );

        sendSuccess(
            res,
            {
                message: "Login correcto"
            }
        );
    } catch (error) {

        next(error);

    }
};


export const currentUser = (req, res) => {
    sendSuccess(
        res,
        toAuthenticatedUserDTO(req.user)
    );
};


export const logout = (req, res) => {

    res.clearCookie("currentUser");

    res.status(200).json({
        status: "success",
        message: "Sesión cerrada"
    });

};