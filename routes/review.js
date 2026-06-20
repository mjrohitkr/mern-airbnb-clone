const express = require('express');
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");





const validateReview = (req,res,next) => {
  let {error} = reviewSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el) =>el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  else{
    next();
  }
}




// ===========Reviews=============

router.post('/', validateReview,isLoggedIn, wrapAsync(async(req,res)=>{

  console.log("BODY =", req.body);

  let listing = await Listing.findById(req.params.id);
  console.log("LISTING =", listing);

  let newReviews = new Review(req.body.review);
  console.log("REVIEW =", newReviews);

  listing.reviews.push(newReviews);

  await listing.save();
  await newReviews.save();

  console.log("new review saved");

  res.redirect(`/listing/${listing._id}`);
}));


// app.get('/getcookies',(req,res)=>{
//     res.cookie("greet", "namsate");
//     res.cookie("madeIn", "India");
// })

//==================Delete Review==============//

router.delete('/:reviewId',isLoggedIn, wrapAsync(async(req,res)=>{
          let {id, reviewId }=req.params;

        await  Listing.findByIdAndUpdate(id, {$pull:{reviews : reviewId}});
        await  Review.findByIdAndDelete(reviewId);

        res.redirect(`/listing/${id}`);

}))


module.exports = router;