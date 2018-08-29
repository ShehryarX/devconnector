const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Post model
const Post = require("../../models/Post");

// validation
const validatePostInput = require("../../validation/post");

// @route   GET api/posts/test
// @desc    Tests Posts route
// @access  Public
router.get("/test", (req, res) => res.json({ message: "Posts works" }));

// @route   GET api/posts/
// @desc    Get posts
// @access  Public
router.get("/", (req, res) => {
  // fetch posts ordered by date
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404));
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get("/:id", (req, res) => {
  // fetch posts ordered by date
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: "No post found with that ID" })
    );
});

// @route   POST api/posts/
// @desc    Create post
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // check validation
    if (!isValid) {
      // if any errors, send 400 with errors object
      res.status(400).json({ nopostsfound: "No posts found" });
    }

    // avatar, name will come from React application
    const { text, name, avatar } = req.body;
    const { id } = req.user;

    const newPost = new Post({
      text,
      name,
      avatar,
      user: id
    });

    // save post
    newPost.save().then(post => res.json(post));
  }
);

module.exports = router;
