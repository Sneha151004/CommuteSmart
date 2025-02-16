// models/passenger.js

import mongoose from 'mongoose';
const { Schema } = mongoose;

const PassengerSchema = new Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'driver',
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

const Passenger = mongoose.model('passenger', PassengerSchema);
export default Passenger;
