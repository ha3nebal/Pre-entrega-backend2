import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    description: String,

    date: Date,

    location: String,

    capacity: Number

}, {
    timestamps: true
});

export default mongoose.model("Event", eventSchema);