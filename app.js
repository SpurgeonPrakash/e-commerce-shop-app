require('dotenv').config()

const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const multer = require('multer');
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const User = require("./models/user");

const app = express();

const errorController = require("./controller/error");

app.set("view engine", "ejs");
app.set("views", "views");

const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const authController = require("./routes/auth");

// const MONGODB_URI = 'mongodb://localhost:27017/Shop';

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});

const csrfProtection = csrf();
app.use(flash());

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    const date = new Date()
    cb(null, date.toDateString() + date.getTime() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use(express.static(path.join(__dirname, "public")));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);

app.use(csrfProtection);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
        
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use(shopRoutes);
app.use("/admin", adminRoutes);
app.use(authController);

app.use(errorController.get404);

app.use((err, req, res, next) => {
  console.log(err);
  res.redirect("/500")
})

mongoose
  .connect(process.env.MONGODB_URI,  { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    let port = process.env.PORT;
    if (port == null || port == "") {
      port = 3000;
    }

    app.listen(port, (req, res, next) => {
      console.log(`App Listening to port: ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
