import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "El título es obligatorio"],
            trim: true
        },

        description: {
            type: String,
            required: [true, "La descripción es obligatoria"],
            trim: true
        },

        date: {
            type: Date,
            required: [true, "La fecha es obligatoria"]
        },

        location: {
            type: String,
            required: [true, "La ubicación es obligatoria"],
            trim: true
        },

        capacity: {
            type: Number,
            required: true,
            min: [1, "La capacidad debe ser mayor que cero"]
        },

        organizer: {
            type: String,
            default: "Administrador"
        },

        status: {
            type: String,
            enum: ["ACTIVE", "CANCELLED", "FINISHED"],
            default: "ACTIVE"
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model("Event", eventSchema);