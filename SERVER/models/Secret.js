const mongoose = require("mongoose");
const secretSchema = new mongoose.Schema(
    {
        text:{
            type:String,
            required:true,
        },
        category:{
            type:String,
            required:true,
            enum:["confession","work","relationship","random"],
            default:"random",
        },
        likes:{
            type:Number,
            default:0,
        },
    },
    {timestamps:true},
);
module.exports=mongoose.model("secret",secretSchema);