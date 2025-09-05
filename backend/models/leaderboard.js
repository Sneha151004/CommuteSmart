// import mongoose from 'mongoose';
// const { Schema } = mongoose;

// const LeaderboardSchema = new Schema({
//   Sname: {
//     type: String,
//     required: true,
//   },
//   coins: {
//     type: Number,
//     required: true,
//   },
//   rank: {
//     type: Number,
//     default: 0,
//   },
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'user',
//   },
// });

// const Leaderboard = mongoose.model('Leaderboard', LeaderboardSchema);

// export { Leaderboard }; // Named export


import mongoose from 'mongoose';
const { Schema } = mongoose;

const LeaderboardSchema = new Schema({
  Sname: {
    type: String,
    required: true,
  },
  coins: {
    type: Number,
    required: true,
  },
  rank: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Changed from "user" to "User"
  },
});

const Leaderboard = mongoose.model("Leaderboard", LeaderboardSchema);

export { Leaderboard};