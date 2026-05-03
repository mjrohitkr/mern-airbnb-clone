const mongoose = require('mongoose');

const schema = mongoose.Schema;

let listingSchema = new schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    image : {
        type : String,
        default : 'https://www.keycdn.com/support/image-processing',
        set : (v) => v==="" ? 
        'https://www.keycdn.com/support/image-processing' 
        : v
    },
    price : {
        type : Number,
        required : true,
    },
    location : {
        type : String,
        required : true,
    },
    country : {
        type : String,
        required : true
    }
})

let Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;