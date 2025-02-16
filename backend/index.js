// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }
// const express = require("express");
// const cors = require("cors");
// const connectToDB = require("./db.js");
// const app = express();

// app.use(express.json());
// app.use(cors());

// connectToDB();

// app.use("", require("./routes/auth"));
// app.use("/community", require("./routes/Campaign"));
// app.use("/community", require("./routes/Comments"));
// app.use("/driver", require("./routes/ride"));
// app.use("/passenger", require("./routes/askRide"));
// app.use("/leaderboard", require("./routes/Leaderboard"));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Serving on port ${PORT}`);
// });


// index.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectToDB from './db.js';
import authRoutes from './routes/auth.js';
import campaignRoutes from './routes/Campaign.js';
import commentsRoutes from './routes/Comments.js';
import rideRoutes from './routes/ride.js';
import askRideRoutes from './routes/askRide.js';
import leaderboardRoutes from './routes/Leaderboard.js';

// Load environment variables (only in non-production)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = express();

// Middleware setup
app.use(express.json());
app.use(cors());

// Database connection
connectToDB();

// Routes
app.use('', authRoutes);
app.use('/community', campaignRoutes);
app.use('/community', commentsRoutes);
app.use('/driver', rideRoutes);
app.use('/passenger', askRideRoutes);
app.use('/leaderboard', leaderboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
