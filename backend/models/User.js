const mongoose=require("mongoose");
// const { default: Patient } = require("../../frontend/src/pages/Patient");


const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  phonenumber: { type: Number },
  photo: {
    url: String,
    filename: String,
  },
  role: {
    type: String,
    enum:["patient", "admin", "doctor", "chemist"],
    default: "patient",
  },
  password:{
    type:String
  },
  patients:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Patient"
  }],
  doctor:{
    type:mongoose.Schema.Types.ObjectId,
  },
  
});

module.exports=mongoose.model("User",UserSchema);
