import mongoose from "mongoose";

const userschema = mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String },
    desc: { type: String },
    joinedon: { type: Date, default: Date.now },
    points: { type: Number, default: 0 } // New field for storing points
});

export default mongoose.model("User", userschema);
