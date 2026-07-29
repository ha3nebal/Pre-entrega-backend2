import mongoose from "mongoose";
import { config } from "./env.js";

export const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URL);

        console.log("✅ MongoDB conectada");
    } catch (error) {
        console.error("❌ Error al conectar MongoDB");
        console.error(error.message);
        process.exit(1);
    }
};