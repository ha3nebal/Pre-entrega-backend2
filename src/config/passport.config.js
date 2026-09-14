import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";


import userRepository from "../repositories/user.repository.js";

import {
    hashPassword
} from "../utils/hash.js";



const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;




passport.use(
    "register",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true
        },

        async (req, email, password, done) => {

            try {

                const {
                    first_name,
                    last_name
                } = req.body;

                // Validar campos obligatorios
                if (
                    !first_name ||
                    !last_name ||
                    !email ||
                    !password
                ) {
                    const error = new Error(
                        "Faltan campos obligatorios"
                    );

                    error.statusCode = 400;

                    return done(error);
                }

                // Normalizar datos
                const normalizedFirstName =
                    first_name.trim();

                const normalizedLastName =
                    last_name.trim();

                const normalizedEmail =
                    email.trim().toLowerCase();

                // Validar email
                if (!EMAIL_REGEX.test(normalizedEmail)) {

                    const error = new Error(
                        "El formato del email no es válido"
                    );

                    error.statusCode = 400;

                    return done(error);
                }

                // Validar contraseña
                if (password.length < MIN_PASSWORD_LENGTH) {

                    const error = new Error(
                        `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`
                    );

                    error.statusCode = 400;

                    return done(error);
                }

                // Verificar email duplicado
                const existingUser =
                    await userRepository.getUserByEmail(
                        normalizedEmail
                    );

                if (existingUser) {

                    const error = new Error(
                        "El email ya está registrado"
                    );

                    error.statusCode = 409;

                    return done(error);
                }

                // Generar hash de contraseña
                const hashedPassword =
                    await hashPassword(password);


                // Crear usuario
                const user =
                    await userRepository.createUser({

                        first_name: normalizedFirstName,

                        last_name: normalizedLastName,

                        email: normalizedEmail,

                        password: hashedPassword

                    });

                // Usuario seguro
                const safeUser = {

                    id: user._id.toString(),

                    first_name: user.first_name,

                    last_name: user.last_name,

                    email: user.email,

                    role: user.role

                };


                return done(null, safeUser);

            } catch (error) {

                return done(error);

            }

        }
    )
);




export default passport;