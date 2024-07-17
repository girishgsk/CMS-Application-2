const express = require("express");
const router = new express.Router();
const { postModel } = require("../model/db");
const hbs = require("handlebars");
const fileupload = require("express-fileupload");
const moment = require("moment");
const fs = require("fs");
router.use(express.json());

router.use(fileupload());

///-------------For Creating the list----------------
router.post("/post", async (req, res) => {
  let status = "error";
  let reqStatus = 400;
  let insertedId = undefined;
  let message = "Something went wrong. Please try again!";
  const validInputs = [];

  if (!req.body?.title?.trim()) {
    validInputs.push("The title field is required");
  }
  if (!req.body?.description?.trim()) {
    validInputs.push("The Description field is required");
  }
  if (!req.files?.image) {
    validInputs.push("The image field is required");
  }
  if (validInputs?.length > 0) {
    res.status(reqStatus);
    return res.status(400).json({ status, message: validInputs });
  }

  try {
    const image = req.files?.image;
    image.mv(`./files/${image.name}`);
    const data = {
      title: req.body?.title,
      description: req.body?.description,
      image: `./files/${image.name}`,
      created_at: moment().toDate(),
      updated_at: moment().toDate(),
      created_by: req.headers?.email,
      updated_by: req.headers?.email,
    };
    // console.log(data);
    const posts = await new postModel(data).save();
    // posts.save(data);

    if (posts) {
      status = "succses";
      reqStatus = 201;
      message = "The post is created ";
      insertedId = posts?.insertedId;
    }
  } catch (err) {
    message = err;
  }
  return res.status(reqStatus).json({ status, message, id: insertedId });
});

//----------For Getting the posts------------

router.get("/post/:id", async (req, res) => {
  let status = "error";
  let reqStatus = 400;
  let data = null;
  let message = "Something went wrong. Please try again!";

  try {
    const _id = req.params?.id;
    const post = await postModel.findById(_id);
    if (post) {
      status = "success";
      message = "Post found!";
      reqStatus = 200;
      data = post;
    }
  } catch (error) {
    message = error;
  }

  return res.status(reqStatus).json({ status, message, data });
});

///-----------for lists -------------

router.get("/post", async (req, res) => {
  let status = "error";
  let reqStatus = 400;
  let data = null;
  let message = "Something went wrong. Please try again!";

  try {
    const email = req.headers?.email;
    const posts = await postModel.find({ created_by: email });
    // console.log(email);
    if (posts) {
      status = "success";
      message = "Posts found!";
      reqStatus = 200;
      data = posts;
    }
  } catch (error) {
    console.log(error);
    message = error;
  }

  return res.status(reqStatus).json({ status, message, data });
});

// /------------update--------------

router.put("/post/:id", async (req, res) => {
  let status = "error";
  let reqStatus = 400;
  let insertedId = undefined;
  let message = "Something went wrong. Please try again!";
  const validInputs = [];

  if (!req.body?.title) {
    validInputs.push("Title field is required!");
  }
  if (!req.body?.description) {
    validInputs.push("Description field is required!");
  }
  if (!req.files?.image) {
    validInputs.push("Image field is required!");
  }
  if (validInputs?.length > 0) {
    res.status(reqStatus);
    return res.json({ status, message: validInputs });
  }

  try {
    const postId = req.params?.id;
    const image = req.files?.image;
    let updateData = {
      title: req.body?.title,
      description: req.body?.description,
      updated_at: moment().toDate(),
      updated_by: req.headers?.email,
    };
    // Here the fs module {fs/promises} is require
    if (image) {
      const exisingPost = await postModel.findById(postId);
      fs.unlinkSync(exisingPost.image);
      image.mv(`./files/${image?.name}`);
      updateData = {
        ...updateData,
        image: `./files/${image?.name}`,
      };
    }

    const posts = await postModel.findByIdAndUpdate(
      { _id: postId },
      updateData
    );

    if (posts) {
      status = "success";
      message = "Post updated successfully!";
      reqStatus = 200;
      insertedId = posts?.insertedId;
    }
  } catch (error) {
    message = error;
    console.log(error);
  }

  return res.status(reqStatus).json({ status, message, id: insertedId });
});

//-------------Delete-----------------

router.delete("/post/:id", async (req, res) => {
  let status = "error";
  let reqStatus = 400;
  let insertedId = undefined;
  let message = "Something went wrong. Please try again!";

  try {
    const postId = req.params?.id;
    const post = await postModel.findByIdAndDelete({ _id: postId });

    if (post) {
      fs.unlinkSync(post.image);
      status = "success";
      message = "Post deleted successfully!";
      reqStatus = 200;
    }
  } catch (error) {
    message = error;
  }

  return res.status(reqStatus).json({ status, message, id: insertedId });
});

module.exports = router;
