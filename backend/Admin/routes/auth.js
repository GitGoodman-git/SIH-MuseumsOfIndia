const express = require('express')
const jwt=require('jsonwebtoken')
const auth=express.Router()
const bcrypt=require('bcrypt')
const admin=require('../models/Admins.js')
const crypto=require('crypto')

const currentVersion=1;
const refreshSecret=new Map([[1,crypto.randomBytes(32).toString('hex')]])
const accessSecret=new Map([[1,crypto.randomBytes(32).toString('hex')]])


auth.post('/login',async(req,res,next)=>{
    let {username,password}=req.body;
    username=xss(username);
    password=xss(password);   
       
    const profile=await admin.findOne({username:username});
    if(profile&&(await bcrypt.compare(password,profile.password))){
        const vr=refreshSecret.get(currentVersion)
        const va=accessSecret.get(currentVersion)
        const refreshToken=jwt.sign({id:profile._id,version:currentVersion},vr,{expiresIn:'30d'});
        const accessToken=jwt.sign({id:profile._id,version:currentVersion},va,{expiresIn:'30m'});
        req.session.refreshToken=refreshToken;
        res.cookie('accessToken',accessToken,{maxAge:900000,secure:true});        
        res.status(200).json({message:'User Logged in successfully.'});
    } 
    else{
        res.status(401).json({message:'Invalid credentials.'})
 
    }})


auth.get('/logout',(req,res,next)=>{
      req.session.destroy();
      return res.status(200).json({message:'User logged out successfully.'});
})

auth.get('/refresh',(req,res,next)=>{
    let refreshToken=(req.cookies.refreshToken);
    if(!refreshToken)return res.status(403).json({message:'Access denied.'});
    refreshToken=jwt.decode(refreshToken);
    if(!(refreshToken.version))return res.status(403).json({message:'Access denied.'})
    const secret=refreshSecret.get(refreshToken.version)
    if(!secret)return res.status(403).json({message:'Access denied.'});
    jwt.verify(refreshToken,secret,(err,data)=>{
        if(err)return res.status(403).json({message:'Access denied.'});
        const accessToken=jwt.sign({id:data.id},accessSecret.get(currentVersion),{expiresIn:'30m'});
        res.cookie('accessToken',accessToken,{maxAge:1800000,secure:true,sameSite:'Strict'});
        res.status(200).json({message:'User refreshed successfully.'});
    })
})



module.exports=auth