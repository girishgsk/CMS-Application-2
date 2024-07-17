const express = require("express");
const router = new express.Router();
const { user } = require("../model/db");
const { redirect } = require("statuses");

//----Signup -------------------

router.post("/signup", async (req, res) => {
  let status = "error";
  let message = "Someting went wrong , try again";
  let reqStatus = 400;
  let inserted_id = undefined;

  const validateUser = [];

  if (!req.body?.email) {
    validateUser.push("Email field is reqired");
  }
  if (!req.body?.password) {
    validateUser.push("Passworg is required");
  }
  if (validateUser.length > 0) {
    res.status(reqStatus);
    return res.status(400).json({ message: validateUser, status });
  }

  try {
    const register = await new user(req.body).save();
    // res.status(200).send();
    if (register) {
      status = "success";
      message = "User added successfully!";
      reqStatus = 200;
      inserted_id = register?._id;
    }
  } catch (err) {
    message = err;
  }
  return res
    .status(reqStatus)
    .json({ status, message, id: inserted_id, email: req.body.email });
});

//------------------Login -----------------------

router.post("/login", async (req, res) => {
  let status = "error";
  let message = "Someting went wrong , try again";
  let reqStatus = 400;
  // let inserted_id = undefined;
  const validateUser = [];

  if (!req.body?.email) {
    validateUser.push("Email field is reqired");
  }
  if (!req.body?.password) {
    validateUser.push("Passworg is required");
  }
  if (validateUser.length > 0) {
    res.status(reqStatus);
    return res.status(400).json({ message: validateUser, status });
  }
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      res.status(400).json({ error: "both field is require" });
    }
    const useremail = await user.findOne({ email: email });

    if (useremail.password === password) {
      res.status(200).json({ message: "success", email: useremail?.email });
    } else {
      res.status(400).json({ error: "Login details are invalide" });
    }
  } catch (error) {
    res.status(400).json({ error: "Login details are invalide" });
  }
});

module.exports = router;
