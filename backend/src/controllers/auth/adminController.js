import asyncHandler from 'express-async-handler'
import User from '../../models/UserModels.js';

export const deleteUser=asyncHandler(async(req,res)=>{
    try {
        const {id}=req.params;
    const user=await User.findByIdAndDelete(id);
    if(!user)
    {
        res.status(404).json({message:"User not found"})
    }
    res.status(200).json({message:"User delted successfully"})
    } catch (error) {
        res.status(500).json({message:"Server error"})
    }

})

export const getAllUsers=asyncHandler(async(req,res)=>{
    try {
         const users=await User.find({});
    if(!users)
    {
        res.status(404).json({message:"No users found"});
    }
    res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message:"Server error"});
    }
   
    
});