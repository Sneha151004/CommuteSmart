// import mongoose from 'mongoose';

// const { Schema } = mongoose;

// const CommentSchema = new Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'user',
//   },
//   content: {
//     type: String,
//     required: true,
//   },
//   date: {
//     type: Date,
//     required: true,
//   },
//   author: {
//     type: String,
//     required: true,
//   },
// });

// const Comment = mongoose.model('comment', CommentSchema);

// export default Comment; // Export the Comment model as an ES module

import mongoose from 'mongoose';
const { Schema } = mongoose;

const CommentSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Changed from "user" to "User"
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
});

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
