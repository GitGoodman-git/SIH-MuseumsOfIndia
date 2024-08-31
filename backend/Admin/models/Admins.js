import mongoose from "mongoose";


const admin=mongoose.model(new mongoose.Schema(
      { 
        name:{},
        email:{},
        password:{},
        identity:{},
        img:new Schema({
            src:String,
            size:Number,
        }),
        mid:{
          type:mongoose.Types.ObjectId
        }
      }
))

module.exports=admin