const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// load User model
const User = require("../../models/User").User;

// @route   GET api/users/test
// @desc    Tests Users route
// @access  Public
router.get("/test", (req, res) => res.json({ message: "Users works" }));

// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) return res.status(400).json({ email: "Email already exists" });

    const { name, email, password } = req.body;
    const avatar = gravatar.url(email, {
      s: "200", // size
      r: "pg", // rating
      d: "mm" // default
    });

    const newUser = new User({
      name,
      email,
      avatar,
      password
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(user => res.json(user))
          .catch(err => console.log(err));
      });
    });
  });
});

// @route   GET api/users/login
// @desc    Login user and return JWT token
// @access  Public
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // find user by email
  User.findOne({ email }).then(user => {
    if (!user) return res.status(404).json({ email: "User not found" }); // user not found

    bcrypt.compare(password, user.password).then(isMatched => {
      if (isMatched)
        return res.status(400).json({ password: "Password incorrect" });

      // user matched
      const { id, name, avatar } = user;
      const payload = { id, name, avatar }; // create JWT payload

      // sign token
      jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
        res.json({
          success: true,
          token: "Bearer " + token
        });
      });
    });
  });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { id, name, email } = req.user;

    res.json({
      id,
      name,
      email
    });
  }
);

module.exports = router;
