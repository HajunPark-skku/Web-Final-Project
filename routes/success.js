"use strict";

const express = require("express");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {
  if (req.session.isAuthenticated) {
    res.render("success", {
      username: req.session.user.id,
      role: req.session.user.role,
      roles: req.session.user.roles || [],
    });
    
  } else {
        res.redirect('/login');
      }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.send('Error logging out.');
      }
      res.redirect('/login');
    });
});

module.exports = router;