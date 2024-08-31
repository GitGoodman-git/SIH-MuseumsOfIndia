const express = require('express')
const jwt=require('jsonwebtoken')
const auth=express.Router()
const admin=require('../models/Admins.js')
auth.post('/login',(req,res,next)=>{
    const {username,password}=req.body
    if(admin.findOne({username:username,
        password:password})){
        const token=jwt.sign({username:username},'secretkey',{expiresIn:'30d'})
        req.session.refreshToken=token;
        
        res.status(200).json({message:'User Logged in successfully.'})
    } 
    else{
        res.status(401).json({message:'Invalid credentials.'})
    }
})

auth.post('/logout',(req,res,next)=>{})

auth.post('/refresh',(req,res,next)=>{})



module.exports=auth