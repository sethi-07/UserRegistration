const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/userDB");

//check if connected or not
connect.then(() => {
  console.log("Connected to MongoDB");
})
  .catch(() => {
    console.log("Can't connect to DB");
  });

const loginSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const collection = mongoose.model("users", loginSchema);
module.exports = collection;