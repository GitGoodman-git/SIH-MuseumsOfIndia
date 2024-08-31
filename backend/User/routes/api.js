const express=require('express');
const jwt=require('jsonwebtoken');
const mongoose=require('mongoose');

const app=express();





mongoose.connect('mongodb://localhost:27017/UserService', 
    {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
       app.listen('3000',()=>{
        console.log("Listening on http://localhost:3000")
       })

    })
