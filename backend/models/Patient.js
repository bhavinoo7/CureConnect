const mongoose = require("mongoose");
const User = require("./User");
const PatientSchema = new mongoose.Schema({
  full_name: {
    type: String,
    require: true,
  },
  birth_date: {
    type: Date,
    require: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    default: "Male",
  },
  address: {
    type: String,
    require: true,
  },
  contact: {
    type: Number,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
    appoinments:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Appoinment"
    }]
});

module.exports = mongoose.model("Patient", PatientSchema);
