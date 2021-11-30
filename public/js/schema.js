let mongo = require("mongoose");
let createSchema = new mongo.Schema({
  name: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  mobile: {
    required: true,
    type: Number,
  },
  city: {
    require: true,
    type: String,
  },
  Date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongo.model("dbs", createSchema);
