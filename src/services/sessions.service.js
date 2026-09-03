import userRepository from "../repositories/user.repository.js";

import {
    hashPassword,
    comparePassword
} from "../utils/hash.js";

import { generateToken } from "../utils/jwt.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

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

        const error = new Error("Faltan campos obligatorios");
        error.statusCode = 400;

        throw error;
    }

    // Normalizar datos
    const normalizedFirstName = first_name.trim();
    const normalizedLastName = last_name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    // Validar email
    if (!EMAIL_REGEX.test(normalizedEmail)) {

        const error = new Error("El formato del email no es válido");
        error.statusCode = 400;

        throw error;
    }

    // Validar longitud de contraseña
    if (password.length < MIN_PASSWORD_LENGTH) {

        const error = new Error(
            `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`
        );

        error.statusCode = 400;

        throw error;
    }

    // Verificar si el email ya existe
    const existingUser = await userRepository.getUserByEmail(
        normalizedEmail
    );

    if (existingUser) {

        const error = new Error("El email ya está registrado");
        error.statusCode = 409;

        throw error;
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

    // Nunca devolver password
    return {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
    };
};

export const loginUser = async (email, password) => {

    // Validar que lleguen las credenciales
    if (!email || !password) {

        const error = new Error("Credenciales inválidas");
        error.statusCode = 401;

        throw error;
    }

    // Normalizar email
    const normalizedEmail = email.trim().toLowerCase();

    // Buscar usuario
    const user = await userRepository.getUserByEmail(
        normalizedEmail
    );

    // Si el usuario no existe
    if (!user) {

        const error = new Error("Credenciales inválidas");
        error.statusCode = 401;

        throw error;
    }

    // Comparar contraseña recibida con el hash almacenado
    const passwordValid = await comparePassword(
        password,
        user.password
    );

    // Si la contraseña no coincide
    if (!passwordValid) {

        const error = new Error("Credenciales inválidas");
        error.statusCode = 401;

        throw error;
    }

    // Información mínima que tendrá el JWT
    const payload = {
        id: user._id.toString(),
        email: user.email,
        role: user.role
    };

    // Generar JWT
    const token = generateToken(payload);

    return token;
};