const mongoose = require("mongoose");

const RentalSchema = new mongoose.Schema({
  tenantid: {
    type: String,
    required: [true, "Please fill up this field"],
  },
  unit: {
    type: String,
    required: [true, "Please fill up this field"],
  },
  amount: {
    type: String,
    required: [true, "Please fill up this field"],
  },
  rentstarted: {
    type: Date,
    required: [true, "Please fill up this field"],
  },
  paymentmode: {
    type: String,
    default: "Gcash",
    required: [true, "Please fill up this field"],
  },
  paymentdate: {
    type: Date,
    required: [true, "Please fill up this field"],
  },
  monthcoverage: {
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
  status: {
    type: String,
    required: [true, "Please fill up this field"],
  },
});

module.exports =
  mongoose.models.Rental || mongoose.model("Rental", RentalSchema);
