const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true
  },
  image: {
    type: String,
  },
  body: {
    type: String,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  likedBy: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Blog = mongoose.model('Blog', blogSchema)
module.exports = Blog