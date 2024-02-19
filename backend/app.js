const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const postRoutes = require("./routes/post");
const userRoutes = require("./routes/user");

const app = express();

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_DB_ATLAS_USERNAME}:${process.env.MONGO_DB_ATLAS_PW}@cluster0.67goecf.mongodb.net/node-angular`
  )
  .then(() => {
    console.log("Connected to database");
  })
  .catch(() => {
    console.log("Connection failed");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, expirationDate, user"
  );
  res.setHeader("Access-Control-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "PUT", "POST", "DELETE"], // Add PUT to the allowed methods
  })
);

app.use("", postRoutes);
app.use("", userRoutes);

module.exports = app;
