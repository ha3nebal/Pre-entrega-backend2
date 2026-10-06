import userRepository from "../repositories/user.repository.js";

import {
    hashPassword,
    comparePassword
} from "../utils/hash.js";

import {
    toUserDTO,
    toAuthenticatedUserDTO
} from "../dto/user.dto.js";

import { generateToken } from "../utils/jwt.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

const createServiceError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

export const getSessionInfo = () => {
    return {
        status: "success",
        message: "Módulo de sesiones preparado."
    };
};

export const registerUser = async (userData) => {
    
    const {
        first_name,
        last_name,
        email,
        password
    } = userData;

    // Validar campos obligatorios
    if (!first_name || !last_name || !email || !password) {
        throw createServiceError(
            "Faltan campos obligatorios",
            400
        );
    }

    // Normalizar datos
    const normalizedFirstName = first_name.trim();
    const normalizedLastName = last_name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    // Validar que los campos no queden vacíos
    if (
        !normalizedFirstName ||
        !normalizedLastName ||
        !normalizedEmail
    ) {
        throw createServiceError(
            "Los campos obligatorios no pueden estar vacíos",
            400
        );
    }

    // Validar email
    if (!EMAIL_REGEX.test(normalizedEmail)) {
        throw createServiceError(
            "El formato del email no es válido",
            400
        );
    }

    // Validar longitud de contraseña
    if (password.length < MIN_PASSWORD_LENGTH) {
        throw createServiceError(
            `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`,
            400
        );
    }

    // Verificar si el email ya existe
    const existingUser =
        await userRepository.getUserByEmail(
            normalizedEmail
        );

    if (existingUser) {
        throw createServiceError(
            "El email ya está registrado",
            409
        );
    }

    // Hashear contraseña
    const hashedPassword = await hashPassword(password);

    // Crear usuario
    const user = await userRepository.createUser({
        first_name: normalizedFirstName,
        last_name: normalizedLastName,
        email: normalizedEmail,
        password: hashedPassword
    });

    // Transformar mediante DTO
    return toUserDTO(user);
};

export const loginUser = async (email, password) => {
    // Validar credenciales
    if (!email || !password) {
        throw createServiceError(
            "Credenciales inválidas",
            401
        );
    }

    // Normalizar email
    const normalizedEmail = email.trim().toLowerCase();

    // Buscar usuario
    const user =
        await userRepository.getUserByEmail(
            normalizedEmail
        );


    if (!user) {
        throw createServiceError(
            "Credenciales inválidas",
            401
        );
    }

    // Comparar contraseña
    const passwordValid = await comparePassword(
        password,
        user.password
    );


    if (!passwordValid) {
        throw createServiceError(
            "Credenciales inválidas",
            401
        );
    }

    // Información mínima para el JWT
    const payload = {
        id: user._id.toString(),
        email: user.email,
        role: user.role
    };

    // Generar JWT
    const token = generateToken(payload);

    return {
        token,
        user: toAuthenticatedUserDTO(user)
    };
};