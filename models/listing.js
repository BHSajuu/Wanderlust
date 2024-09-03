const mongoose = require("mongoose");

let listingSchema= new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type:String,
    },
    image : {
        filename: String,
        url: {
           type: String,  // as we put the url of the image 
           default : "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTEyNjE4NTg5MzIzNjI0NjI2MA%3D%3D/original/e6b26733-2c15-47d9-b097-6968b39bb697.jpeg?im_w=1440&im_q=highq", 
          set : (v)=> v==""?"https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTEyNjE4NTg5MzIzNjI0NjI2MA%3D%3D/original/e6b26733-2c15-47d9-b097-6968b39bb697.jpeg?im_w=1440&im_q=highq":v,
        }
    },
    price :{
     type : Number,
     required : true,
    },
    location:{
        type:String,
    },
    country : {
        type:String,
    }
});

let listing_model = mongoose.model("listing_model",listingSchema);
module.exports = listing_model;