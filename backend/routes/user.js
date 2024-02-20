const express = require("express");
const UserController = require("../controllers/user");
const router = express.Router();
const checkAuth = require("../middlewares/check-auth");
const extractFile = require("../middlewares/file");

router.post("/api/users/signup", UserController.createUser);

router.post("/api/users/login", UserController.login);

router.put(
  "/api/users/update/:id",

  extractFile,
  UserController.updateProfile
);

router.get("/api/users", UserController.getUsers);

router.get("/api/users/:id", UserController.getSingleUser);

module.exports = router;
