const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


let mongo_URL = 'mongodb://127.0.0.1:27017/wanderLust';

async function main() {
  await mongoose.connect(mongo_URL);  
};
main()
.then(()=>{
  console.log("connection Successful");
})
.catch(err => console.log(err));

const initDB = async () => {
  await Listing.deleteMany({});
  const dataWithOwner = initData.data.map((obj) => ({
    ...obj,
    owner: "68d29918c7c3560236445f8c", // make sure this is a valid ObjectId
  }));
  await Listing.insertMany(dataWithOwner);
  console.log("data was initialized");
};

initDB();