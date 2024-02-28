const path = require("path");
const { v4: uuidv4 } = require("uuid");

const express = require("express");
const mongoose = require("mongoose");

const bodyParser = require("body-parser");

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const app = express();

//app.use(bodyParser.urlencoded()) //x-www-form-urlencoded <form></form>

const multer = require("multer");
const cors = require("cors");
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4());
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json()); // content-type-application/json
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Origin-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});
const uri =
  "mongodb+srv://tasneem:Hatim978@atlascluster.slvqvjr.mongodb.net/messages?retryWrites=true&w=majority";
mongoose
  .connect(uri)
  .then((result) => {
    const server = app.listen(8080);
    const io = require("./socket").init(server);
    console.log("Mongodb connected");
    io.on("connection", (socket) => {
      console.log("Client connected");
    });
  })
  .catch((err) => console.log(err));
//app.listen(8080);

/**/
/*{ useNewUrlParser: true, useUnifiedTopology: true }
)
.then((result) => {
  const server = app.listen(8080); // this basically return us the server
  const io = require("./socket").init(server);
  // websockets uses http protocols  the basis
  //so we are passing our http based server to the function
  // to create a websocket connection

  // we are setting up a function
  // to be executed whener a new connection is made

  io.on("connection", (socket) => {
    console.log("Client connected");
  });
})
.catch((error) => {
  console.log(error);
});*/
