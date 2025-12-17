import mongoose, { mongo } from "mongoose";

const TagsSchema=new mongoose.Schema({
  name:{
    type:String,
    required:true,
    unique:true,
  },
  usageCount:{
    type:Number,
    default:0,
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },


},{timestamps:true})

const Tags=mongoose.model("Tags",TagsSchema)

export default Tags