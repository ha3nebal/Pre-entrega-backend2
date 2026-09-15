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
            enum: ["ACTIVE", "CANCELLED"],
            default: "ACTIVE"
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model("Ticket", ticketSchema);