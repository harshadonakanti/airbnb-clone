const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async(req ,res)=>{
  let listing = await Listing.findById(req.params.id);
  let newReview = await new Review(req.body.review);
  newReview.author = req.user._id;
  
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
    req.flash("success", " Review Added");
  res.redirect(`/listings/${listing._id}`);

}

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  // Remove reviewId from the listing's reviews array
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  // Delete review itself
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", " Review Deleted");
  res.redirect(`/listings/${id}`);
}