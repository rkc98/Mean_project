const express = require("express");
const routes = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
routes.post("/signup", (req, res) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "data entered successfully",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          errormessage: err,
        });
      });
  });
});

module.exports = routes;
