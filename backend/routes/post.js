const express = require("express");

const PostController = require("../controllers/post");

const checkAuth = require("../middlewares/check-auth");
const extractFile = require("../middlewares/file");

const router = express.Router();

router.post("/api/posts/create", checkAuth, extractFile, PostController.create);

router.put("/api/posts/:id", checkAuth, extractFile, PostController.update);

router.get("/api/posts", PostController.getAllPosts);

router.get("/api/posts/:id", PostController.getSinglePost);

router.delete("/api/posts/:id", checkAuth, PostController.deletePost);

module.exports = router;
