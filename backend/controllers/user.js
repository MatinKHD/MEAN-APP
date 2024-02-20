const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res, next) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  try {
    const user = new User({
      name: req.body.name,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hash,
    });

    const createdUser = await user.save();
    res.status(201).json({
      message: "user created successfully",
      user: {
        id: createdUser._id,
        name: createdUser.name,
        lastname: createdUser.lastname,
        email: createdUser.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const fetchedUser = await User.findOne({ email: req.body.email });
    if (!fetchedUser) {
      return res.status(401).json({
        message: "this email doesn't exist",
      });
    }
    const comparedUser = bcrypt.compare(
      fetchedUser.password,
      req.body.password
    );

    if (!comparedUser) {
      return res.status(401).json({
        message: "password is incorrect",
      });
    }

    const token = jwt.sign(
      { email: fetchedUser.email, id: fetchedUser._id },
      process.env.JWT_KEY,
      { expiresIn: "1hr" }
    );

    res.status(201).json({
      message: "user logged in successfully",
      token,
      user: {
        id: fetchedUser._id,
        name: fetchedUser.name,
        lastname: fetchedUser.lastname,
        email: fetchedUser.email,
        imagePath: fetchedUser.imagePath ? fetchedUser.imagePath : "",
        gender: fetchedUser.gender ? fetchedUser.gender : "",
      },
      expiresIn: 3600000,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/user-profile/" + req.file?.filename;
  }
  const id = req.params.id;
  const token = req.headers.authorization.split(" ")[1];

  const user = new User({
    _id: id,
    name: req.body.name,
    lastname: req.body.lastname,
    imagePath,
    email: req.body.email,
    gender: req.body.gender,
  });

  try {
    const filter = {
      $and: [{ _id: id }],
    };
    const update = {
      $set: user,
    };
    const updatedUser = await User.updateOne(filter, update);
    console.log(updatedUser);
    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    if (updatedUser.matchedCount > 0) {
      return res.status(200).json({
        message: "user updated successfully",
        user: {
          id: user._id,
          name: user.name,
          lastname: user.lastname,
          imagePath: user.imagePath,
          gender: user.gender,
          email: user.email,
        },
        token,
        expiresIn: "3600000",
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

exports.getSingleUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const fetchedUser = await User.findOne({ _id: id });
    if (!fetchedUser) {
      res.status(404).json({
        message: "user not found",
      });
    }
    res.status(200).json({
      message: "user fetched successfully",
      user: {
        name: fetchedUser.name,
        lastname: fetchedUser.lastname,
        email: fetchedUser.email,
        imagePath: fetchedUser.imagePath,
        gender: fetchedUser.gender,
      },
      expirationDate: "3600000",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server Error",
      error,
    });
  }
};

exports.getUsers = async (req, res, next) => {
  fetchedUsers = await User.find();

  const users = fetchedUsers.map((user) => ({
    id: user._id,
    name: user.name,
    lastname: user.lastname,
    email: user.email,
    gender: user.gender,
    imagePath: user.imagePath,
  }));

  res.status(200).json({
    message: "users fetched successfully",
    users,
  });
};
