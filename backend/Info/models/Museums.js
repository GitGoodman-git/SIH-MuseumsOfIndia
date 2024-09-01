const mongoose=require('mongoose');

const event=mongoose.model(new Schema({
    
    name:{
        type:'String',
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    images:{
       type:[String]
    },
    amenities:{
      type:[String]
    },
    location:new mongoose.Schema({
        "address":String,
        "city":String,
        "state":String,
        "zipcode":String,
        "latitude":Number,
        "longitude":Number,
    }),
    phone:{
        type:String,
        validator:function(v){
            return /^\+?1?\d{10}$/.test(v);
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        validate:(v)=>{
            return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
        },
        message:`Please enter a valid email address`
    },
    website:{
        type:String,
        validate:function(v){
            return /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i.test(v);
        }
    },
   
    events:{
        type:[mongoose.Types.ObjectId],
        ref:'Events'
    },
    estd:{
        type:Date,
        required:true,
    },
    duration:{
        type:Number,
        required:true,
        min:1,
    },
    keywords:{
        type:[String],
        required:true,
    },
    type:{
        type:Number,
        required:true,
        enum:[0,1,2]
    }
    
}))




