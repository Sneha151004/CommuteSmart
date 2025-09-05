import express from "express";
import Driver from "../models/driver.js";
import RideRequest from "../models/request.js";
import fetchUser from "../middleware/fetchUser.js";
import Passenger from "../models/passenger.js";
import mongoose from "mongoose";
import { sendEmail } from './nodemailer.js';  // Adjust the path to where your nodemailer

const router = express.Router();

// Route to fetch available drivers based on source and destination
// router.get("/availabledrivers", async (req, res) => {
//   console.log("Inside Available Drivers Route...");
//   const { source, destination } = req.query; // Extract source and destination from query parameters

//   try {
//     // Create a new passenger instance
//     const newPassenger = new Passenger({ source, destination });
//     // Save the new passenger instance to the database
//     await newPassenger.save();
//     // Query the database for drivers with matching source and destination
//     const availableDrivers = await Driver.find({ source, destination });

//     // Send the list of available drivers as a JSON response
//     res.json({ availableDrivers, newPassenger });
//   } catch (error) {
//     console.error("Error fetching available drivers:", error);
//     res.status(500).json({ error: "Server Error" });
//   }
// });

router.get("/availabledrivers", async (req, res) => {
  console.log("Inside Available Drivers Route...");

  const { source, destination } = req.query;

  try {
    if (!source || !destination) {
      return res.status(400).json({ error: "Source and destination are required." });
    }

    // Extract and validate `name` and `coordinates`
    const sourceData = {
      name: source.name || "Unknown Location",
      coordinates: Array.isArray(source.coordinates) && source.coordinates.length === 2
        ? source.coordinates
        : [0, 0] // Default values
    };

    const destinationData = {
      name: destination.name || "Unknown Destination",
      coordinates: Array.isArray(destination.coordinates) && destination.coordinates.length === 2
        ? destination.coordinates
        : [0, 0]
    };

    // Create a new passenger instance
    const newPassenger = new Passenger({ source: sourceData, destination: destinationData });

    // Save the new passenger instance to the database
    await newPassenger.save();

    // Query the database for drivers with matching source and destination
    const availableDrivers = await Driver.find({ "source.name": source.name, "destination.name": destination.name });

    // Send the list of available drivers as a JSON response
    res.json({ availableDrivers, newPassenger });
  } catch (error) {
    console.error("Error fetching available drivers:", error);
    res.status(500).json({ error: "Server Error" });
  }
});


// Handle ride request from passenger
// TODO: OLD
// POST request to handle ride request

// router.post("/askride/:driverId", async (req, res) => {
//   console.log("Inside Offering ride...");

//   const { source, destination, passengerId } = req.body;
//   const driverId = req.params.driverId;

//   console.log("DriverId:", driverId);

//   try {
//     // Fetch driver details
//     const driver = await Driver.findById(driverId);
//     if (!driver) {
//       return res.status(404).json({ error: "Driver not found." });
//     }

//     console.log("Driver details:", driver);
//     console.log("Source:", source, "Destination:", destination, "PassengerId:", passengerId);

//     // Check if ride request already exists
//     const existingRequest = await RideRequest.findOne({ driverId, passengerId });
//     if (existingRequest) {
//       return res.status(400).json({ error: `You have already sent a ride request to this driver (ID: ${driverId}).` });
//     }

//     // Ensure source and destination have lat/lng
//     if (!source.lat || !source.lng || !destination.lat || !destination.lng) {
//       return res.status(400).json({ error: "Source and destination must have latitude and longitude." });
//     }

//     // Convert into GeoJSON format
//     const formattedSource = {
//       type: "Point",
//       coordinates: [source.lng, source.lat], // [longitude, latitude]
//     };

//     const formattedDestination = {
//       type: "Point",
//       coordinates: [destination.lng, destination.lat],
//     };

