// // models/passenger.js

import mongoose from 'mongoose';
const { Schema } = mongoose;

// const PassengerSchema = new Schema({
//   driver: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'driver',
//   },
//   source: {
//     type: String,
//     required: true,
//   },
//   destination: {
//     type: String,
//     required: true,
//   },
// });

// const Passenger = mongoose.model('Passenger', PassengerSchema);
// export default Passenger;


// import mongoose from 'mongoose';
// const { Schema } = mongoose;

// const PassengerSchema = new Schema({
//   driver: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Driver", // Changed from "driver" to "Driver"
//   },
//   source: {
//     type: String,
//     required: true,
//   },
//   destination: {
//     type: String,
//     required: true,
//   },
// });


const PassengerSchema = new Schema({
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },
    source: {
      name: { type: String, required: true },
      coordinates: { type: [Number], required: true, default: [0, 0] } // Store coordinates properly
    },
    destination: {
      name: { type: String, required: true },
      coordinates: { type: [Number], required: true, default: [0, 0] }
    }
  });
  

const Passenger = mongoose.model("Passenger", PassengerSchema);
export default Passenger;


