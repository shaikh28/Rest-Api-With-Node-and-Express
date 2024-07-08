const mongoose = require("mongoose");

async function connectMongoDB(url) {
  return mongoose.connect(url);
}
module.exports = {
  connectMongoDB,
};
// "mongodb://localhost:27017/BDW"
