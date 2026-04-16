"use strict";

const express = require("express");
const bcrypt = require("bcrypt");
const Users = require("../models/users");

const router = express.Router();

// signupUser(req, res)
async function signupUser(req, res) {
  try {
    const { id, password, passwordcheck } = req.body;

    if (!id || !password || !passwordcheck) {
      return res.status(400).render("signup", {
        error: "All fields are required.",
        success: null,
      });
    }

    if (password !== passwordcheck) {
      return res.status(400).render("signup", {
        error: "Passwords do not match.",
        success: null,
      });
    }

    const exists = await Users.findOne({ id });
    if (exists) {
      return res.status(409).render("signup", {
        error: "This username is already taken.",
        success: null,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Users.create({
      id,
      password: hashedPassword,
      roles: ["user"], 
      role: "user",   
    });

    return res.status(201).render("signup", {
      error: null,
      success: "Signup success! Please login.",
    });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).render("signup", {
        error: "This username is already taken.",
        success: null,
      });
    }

    console.error(err);
    return res.status(500).render("signup", {
      error: "Server error. Please try again later.",
      success: null,
    });
  }
}

// GET /signup
router.get("/", (req, res) => {
  return res.render("signup", { error: null, success: null });
});

// POST /signup
router.post("/", signupUser);

module.exports = router;
