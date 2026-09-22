import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true
        },

        status: {
            type: String,
            enum: ["confirmed", "pending", "cancelled"],
            default: "confirmed"
        },

        quantity: {
            type: Number,
            required: true,
            min: [1, "La cantidad debe ser mayor que cero"]
        },

        reservationCode: {
            type: String,
            required: true,
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