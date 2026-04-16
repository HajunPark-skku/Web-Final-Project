"use strict";

const express = require("express");
const router = express.Router();

// logoutUser(req, res)
function logoutUser(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error logging out.");
    }
    return res.redirect("/login");
  });
}

// GET /logout
router.get("/", logoutUser);

module.exports = router;
