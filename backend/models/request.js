import mongoose from "mongoose";
const { Schema } = mongoose;

// Define schema for ride requests
const rideRequestSchema = new Schema({
  source: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "driver",
    required: true,
  },
  passengerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "passenger",
  },
  // Optional timestamp field if needed
  // timestamp: {
  //   type: Date,
  //   default: Date.now,
  // }
});

// Create RideRequest model
const RideRequest = mongoose.model("RideRequest", rideRequestSchema);

// Export the model
export default RideRequest;
