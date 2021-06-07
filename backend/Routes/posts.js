const express = require("express");
const routes = express.Router();
const multer = require("multer");

const Post = require("../models/post");

const MineTypeMap = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isvalid = MineTypeMap[file.mimetype];
    let err = new Error("invalid mime type");
    if (isvalid) {
      err = null;
    }
    cb(err, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(" ").join("-");
    const ext = MineTypeMap[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);

    // cb(null,"backend/images");
  },
});
routes.get("", (req, res) => {
  Post.find().then((result) => {
    res.status(200).json({
      message: "fetched data from the node server successfully",
      posts: result,
    });
  });
});
routes.post("", multer({ storage: storage }).single("image"), (req, res) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagepath: url + "/images/" + req.file.filename,
  });
  post.save().then((result) => {
    res.status(201).json({
      message: "post added Successfully",
      post: {
        id: result._id,
        title: result.title,
        content: result.content,
        imagepath: result.imagepath,
      },
    });
  });
  console.log(post);
});
routes.put(
  "/:id",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    console.log(req.file);
    let imagepath = req.body.imagepath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagepath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagepath: imagepath,
    });
    console.log(post);
    Post.updateOne({ _id: req.params.id }, post).then((result) => {
      console.log(result);
      res.status(200).json({ message: "Update successful!" });
    });
  }
);
routes.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});
routes.delete("/:id", (req, res) => {
  console.log(req.params.id);
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    res.status(200).json({
      message: "post was deleted",
    });
    console.log(result);
  });
});
module.exports = routes;
