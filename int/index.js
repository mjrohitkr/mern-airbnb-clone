const mongoose = require('mongoose');
const indata = require('./data.js');
const Listing = require('../models/listing.js');

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
// Connect the mongoose 
main().then(()=>{
    console.log("Connected Successfuly");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    mongoose.connect(MONGO_URL);
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(indata.Data);
    console.log("data was initialized");
}

initDB();