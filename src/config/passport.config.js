import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

import {
    registerUser,
    loginUser
} from "../services/sessions.service.js";

import { config } from "./env.js";

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
                const user = await registerUser({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email,
                    password
                });

                return done(null, user);
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
                const result = await loginUser(
                    email,
                    password
                );

                return done(null, result);
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