//     // Create and save a new ride request
//     const newRideRequest = new RideRequest({
//       source: formattedSource,
//       destination: formattedDestination,
//       driverId,
//       passengerId,
//     });

//     await newRideRequest.save();

//     console.log("AAge chall rha bhai...");

//     // Prepare the mail options
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: driver.email || "manoj.1si22cs102@gmail.com",
//       subject: "New Ride Request",
//       text: `You have received a new ride request from passenger with ID: ${passengerId}.
//             \nSource: ${JSON.stringify(source)}
//             \nDestination: ${JSON.stringify(destination)}
//             \nPlease check your ride requests for more details.`,
//     };

//     // Send the email to the driver
//     await sendEmail(mailOptions);

//     // Send success response
//     res.status(201).json({
//       message: "Ride request sent successfully",
//       rideRequest: newRideRequest,
//     });
//   } catch (error) {
//     console.error("Error sending ride request:", error);
//     res.status(500).json({ error: "Server Error" });
//   }
// });


router.post("/askride/:driverId", async (req, res) => {
  console.log("Inside Offering ride...");
  console.log("Received Body Data:", req.body);

  const { source, destination, passengerId } = req.body;
  const driverId = req.params.driverId;

  console.log("DriverId:", driverId);

  try {
    // Validate required fields
    if (!source || !destination) {
      return res.status(400).json({ error: "Source and Destination are required." });
    }
    if (!source.lat || !source.lng || !destination.lat || !destination.lng) {
      console.log("Invalid Source/Destination:", { source, destination });
      return res.status(400).json({ error: "Source and destination must have latitude and longitude." });
    }

    // Fetch driver details
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ error: "Driver not found." });
    }

    console.log("Driver details:", driver);
    console.log("Source:", source, "Destination:", destination, "PassengerId:", passengerId);

    // Check if ride request already exists
    const existingRequest = await RideRequest.findOne({ driverId, passengerId });
    if (existingRequest) {
      return res.status(400).json({ error: `You have already sent a ride request to this driver (ID: ${driverId}).` });
    }

    // Convert locations into GeoJSON format
    const formattedSource = {
      type: "Point",
      coordinates: [source.lng, source.lat], // [longitude, latitude]
    };

    const formattedDestination = {
      type: "Point",
      coordinates: [destination.lng, destination.lat],
    };

    // Create and save a new ride request
    const newRideRequest = new RideRequest({
      source: formattedSource,
      destination: formattedDestination,
      driverId,
      passengerId,
    });

    await newRideRequest.save();

    console.log("Ride request successfully saved.");

    // Prepare the mail options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: driver.email || "default@example.com", // Ensuring a fallback email
      subject: "New Ride Request",
      text: `You have received a new ride request from passenger with ID: ${passengerId}.
             \nSource: ${JSON.stringify(source)}
             \nDestination: ${JSON.stringify(destination)}
             \nPlease check your ride requests for more details.`,
    };

    // Send the email to the driver
    try {
      await sendEmail(mailOptions);
      console.log("Email notification sent to driver.");
    } catch (emailError) {
      console.error("Error sending email:", emailError);
    }

    // Send success response
    res.status(201).json({
      message: "Ride request sent successfully",
      rideRequest: newRideRequest,
    });

  } catch (error) {
    console.error("Error processing ride request:", error);
    res.status(500).json({ error: "Server Error. Please try again later." });
  }
});



