const express = require('express')
const jwt=require('jsonwebtoken')
const auth=express.Router()
const bcrypt=require('bcrypt')
const admin=require('../models/Admins.js')
auth.post('/login',async (req,res,next)=>{
    const {username,password}=req.body;
    const profile=await admin.findOne({username:username,password:await bcrypt.hash(password)});
    if(profile){
        const refreshToken=jwt.sign({username:username},'secretkey',{expiresIn:'30d'});
        const accessToken=jwt.sign({username:})
        req.session.refreshToken=refreshToken;
        req.session.accessToken=        
        res.status(200).json({message:'User Logged in successfully.'});
    } 
    else{
        res.status(401).json({message:'Invalid credentials.'})
    }
})


auth.post('/logout',(req,res,next)=>{})

auth.post('/refresh',(req,res,next)=>{})



module.exports=auth