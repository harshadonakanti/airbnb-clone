const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("./middleware");
const {
  signup,
  renderSignup,
  renderLogin,
  login,
  logout,
} = require("../controllers/userController");

router.route("/signup").get(renderSignup).post(wrapAsync(signup));

router
  .route("/login")
  .get(renderLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    login
  );

router.get("/logout", logout);

module.exports = router;
