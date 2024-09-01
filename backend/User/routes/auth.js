const express = require('express')
const jwt=require('jsonwebtoken')
const auth=express.Router()
const bcrypt=require('bcrypt')
const admin=require('../models/Admins.js')
const crypto=require('crypto')
const user=require('../models/Users.js')
const currentVersion=1;
const refreshSecret=new Map([[1,crypto.randomBytes(32).toString('hex')]])
const accessSecret=new Map([[1,crypto.randomBytes(32).toString('hex')]])

function issueToken(req,res,profile){
    const vr=refreshSecret.get(currentVersion)
    const va=accessSecret.get(currentVersion)
    const refreshToken=jwt.sign({id:profile._id,version:currentVersion},vr,{expiresIn:'30d'});
    const accessToken=jwt.sign({id:profile._id,version:currentVersion},va,{expiresIn:'30m'});
    req.session.refreshToken=refreshToken;
    res.cookie('accessToken',accessToken,{maxAge:900000,secure:true});        
    res.status(200).json({message:'User Logged in successfully.'});
}

auth.post('/login',async(req,res,next)=>{
    let {username,password}=req.body;
    username=xss(username);
    password=xss(password);   
    const profile=await admin.findOne({username:username});
    if(profile&&(await bcrypt.compare(password,profile.password))){
      issueToken(req,res,profile);
    } 
    else{
        res.status(401).json({message:'Invalid credentials.'})
    }})

auth.post('/signup',async(req,res,next)=>{
        let {email,username,password}=req.body;
        const t1=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
        const t2=/^(?=.*[a-zA-Z]{4})[a-zA-Z0-9]+$/.test(username);
        if(!(t1||t2))return res.status(400).send({message:'Invalid email or username.'});

        email=xss(email);
        username=xss(username);
        password=xss(password);
        
        let otp=crypto.randomInt(0,10**6);
        otp=otp.toString().padEnd(6,'0')
        const otpStatus=sendOTP();
        if(otpStatus){    
        req.session.verify={
            email:email,
            username:username,
            password:await bcrypt.hash(password),
            otp:await bcrypt.hash(otp),
            expires:Date.now()+20*60*1000
        }
        res.status(200);
        
        } else {
        res.status(400).json({message:'Failed to send OTP.'});
        }
    })

auth.post('/verify',async (req, res) => {
        let {otp}=req.body;
        let {verify}=req.session.verify;
        
        if(verify.expires>=Date.now())
            return res.status(400).json({message:'OTP expired.'});
        else if(await bcrypt.compare(req.session.verify.otp,otp)){    
            const profile=await user(
                {email:verify.email,
                 username:verify.username,
                 password:verify.password
                }
            )
            issueToken(req,res,profile);
            delete req.session.verify;
        }
    }

)

auth.post('/logout',(req,res,next)=>{
      req.session.destroy();
      res.clearCookie('accessToken');
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