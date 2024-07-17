const express = require("express");
const mongoose = require("mongoose");
const { stringify } = require("querystring");
const validator = require("validator");

//--------------Mongoose Schema User --------------
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: [true, "Email is already in use"],
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid opreation");
      }
    },
  },
  password: {
    type: String,
    require: true,
  },
});

//-----------mongoose modle-----------
const user = new mongoose.model("user", userSchema);

//-----------model scehma post--------------

const postSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  image: {
    type: String,
  },
  created_at: {
    type: Date,
  },
  updated_at: {
    type: Date,
  },
  created_by: {
    type: String,
  },
  updated_by: {
    type: String,
  },
});

const postModel = new mongoose.model("postModel", postSchema);

module.exports = { user, postModel };
