import asyncHandler from "express-async-handler";
import jwt from 'jsonwebtoken'
import User from "../models/UserModels.js";


export const protect=asyncHandler(async(req,res,next)=>{
    try {
        const token=req.cookies.token;
        if(!token){
            res.status(401).json({message:"Not authorized,please login"});
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await User.findById(decoded.id).select("-password");
        if(!user)
        {
            res.status(404).json({message:"User not found"});
        }
        req.user=user;
        next();
    } catch (error) {
        res.status(401).json({message:"Not authorized,token failed!"});
    }
})

//admin middleware function
export const adminMiddleware=asyncHandler(async(req,res,next)=>{
    if(req.user && req.user.role==="admin"){
        next();
        return;
    }
    res.status(403).status({message:"Only admins are authorized"})
})

//creator middleware function
export const creatorMiddleware=asyncHandler(async(req,res,next)=>{
    if((req.user && req.user.role==="admin")||(req.user && req.user.role=="creator")){
        next();
        return;
    }
    res.status(403).status({message:"Only creators are authorized"})
})

//verified middleware function
export const verifiedMiddleware=asyncHandler(async(req,res,next)=>{
    if(req.user && req.user.isVerified){
        next();
        return;
    }
    res.status(403).status({message:"Only verify your email address"})
})



