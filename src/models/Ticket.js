import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "El usuario es obligatorio"]
        },

        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: [true, "El evento es obligatorio"]
        },

        status: {
            type: String,
            enum: ["confirmed", "pending", "cancelled"],
            default: "confirmed"
        },

        quantity: {
            type: Number,
            required: [true, "La cantidad es obligatoria"],
            min: [1, "La cantidad debe ser mayor que cero"]
        },

        reservationCode: {
            type: String,
            required: [true, "El código de reserva es obligatorio"],
            unique: true,
            trim: true
        },

        cancelledAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model("Ticket", ticketSchema);