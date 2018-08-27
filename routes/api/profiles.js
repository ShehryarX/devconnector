const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// load validation
const validateProfileInput = require("../../validation/profile");

// load Profile model
const Profile = require("../../models/Profile");

// load User model
const User = require("../../models/User");

// @route   GET api/profiles/test
// @desc    Tests Profiles route
// @access  Public
router.get("/test", (req, res) => res.json({ message: "Profile works" }));

// @route   GET api/profiles/
// @desc    Get current user's profile
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }

        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   POST api/profiles/
// @desc    Create or edit user profile
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // check validation
    if (!isValid) return res.status(400).json(errors);

    const {
      id,
      handle,
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    // get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (handle) profileFields.handle = handle;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    // skills - split into array
    if (typeof skills !== "undefined") profileFields.skills = skills.split(",");

    // social
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;

    // profileFields.user = req.user.id;

    Profile.findOne({ user: id }).then(profile => {
      if (profile) {
        // update profile
        Profile.findOneAndUpdate(
          { user: id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // create profile

        // check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          } else {
            // save profile
            new Profile(profileFields)
              .save()
              .then(profile => res.json(profile));
          }
        });
      }
    });
  }
);

module.exports = router;