// TODO: Give Ride
router.post("/giveride", async (req, res) => {
  console.log("Inside Give ride...");

  const { vehicle, seats, source, destination, userId } = req.body;

  // Validate required fields
  if (
    !vehicle ||
    !seats ||
    !source ||
    !destination ||
    !source.lat ||
    !source.lng ||
    !destination.lat ||
    !destination.lng ||
    !userId 
  ) {
    return res.status(400).json({ error: "All fields are required, including latitude, longitude, and userId" });
  }

  // Ensure seats is a valid number
  if (isNaN(seats)) {
    return res.status(400).json({ error: "Seats must be a valid number" });
  }

  try {
    // Format source and destination correctly
    const formattedSource = {
      type: "Point",
      coordinates: [source.lng, source.lat], // GeoJSON expects [longitude, latitude]
    };

    const formattedDestination = {
      type: "Point",
      coordinates: [destination.lng, destination.lat],
    };

    // Create a new instance of the Driver model
    const newDriver = new Driver({
      vehicle,
      seats,
      source: formattedSource,
      destination: formattedDestination,
      user: userId, // Replaced 'user' with 'userId'
    });

    // Save to the database
    await newDriver.save();

    res.status(201).json({ message: "Ride offered successfully", driverId: newDriver._id });
  } catch (error) {
    console.error("Error offering ride:", error);
    res.status(500).json({ error: "Server Error" });
  }
});



// Fetch ride requests for a specific driver
// router.get("/riderequests/:driverId", async (req, res) => {
//   const driverId = req.params.driverId;
//   console.log("Driver Id:", driverId);
//   try {
//     const rideRequests = await RideRequest.find({ driverId });
//     res.json({ rideRequests });
//   } catch (error) {
//     console.error("Error fetching ride requests:", error);
//     res.status(500).json({ error: "Server Error" });
//   }
// });



// TODO: BASED ON DRIVER ID WHICH IS WRONG APPROACH
//  Get ride requests for a specific driver
router.get("/riderequests/:driverId", async (req, res) => {
  try {
    const { driverId } = req.params;

    // Fetch ride requests where the driverId matches
    const rideRequests = await RideRequest.find({ driverId });

    if (!rideRequests || rideRequests.length === 0) {
      return res.status(404).json({ error: "No ride requests found for this driver." });
    }

    res.json({ rideRequests });
  } catch (error) {
    console.error("Error fetching ride requests:", error);
    res.status(500).json({ error: "Server error, please try again later." });
  }
});


// TODO:REQUEST BASED ON LOCATION
// Get ride requests near a given location
router.get("/riderequests", async (req, res) => {
  console.log("Inside Rider Requests Route...");
  try {
    const { latitude, longitude, radius } = req.query; // Get location from query params

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude and longitude are required." });
    }

    const searchRadius = radius ? parseFloat(radius) : 5; // Default: 5 km

    // Find ride requests near the given location
    const rideRequests = await RideRequest.find({
      "source.coordinates": {
        $geoWithin: {
          $centerSphere: [[parseFloat(longitude), parseFloat(latitude)], searchRadius / 6378.1], // Convert km to radians
        },
      },
    });

    if (!rideRequests.length) {
      return res.status(404).json({ error: "No ride requests found near this location." });
    }

    res.json({ rideRequests });
  } catch (error) {
    console.error("Error fetching ride requests:", error);
    res.status(500).json({ error: "Server error, please try again later." });
  }
});


// Delete driver
router.delete("/driver/:driverId", fetchUser, async (req, res) => {
  try {
    let driver = await Driver.findById(req.params.driverId);
    if (!driver) {
      return res.status(404).send("NOT FOUND");
    }
    driver = await Driver.findByIdAndDelete(req.params.driverId);
    res.json({ Success: "Driver has been deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Delete passenger
router.delete("/passenger/:passengerId", fetchUser, async (req, res) => {
  try {
    let passenger = await Driver.findById(req.params.passengerId);
    if (!passenger) {
      return res.status(404).send("NOT FOUND");
    }
    passenger = await Passenger.findByIdAndDelete(req.params.passengerId);
    res.json({ Success: "Passenger has been deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Delete ride request
router.delete("/request/:id", fetchUser, async (req, res) => {
  try {
    let request = await RideRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).send("NOT FOUND");
    }
    request = await RideRequest.findByIdAndDelete(req.params.id);
    res.json({ Success: "Request has been deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

export  default  router;