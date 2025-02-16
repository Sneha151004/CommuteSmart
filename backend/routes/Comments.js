import express from 'express';
import fetchuser from '../middleware/fetchUser.js'; // Import fetchUser as an ES module
import Comment from '../models/comment.js'; // Import Comment model as an ES module
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Get all comments: GET
router.get('/fetchallcomments', async (req, res) => {
  try {
    const comments = await Comment.find({});
    res.json(comments);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Add a comment: POST
router.post('/addcomment', fetchuser, async (req, res) => {
  try {
    const { content, date, author } = req.body;
    const comment = new Comment({
      user: req.user.id,
      content,
      date,
      author,
    });
    const savedComment = await comment.save();
    res.json(savedComment);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a comment: DELETE
router.delete('/deletecomment/:id', fetchuser, async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).send('NOT FOUND');
    }
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).send('Not Allowed');
    }
    comment = await Comment.findByIdAndDelete(req.params.id);
    res.json({ Success: 'Comment has been deleted', comment: comment });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

export default router; // Export router as an ES module
