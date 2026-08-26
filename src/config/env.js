import dotenv from "dotenv";

dotenv.config();

export const config = {
    PORT: process.env.PORT || 8080,
    NODE_ENV: process.env.NODE_ENV,
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN
};