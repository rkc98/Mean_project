const express = require("express");
const app = express();
app.use(express.json());
const postroutes = require("./Routes/posts");
const usersroutes = require("./Routes/users");
const path = require("path");

const mongoose = require("mongoose");
// mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb
// mongodb+srv://root:root@cluster0.cnrex.mongodb.net/Testing?retryWrites=true&w=majority
mongoose
  .connect("mongodb+srv://root:root@cluster0.cnrex.mongodb.net/Testing?retryWrites=true&w=majority")
  .then(() => {
    console.log("connected to mongo db");
  })
  .catch((err) => {
    console.log("error message", err);
  });
app.use("/images", express.static(path.join("backend/images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,OPTIONS,PUT"
  );
  next();
});
app.use("/api/posts", postroutes);
app.use("/api/users", usersroutes);
module.exports = app;
