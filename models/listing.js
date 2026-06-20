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
        default : 'https://images.wsj.net/im-81430597?width=1280&size=1',
        set : (v) => v==="" ? 
        'https://images.wsj.net/im-81430597?width=1280&size=1' 
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
    },
    reviews : [
        {
            type : schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    owner : {
        type : schema.Types.ObjectId,
        ref : "User"
    }
})

let Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;