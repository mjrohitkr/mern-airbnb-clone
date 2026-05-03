const express = require('express');
const app = express();
const mongoose = require('mongoose');
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const port = 3000;
const path = require('path');
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const Listing = require("./models/listing.js"); // require listing.js
const {listingSchema} = require("./schema.js");

app.engine("ejs",ejsMate);
app.set("view engine", "ejs");
app.set("views",path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));    

// Connect the mongoose 
main().then(()=>{
    console.log("Connected Successfuly");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    mongoose.connect(MONGO_URL);
}

//=============validateListing Middleware==============//

const validateListing = (req,res,next)=>{
  let {error} = listingSchema.validate(req.body);
  if(error){
    errMsg = error.details.map((el)=>el,message).join(",");
    throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }
}



//Home Route 

app.get("/",(req,res)=>{
    res.send('Hello..!! I am Root');
});

//Index Route

app.get("/listing",wrapAsync(async(req,res)=>{
    let allListing = await Listing.find({});
    res.render("listing/index.ejs",{allListing});
}))
;
//___________Create New Routes____________//

app.get("/listing/new",(req,res)=>{
    res.render("listing/new.ejs");
});

//_______create post route____________//

app.post("/listing",validateListing, wrapAsync( async(req,res,next)=>{

    let result = listingSchema.validate(req.body);
    console.log(result);
    if(result.error){
        throw new ExpressError(400, result.error);
    }
    let newlisting = req.body.listing
    let addlisting = new Listing(newlisting);
    await addlisting.save();
    res.redirect("/listing");
    
}));


//_____________show Routes____________//

app.get("/listing/:id",validateListing, wrapAsync(async(req,res)=>{
    let {id} = req.params;
   
    let allListing =await Listing.findById(id);
     if(!allListing ){
        throw new ExpressError(400, "Listing not found")
    }
    res.render('listing/show.ejs',{allListing})
}));


//_____________Edit Listing___________//

app.get("/listing/:id/edit",validateListing, wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let info =await Listing.findById(id);
    res.render("listing/edit.ejs",{info});
}));

//_____________Update Listing___________//

app.put("/listing/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let updatedListing = await Listing.findByIdAndUpdate(id,{...req.body.listing},{new:true,runValidators:true});
    console.log(updatedListing);
    res.redirect("/listing");

}));
//_____________Delete Listing___________//

app.delete("/listing/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let DeletedList = await Listing.findByIdAndDelete(id);
     console.log(DeletedList);
    res.redirect("/listing");

}));



//==================Error Handling====================//

app.use((req, res,next) => {
  next(new ExpressError(404,"page Not Found!!"));
});

app.use((err,req,res,next)=>{
    let {statusCode = 500, message = "something went wrong"} = err;
    // res.status(statusCode).send(message);
    // console.log(err);
    res.status(statusCode).render("erroe.ejs",{message});
})

app.listen(port,(req,res)=>{
    console.log(`Listing on the port ${port}`)
});