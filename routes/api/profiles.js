const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// load validation
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

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

// @route   GET api/profiles/all
// @desc    Get all profiles
// @access  Public
router.get("/all", (req, res) => {
  const errors = {};

  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofiles = "There are no profiles";
        return res.status(404).json(errors);
      } else {
        res.json(profiles);
      }
    })
    .catch(err =>
      res.status(404).json({ noprofiles: "There are no profiles" })
    );
});

// @route   GET api/profiles/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get("/handle/:handle", (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      } else {
        res.json(profile);
      }
    })
    .catch(err =>
      res.status(404).json({ noprofile: "There is no profile for this user" })
    );
});

// @route   GET api/profiles/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get("/user/:user_id", (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      } else {
        res.json(profile);
      }
    })
    .catch(err =>
      res.status(404).json({ noprofile: "There is no profile for this user" })
    );
});

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

    // TODO: Accounts exists and handle wanted exists too!

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // update profile
        Profile.findOneAndUpdate(
          { user: req.user.id },
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

// @route   POST api/profiles/experience
// @desc    Add experience to profile
// @access  Private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    // check validation
    if (!isValid) return res.status(400).json(errors);

    Profile.findOne({ user: req.user.id }).then(profile => {
      const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
      } = req.body;

      const newExp = {
        title,
        company,
        location,
        to,
        from,
        current,
        description
      };

      // add to experience array
      profile.experience.unshift(newExp);
      profile
        .save()
        .then(profile => {
          res.json(profile);
        })
        .catch(err => console.log(err));
    });
  }
);

// @route   POST api/profiles/education
// @desc    Add education to profile
// @access  Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    // check validation
    if (!isValid) return res.status(400).json(errors);

    Profile.findOne({ user: req.user.id }).then(profile => {
      const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      } = req.body;

      const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      };

      // add to experience array
      profile.education.unshift(newEdu);
      profile
        .save()
        .then(profile => {
          res.json(profile);
        })
        .catch(err => console.log(err));
    });
  }
);

module.exports = router;
