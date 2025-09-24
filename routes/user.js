const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("./middleware");

router.get("/signup", (req, res)=>{
  res.render("users/signup");
  const passport = require("passport");
});

router.post("/signup", wrapAsync(async(req, res)=>{
  try{
    let {username, email, password} = req.body;
    const newUser =  new User({email, username});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err)=>{
      if(err){
        return next(err);
      }
       req.flash("success", "Welcome to Livora");
    res.redirect("/listings");
    })
   ;
  }
  catch(e){
    req.flash("error", e.message);
    res.redirect("/signup");
  }
}));

router.get("/login",(req, res)=>{
  res.render("users/login");
});


router.post("/login",
  saveRedirectUrl,
  passport.authenticate("local",
    {failureRedirect: "/login", failureFlash: true}),
    async(req, res)=>{
      req.flash("success", "Welcome Back to Livora");
      let redirectUrl = res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl);
});

router.get("/logout", (req, res, next)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success", "Your Logged Out!");
    res.redirect("/listings");
  });
});

module.exports = router;