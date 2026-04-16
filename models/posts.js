"use strict";

const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  author: {
    type: String,   // user id 저장 
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500, // 너무 긴 글 방지
  },
  likes: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// 최신 글 먼저 뽑을 때 유리하게 만들기
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Posts", postSchema);
