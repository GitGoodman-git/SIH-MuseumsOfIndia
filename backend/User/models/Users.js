import mongoose from 'mongoose';

const image=new mongoose.Schema({
    src:String,
        size:Number,
        name:String,
    
})
const Users=mongoose.model('Users',new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
    },
    img:image,
    email:{
        type:String,
        unique:true,
        lowercase:true,
        validate:(v)=>{
            return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
        },
        message:`Please enter a valid email address`
    },
    age:{
        type:Number,
        min:14,
        max:99,
    },
    password:{
        type:String,
        required:true,
        minlength:8,
    },
    created_at:{
        type:Date,
        default:Date.now(),
    },
    updated_at:{
        default:Date.now(),
        type:Date, 
    }

}));

module.exports=Users;