// import mongoose from "mongoose";
// const { Schema } = mongoose;

// // Define schema for ride requests
// const rideRequestSchema = new Schema({
//   source: {
//     type: String,
//     required: true,
//   },
//   destination: {
//     type: String,
//     required: true,
//   },
//   driverId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "driver",
//     required: true,
//   },
//   passengerId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "passenger",
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now,
//   }
// });

// // Create RideRequest model
// const RideRequest = mongoose.model("RideRequest", rideRequestSchema);

// // Export the model
// export default RideRequest;
import mongoose from "mongoose";
const { Schema } = mongoose;

// Define schema for ride requests
const rideRequestSchema = new Schema({
  source: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  destination: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver", // Refers to Driver model
    required: true,
  },
  passengerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Passenger", // Refers to Passenger model
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Add GeoSpatial Indexing for location-based searches
rideRequestSchema.index({ source: "2dsphere" });

// Create RideRequest model
const RideRequest = mongoose.model("RideRequest", rideRequestSchema);

// Export the model
export default RideRequest;
