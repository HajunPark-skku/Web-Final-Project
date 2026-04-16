"use strict";

const express = require("express");
const bcrypt = require("bcrypt");
const Users = require("../models/users");

const router = express.Router();

// loginUser(req, res)
async function loginUser(req, res) {
  const { id, password } = req.body;

  try {
    const user = await Users.findOne({ id });

    if (!user) {
      return res.status(401).render("login", {
        error: "Invalid username or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).render("login", {
        error: "Invalid username or password.",
      });
    }

    const roles =
      Array.isArray(user.roles) && user.roles.length > 0
        ? user.roles
        : [user.role || "user"];

    req.session.isAuthenticated = true;
    req.session.user = {
      id: user.id,
      roles,
      role: roles[0], 
    };

    return res.redirect("/success");
  } catch (err) {
    console.error(err);
    return res.status(500).render("login", {
      error: "Server error. Please try again later.",
    });
  }
}

// GET /login
router.get("/", (req, res) => {
  return res.render("login", { error: null });
});

// POST /login
router.post("/", loginUser);

module.exports = router;
