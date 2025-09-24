const User = require("../models/user");

module.exports.renderSignup =  (req, res)=>{
  res.render("users/signup");
  const passport = require("passport");
};

module.exports.signup = async(req, res)=>{
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
}


module.exports.renderLogin = (req, res)=>{
  res.render("users/login");
};

module.exports.login =  async(req, res)=>{
      req.flash("success", "Welcome Back to Livora");
      let redirectUrl = res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success", "Your Logged Out!");
    res.redirect("/listings");
  });
}