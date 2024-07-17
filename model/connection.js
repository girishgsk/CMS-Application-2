// const express = require("express");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/CmsDB")
  .then(() => console.log(`Database is Connected`))
  .catch((e) => console.log(`Opps! , Connection Failed`, e));
