if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const serverless = require("serverless-http");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("../utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/user.js");

// Routers
const listingRouter = require("../routes/listings.js");
const reviewRouter = require("../routes/review.js");
const userRouter = require("../routes/user.js");

// MongoDB connection (Vercel safe)
const dbUrl = process.env.ATLASDB_URL;

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(dbUrl);
  isConnected = true;
  console.log("MongoDB Connected");
}

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// VIEWS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

// STATIC FILES (very important!)
app.use(express.static(path.join(__dirname, "../public")));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: { secret: process.env.SECRET },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => console.log("SESSION STORE ERROR", err));

app.use(
  session({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// ROUTES
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// ❗ IMPORTANT: No app.listen()
// Export serverless handler for Vercel
module.exports = app;
module.exports.handler = serverless(app);
