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


// ======================================================
// STRATEGY: REGISTER
// ======================================================

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

                // Validación de campos obligatorios
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


                // Normalización
                const normalizedFirstName =
                    first_name.trim();

                const normalizedLastName =
                    last_name.trim();

                const normalizedEmail =
                    email.trim().toLowerCase();


                // Validación email
                if (!EMAIL_REGEX.test(normalizedEmail)) {

                    const error = new Error(
                        "El formato del email no es válido"
                    );

                    error.statusCode = 400;

                    return done(error);
                }


                // Validación password
                if (password.length < MIN_PASSWORD_LENGTH) {

                    const error = new Error(
                        `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`
                    );

                    error.statusCode = 400;

                    return done(error);
                }


                // Verificar email existente
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


                // Hash de contraseña
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


                // Usuario seguro para req.user
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


// ======================================================
// STRATEGY: LOGIN
// ======================================================

passport.use(
    "login",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password"
        },

        async (email, password, done) => {

            try {

                if (!email || !password) {

                    const error = new Error(
                        "Credenciales inválidas"
                    );

                    error.statusCode = 401;

                    return done(error);
                }


                const normalizedEmail =
                    email.trim().toLowerCase();


                const user =
                    await userRepository.getUserByEmail(
                        normalizedEmail
                    );


                if (!user) {

                    const error = new Error(
                        "Credenciales inválidas"
                    );

                    error.statusCode = 401;

                    return done(error);
                }


                const passwordValid =
                    await comparePassword(
                        password,
                        user.password
                    );


                if (!passwordValid) {

                    const error = new Error(
                        "Credenciales inválidas"
                    );

                    error.statusCode = 401;

                    return done(error);
                }


                return done(null, user);

            } catch (error) {

                return done(error);

            }

        }
    )
);


// ======================================================
// STRATEGY: CURRENT
// ======================================================

passport.use(
    "current",
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => {

                    return req.cookies?.currentUser || null;

                }
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


                const safeUser = {

                    id: payload.id,

                    email: payload.email,

                    role: payload.role

                };


                return done(null, safeUser);

            } catch (error) {

                return done(error);

            }

        }
    )
);

export default passport;