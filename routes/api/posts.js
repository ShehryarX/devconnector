const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Post model
const Post = require("../../models/Post");

// Profile model
const Profile = require("../../models/Profile");

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
      return res.status(400).json(errors);
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

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // check for post owner

          // return unauthorized status
          if (post.user.toString() !== req.user.id)
            return res
              .status(401)
              .json({ notauthorized: "User not authorized" });

          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ postnotfound: "No post found" }));
    });
  }
);

// @route   POST api/posts/like/:id
// @desc    Like post
// @access  Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          )
            return res
              .status(400)
              .json({ alreadyliked: "User already liked this post" });

          // add user ID to likes array
          post.likes.unshift({ user: req.user.id });

          // save
          post.save().then(post => {
            res.json(post);
          });
        })
        .catch(err => res.status(404).json({ postnotfound: "No post found" }));
    });
  }
);

// @route   POST api/posts/unlike/:id
// @desc    Unlike post
// @access  Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          )
            return res
              .status(400)
              .json({ notliked: "You have not yet liked this post" });

          // get remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // splice out of array
          post.likes.splice(removeIndex, 1);

          // save
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: "No post found" }));
    });
  }
);

// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // check validation
    if (!isValid) {
      // if any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const { text, name, avatar } = req.body;

        const newComment = {
          text,
          name,
          avatar,
          user: req.user.id
        };

        // add to comments array
        post.comments.unshift(newComment);

        // save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete comment from post
// @access  Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // check to see if the comment exists
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        )
          return res
            .status(404)
            .json({ commentnotexists: "Comment does not exist" });

        // get remove index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        // make sure user posted the comment
        if (post.comments[removeIndex].user.toString() === req.user.id) {
          // splice it out of the array
          post.comments.splice(removeIndex, 1);

          // save
          post.save().then(post => res.json(post));
        } else {
          res
            .status(404)
            .json({ notuserscomment: "User did not post this comment" });
        }
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

module.exports = router;
