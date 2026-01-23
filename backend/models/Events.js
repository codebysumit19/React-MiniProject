import mongoose from "mongoose";

const eventsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  date: { type: Date, required: true },
  stime: { type: String, required: true },
  etime: { type: String, required: true },
  type: { type: String, required: true },
  happend: {
    type: String,
    required: true,
    enum: ["Yes", "No"],
  },
});

const Events = mongoose.model("Events", eventsSchema);
export default Events;
