const express = require("express");
const cors = require("cors");
port = process.env.PORT || 3000;
const connection = require("../model/connection");
const { error } = require("console");
const fileupload = require("express-fileupload");
const path = require("path");

//-----------Routings-------------
const { register } = require("module");
const loginRouters = require("../routers/loginSignin");
const post = require("../routers/post");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const staticFiles = path.join(__dirname, "../files/");
app.use(express.static(staticFiles));
app.use(cors());

const headerMiddleware = function (request, response, next) {
  response.setHeader("Content-Type", "application/json");
  next();
};
// app.use(headerMiddleware);

// const staticFiles = path.join(__dirname, "../files");
// // console.log(staticFiles);
// app.use(express.static(staticFiles));

// app.use(
//   fileupload({
//     tempFileDir: "/tmp/",
//   })
// );
//-------------------------Signup (create) // Login (Read)------------------------
app.use(loginRouters);
//----------------Posts lists -----------------------
app.use(post);
//-----------------listening app-------------------
app.listen(port, () => {
  console.log(`The app is listening on ${port} port `);
});
