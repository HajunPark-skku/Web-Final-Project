"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;

const usersSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },

  roles: {
    type: [String],
    required: true,
    default: ["user"],
  },

  // 기존 코드/데이터가 role 단일 문자열을 쓰고 있기떄문에 남겨놓기
  role: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Users", usersSchema);

