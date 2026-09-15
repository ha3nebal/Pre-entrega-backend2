import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

import userRepository from "../repositories/user.repository.js";

import {
    hashPassword,
    comparePassword
} from "../utils/hash.js";

import { config } from "./env.js";


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

passport.use(
    "login",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password"
        },

        async (email, password, done) => {

            try {

                const normalizedEmail =
                    email?.trim().toLowerCase();

                // Buscar usuario
                const user =
                    await userRepository.getUserByEmail(
                        normalizedEmail
                    );

                // Credenciales inválidas
                if (!user) {

                    const error = new Error(
                        "Credenciales inválidas"
                    );

                    error.statusCode = 401;

                    return done(error);
                }

                // Comparar contraseña
                const isValidPassword =
                    await comparePassword(
                        password,
                        user.password
                    );

                if (!isValidPassword) {

                    const error = new Error(
                        "Credenciales inválidas"
                    );

                    error.statusCode = 401;

                    return done(error);
                }

                // Login correcto
                return done(null, user);

            } catch (error) {

                return done(error);

            }
        }
    )
);

passport.use(
    "current",
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => req.cookies?.currentUser || null
            ]),
            secretOrKey: config.JWT_SECRET
        },

        async (payload, done) => {

            try {

                if (
                    !payload ||
                    !payload.id ||
                    !payload.email ||
                    !payload.role
                ) {
                    const error = new Error(
                        "No autenticado"
                    );

                    error.statusCode = 401;

                    return done(error);
                }

                return done(null, {
                    id: payload.id,
                    email: payload.email,
                    role: payload.role
                });

            } catch (error) {

                return done(error);

            }
        }
    )
);




export default passport;