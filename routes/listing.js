const express = require('express');
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");



// ================= Validation Middleware =================

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  }

  next();
};



// ================= Index Route =================

router.get(
  "/",
  wrapAsync(async (req, res) => {
    let allListing = await Listing.find({});
    res.render("listing/index.ejs", { allListing });
  })
);

// ================= New Route =================

router.get("/new", isLoggedIn, (req,res)=>{
    console.log("ROUTE HIT");
    res.render("listing/new.ejs");
});


// ================= Create Route =================

router.post(
  "/",
  validateListing,
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let newListing = new Listing(req.body.listing);
    console.log(req.user);
    newListing.owner = req.user._id

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listing");
  })
);

// ================= Show Route =================

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    
    let { id } = req.params;
    
    let allListing = await Listing.findById(id).populate("reviews").populate("owner");

    // if (!allListing) {
    //   throw new ExpressError(404, "Listing Not Found");
    // }

    if(!allListing){
      req.flash("error","Listing You Requested for doesn`t exist!");
      return res.redirect("/listing");
    }
    
    res.render("listing/show.ejs", { allListing });
  })
);

// ================= Edit Route =================

router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    let info = await Listing.findById(id);

    // if (!info) {
    //   throw new ExpressError(404, "Listing Not Found");
    // }

    if(!info){
      req.flash("error","Listing You Requested for doesn`t exist!");
      return res.redirect("/listing");
    }
    res.render("listing/edit.ejs", { info });
  })
);

// ================= Update Route =================

router.put(
  "/:id",
  validateListing,
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    await Listing.findByIdAndUpdate(
      id,
      { ...req.body.listing },
      {
        new: true,
        runValidators: true,
      }
    );

    req.flash("success", "Listing Updated!");

    res.redirect("/listing");
  })
);

// ================= Delete Route =================

router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing Deleted!");
    res.redirect("/listing");
  })
);



module.exports = router;

