const express = require("express");
const app=express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require('method-override');
const ejsMAte = require("ejs-mate");
const wrapAsync  = require("./utils/wrapAsync.js");
const expressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./Schema.js");

app.set("view engine","ejs");
app.use(express.urlencoded({ extended: true }));
app.set("views",path.join(__dirname,"views"));
app.use(express(express.urlencoded ({extended: true})));
app.use(methodOverride('_method'));
app.engine("ejs",ejsMAte);
app.use(express.static(path.join(__dirname,"/public"))); // path for public file

// app.listen() initiates the server, making it ready to handle incoming requests.
app.listen(8080,()=>{
    console.log("server is working");
});

// making connection with database 
main()
   .then((res)=>{console.log("conection successfull")})
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust');
}


app.get("/",(req,res)=>{
    res.send("All good ");
});


//middleware for handling schema validation
const validatelisting=(req,res,next)=>{
  // using joi for handling schema validation
  let {error} = listingSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
   throw new expressError(400,errMsg);
  }
  else{
    next();
  }
}


// for index rout
app.get("/listing",wrapAsync(async(req,res)=>{
  let all_data = await Listing.find({});
  res.render("listing/index.ejs",{all_data})
}));

// creating routes

app.get("/listing/createNew",(req,res)=>{
  res.render("listing/New.ejs");
});

app.post("/listingPost",validatelisting,wrapAsync(async(req,res)=>{
  
   const newListing = new Listing(req.body.listing);
   await newListing.save();
   res.redirect("/listing");
}));

// for showing one particular data of listing

app.get("/listing/:id",wrapAsync(async(req,res)=>{
  let {id}=req.params;
  let listing=await Listing.findById(id);
  res.render("listing/show.ejs",{listing});
}));

// Edit & Updates

app.get("/listing/Edit/:id",wrapAsync(async(req,res)=>{
  let {id}=req.params;
  const list = await Listing.findById(id);
  res.render("listing/edit.ejs",{list});
}));


app.put("/listing/edit/:id", validatelisting ,wrapAsync(async(req,res)=>{
  let {id}=req.params;

  //const listing = ...req.body.listing;
 await Listing.findByIdAndUpdate(id,{...req.body.listing},{runValidators : true,new : true});
 res.redirect(`/listing/${id}`);
}));

//  Delete route
app.delete("/listing/delete/:id",wrapAsync(async(req,res) =>{
   let {id}=req.params;
   await Listing.findByIdAndDelete(id,{new:true});
   res.redirect("/listing");
}));

// middleware for handling error
app.all("*",(req,res,next)=>{
  next(new expressError(404,"page not found"));
})
app.use((err,req,res,next)=>{
  let {statusCode =500 , message="someting wrong"}=err;
  res.status(statusCode).render("listing/error.ejs",{message});
})

