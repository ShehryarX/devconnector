const express = require("express");
const router = express.Router();

// @route   GET api/profiles/test
// @desc    Tests Profiles route
// @access  Public
router.get("/test", (req, res) => res.json({ message: "Profile works" }));

module.exports = router;
