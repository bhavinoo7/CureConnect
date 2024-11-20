const mongoose = require("mongoose");

const DoctorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  birth_date: {
    type: Date,
    required: true,
  },
  contact: {
    type: Number,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  consultationFee: {
    type: Number,
    required: true,
  },
  availability: [
    {
      date: {
        type: Date,
        required: true,
      },
      slots: [
        {
          time: {
            type: String,
            required: true,
          },
          status: {
            type: String,
            enum: ["locked","available", "booked"],
            default: "available",
          },
          lockedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          }
        },
      ],
    },
  ],
  appoinments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appoinment",
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to User model
    required: true,
  }
  
},{timestamps: true});

module.exports = mongoose.model("doctor", DoctorSchema);
