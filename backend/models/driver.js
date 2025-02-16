import mongoose from "mongoose";
const { Schema } = mongoose;

const DriverSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  passenger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "passenger",
  },
  requests: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "request",
  },
  vehicle: {
    type: String,
    required: true,
  },
  seats: {
    type: Number,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
});

const Driver = mongoose.model("Driver", DriverSchema);
export default Driver;
