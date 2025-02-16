// routes/askRide.js
import express from 'express';
import fetchuser from '../middleware/fetchUser.js';
import { body, validationResult } from 'express-validator';
import Passenger from '../models/passenger.js';

const router = express.Router();

// Route to create passenger
router.post(
  '',
  fetchuser,
  [
    body('Pname', 'Enter a valid name').isLength({ min: 3 }),
    body('source', 'Source is required').notEmpty(),
    body('destination', 'Destination is required').notEmpty(),
    body('location', 'Location is required').isObject().notEmpty(),
  ],
  async (req, res) => {
    try {
      const { Pname, source, destination, location } = req.body; // Extract Pname and other fields
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Create a new passenger instance
      const newPassenger = new Passenger({
        Pname,          // Store the Pname in the database
        source,         // Store the source location
        destination,    // Store the destination location
        location,       // Store the location
      });

      // Save the new passenger to the database
      const savedPassenger = await newPassenger.save();

      // Respond with the saved passenger data
      res.status(201).json(savedPassenger);
    } catch (error) {
      console.error('Error creating new Passenger:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

// Delete the Passenger when they leave the page
router.delete('/:id', fetchuser, async (req, res) => {
  try {
    const deletedPassenger = await Passenger.findByIdAndDelete(req.params.id); // Use findByIdAndDelete for cleaner code
    if (!deletedPassenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }
    res.json({ message: 'Passenger deleted successfully' });
  } catch (error) {
    console.error('Error deleting Passenger:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Placeholder route to get location of passenger (future implementation)
router.get('/location/:id', async (req, res) => {
  try {
    const passenger = await Passenger.findById(req.params.id);
    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }
    res.json(passenger.location); // Assuming location is stored in the "location" field
  } catch (error) {
    console.error('Error fetching passenger location:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Placeholder route to get details of the passenger (future implementation)
router.get('/:id', async (req, res) => {
  try {
    const passenger = await Passenger.findById(req.params.id);
    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }
    res.json(passenger);
  } catch (error) {
    console.error('Error fetching passenger details:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Placeholder route to make a request to the driver (future implementation)
router.post('/:id/requestDriver', fetchuser, async (req, res) => {
  try {
    const passenger = await Passenger.findById(req.params.id);
    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }

    // Example: Here we can add logic to make a request to the driver.
    // Currently, this is just a placeholder.
    res.json({ message: 'Driver request sent successfully' });
  } catch (error) {
    console.error('Error making driver request:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
