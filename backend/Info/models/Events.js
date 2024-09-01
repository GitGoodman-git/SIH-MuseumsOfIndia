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
    status:{
       type:String,
       enum:['active','closed','open','cancelled']
    },
    images:{
       type:[String]
    },
    
    mid:{
     type:mongoose.Types.ObjectId,   
     ref:'Museums'
    },
    venue:{

    },
    Timings:[new mongoose.Schema({})],
    date:{
        type:Date,
        required:true,
    },
    tid:{
        type:mongoose.Types.ObjectId,
        ref:'Tickets'
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




