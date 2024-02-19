const mongoose = require("mongoose");

const postShecma = mongoose.Schema({
  title: { type: String, defualt: "Title", required: true },
  content: { type: String, defualt: "Contnet", requird: true },
  imagePath: { type: String, required: true },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  creatorName: { type: String, ref: "User", required: true },
  creatorAvatar: { type: String, required: true },
});

const Post = mongoose.model("Post", postShecma);

module.exports = Post;
