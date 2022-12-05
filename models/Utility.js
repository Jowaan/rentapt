const mongoose = require("mongoose");

const UtilitySchema = new mongoose.Schema({
  unit: {
    type: String,
    required: [true, "Please fill up this field"],
  },
  typeofutility: {
    type: String,
    required: [true, "Please fill up this field"],
  },
  dateofpayment: {
    type: Date,
    required: [true, "Please fill up this field"],
  },
  dateofcoverage: {
    type: Date,
    required: [true, "Please fill up this field"],
  },
  proofofpayment: {
    type: String,
    required: [true, "Please fill up this field"],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports =
  mongoose.models.Utility || mongoose.model("Utility", UtilitySchema);
