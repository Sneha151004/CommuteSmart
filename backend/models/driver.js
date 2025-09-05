import mongoose from "mongoose";
const { Schema } = mongoose;

const DriverSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Changed from "user" to "User"
    required: [true, "User ID is required"],
  },
  passenger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Passenger", // Changed from "passenger" to "Passenger"
  },
  requests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RideRequest", // Changed from "Request" to "RideRequest"
    },
  ],
  vehicle: {
    type: String,
    required: [true, "Vehicle type is required"],
  },
  seats: {
    type: Number,
    required: [true, "Seats count is required"],
    min: 1,
  },
  status: {
    type: String,
    enum: ["available", "on_ride", "unavailable"],
    default: "available",
  },
  source: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: [true, "Source coordinates are required"],
      validate: {
        validator: function (val) {
          return val.length === 2;
        },
        message: "Source coordinates must be an array of [longitude, latitude]",
      },
    },
  },
  destination: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: [true, "Destination coordinates are required"],
      validate: {
        validator: function (val) {
          return val.length === 2;
        },
        message: "Destination coordinates must be an array of [longitude, latitude]",
      },
    },
  },
});

DriverSchema.index({ "source.coordinates": "2dsphere" });

const Driver = mongoose.model("Driver", DriverSchema);
export default Driver;
