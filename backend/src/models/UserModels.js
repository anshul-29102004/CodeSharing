import mongoose from "mongoose";
import bcrypt from "bcrypt"
const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please provide your name"],
    },
    email:{
        type:String,
        required:[true,"Please provide your email"],
        unique:true,
        trim:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Please provide a valid email address"]
    },
    password:{
        type:String,
        required:[true,"Please add password"],
    },
    photo:{
        type:String,
    },
    bio:{
        type:String,
        default:"I am a new user",
    },
    role:{
        type:String,
        enum:["user","admin","creator"],
        default:"user",
      },
    isVerified:{
        type:Boolean,
        default:false,
    }
},{timestamps:true,minimize:true})

//hashing password before saving
UserSchema.pre("save",async function(next) {
    if(!this.isModified("password"))
    {
        return;
    }
   
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(this.password,salt);
    this.password=hashedPassword;
})

const User=mongoose.model("User",UserSchema);

export default User;