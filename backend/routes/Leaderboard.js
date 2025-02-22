import express from 'express';
import fetchuser from '../middleware/fetchUser.js';
import { Leaderboard } from '../models/leaderboard.js'; // Using named import

const router = express.Router();

// Route to update the leaderboard
router.post('/update-leaderboard', fetchuser, async (req, res) => {
  const { Sname, coins } = req.body;
  try {
    await Leaderboard.updateOne(
      { Sname },
      { $inc: { coins: coins }, $set: { user: req.user.id } },
      { upsert: true }
    );

    const leaderboardData = await Leaderboard.find().sort({ coins: -1 });
    leaderboardData.forEach(async (entry, index) => {
      await Leaderboard.updateOne({ _id: entry._id }, { rank: index + 1 });
    });

    res.status(200).json(leaderboardData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to fetch the full leaderboard data
router.get('/', async (req, res) => {
  try {
    const leaderboardData = await Leaderboard.find().sort({ coins: -1 });
    res.status(200).json(leaderboardData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
