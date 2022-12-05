const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  unit: {
    type: String,
    unique: true,
    required: [true, "Please fill up this field"],
  },
  startofrent: {
    type: Date,
    required: [true, "Please fill up this field"],
  },
  lastname: {
    type: String,
    required: [true, "Please fill up this field"],
  },
  firstname: {
    type: String,
    required: [true, "Please fill up this field"],
  },
  middlename: {
    type: String,
    required: [true, "Please fill up this field"],
  },
  rentamount: {
    type: String,
    required: [true, "Please fill up this field"],
  },
  contact: {
    type: String,
    required: [true, "Please fill up this field"],
  },
  totaldeposit: {
    type: String,
    required: [true, "Please fill up this field"],
  },
  advancepayment: {
    type: String,
    required: [true, "Please fill up this field"],
  },
  username: {
    type: String,
    unique: true,
    required: [true, "Please fill up this field"],
  },
  password: {
    type: String,
    required: [true, "Please fill up this field"],
  },
  validid: {
    type: String,
    required: [true, "Please fill up this field"],
  },
  contract: {
    type: String,
    required: [true, "Please fill up this field"],
  },
  tenantbalance: {
    type: String,
    default: "0",
  },
  profile: {
    type: String,
    required: [true, "Please fill up this field"],
  },
  availability: {
    type: String,
    default: "occupied",
  },
  role: {
    type: String,
    default: "user",
    required: [true, "Please fill up this field"],
  },
});

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
