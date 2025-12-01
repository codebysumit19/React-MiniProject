import mongoose from "mongoose";

const eventsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  date: { type: Date, required: true },      // Date type
  stime: { type: String, required: true },   // String: "HH:MM"
  etime: { type: String, required: true },
  type: { type: String, required: true },
  happend: {
    type: String,
    required: true,
    enum: ["Yes", "No"], // Only accept "Yes" or "No"
  },
});

const Events = mongoose.model("Events", eventsSchema);
export default Events;
