const mongoose=require("mongoose");


const AppoinmentSchema = new mongoose.Schema({     
    date: { 
        type: Date,
        required: true
    },      
    time: { 
        type: String,
        required: true
    },
    reason: { 
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "completed", "cancelled"],
        default: "pending",
        required: true
    },
    doctor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Doctor"
    },
    patient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Patient"
    }

});


module.exports = mongoose.model("Appoinment", AppoinmentSchema);