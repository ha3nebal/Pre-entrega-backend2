import userRepository from "../repositories/user.repository.js";
import { hashPassword } from "../utils/hash.js";

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