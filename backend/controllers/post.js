const Post = require("../models/post");

exports.create = async (req, res, next) => {
  let imagePath;
  const url = req.protocol + "://" + req.get("host");
  imagePath = url + "/images/" + req.file?.filename;
  const user = JSON.parse(req.headers.user);
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath,
    creator: req.userData.id,
    creatorName: user.name,
    creatorAvatar: user.imagePath,
  });

  try {
    const createdPost = await post.save();
    console.log(createdPost);
    if (!createdPost) {
      res.status(400).json({
        message: "post not saved",
      });
    }

    res.status(201).json({
      message: "post created successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
      error,
    });
  }
};

exports.update = async (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.portocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file?.filename;
  }
  const id = req.params.id;
  const post = new Post({
    _id: id,
    title: req.body.title,
    content: req.body.content,
    imagePath,
    creator: req.body.creator,
    craetorName: createdPost.craetorName,
    creatorAvatar: createdPost.creatorAvatar,
  });

  try {
    const filter = {
      $and: [{ _id: id }, { creator: req.userData.id }],
    };
    const update = {
      $set: post,
    };
    const updatedPost = await Post.updateOne(filter, update);

    if (!updatedPost) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    if (updatedPost.matchedCount > 0) {
      return res.status(200).json({
        message: "post updated successfully",
        post: {
          id: post._id,
          title: post.title,
          content: post.content,
          imagePath: post.imagePath,
          creator: req.body.creator,
          craetorName: createdPost.craetorName,
          creatorAvatar: createdPost.creatorAvatar,
        },
      });
    } else {
      return res.status(401).json({
        message: "not authorized",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server",
    });
  }
};

exports.getAllPosts = async (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.currentPage;

  const postQuerry = Post.find();

  let fetchedPosts;
  if (pageSize) {
    postQuerry.skip(pageSize * currentPage).limit(pageSize);
  }
  postQuerry
    .then((doccument) => {
      fetchedPosts = doccument;
      return Post.countDocuments();
    })
    .then((count) => {
      const posts = fetchedPosts.map((post) => ({
        id: post._id,
        title: post.title,
        content: post.content,
        imagePath: post.imagePath,
        creator: post.creator,
        creatorAvatar: post.creatorAvatar,
        creatorName: post.creatorName,
        showMenu: false,
      }));
      res.status(200).json({
        message: "posts are fetched successfully",
        posts: posts,
        maxPosts: count,
      });
    });
};

exports.getSinglePost = (req, res, next) => {
  const id = req.params.id;
  Post.findOne({ _id: id }).then((resualt) => {
    res.status(200).json({
      message: "post fetched successfully",
      post: {
        id: resualt._id,
        title: resualt.title,
        content: resualt.content,
        imagePath: resualt.imagePath,
      },
    });
  });
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.id;
  try {
    const filter = {
      $and: [{ _id: postId }, { creator: req.userData.id }],
    };
    const deletedItem = await Post.deleteOne(filter);
    console.log(deletedItem);
    if (!deletedItem) {
      return res.status(403).json({
        message: "forbidden: You are not allowed to delete this item.",
      });
    } else {
      return res.status(204).end();
    }
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
