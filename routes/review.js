const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync= require("../utils/wrapAsync");
const ExpressError= require("../utils/ExpressError.js");
const { reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor}= require("./middleware.js");

//Reviews
//post Review Route 
router.post("/",
  isLoggedIn,
  validateReview,wrapAsync(async(req ,res)=>{
  let listing = await Listing.findById(req.params.id);
  let newReview = await new Review(req.body.review);
  newReview.author = req.user._id;
  
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
    req.flash("success", " Review Added");
  res.redirect(`/listings/${listing._id}`);

}));

router.delete("/:reviewId",
   isLoggedIn,
   isReviewAuthor,
  wrapAsync(async (req, res) => {
  let { id, reviewId } = req.params;
  // Remove reviewId from the listing's reviews array
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  // Delete review itself
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", " Review Deleted");
  res.redirect(`/listings/${id}`);
}));

module.exports = router;