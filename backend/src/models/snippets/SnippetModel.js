import mongoose, { mongo } from "mongoose";
import slugify from 'slugify'

const SnippetSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        minLength:3,
    },
    code:{
        type:String,
        required:true,
        trim:true,
        default:"//Add your code here",
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    language:{
        type:String,
        default:"javascript",
    },
    icon:{
        type:String,
        trim:true,
    },
    likes:{
        type:Number,
        default:0,
    },
    likedBy:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
],
    bookmarkedBy:[
        {
            type:mongoose.Schema.Tyoes.ObjectId,
            ref:"User",
        },
    ],
    slug:{
        type:String,
        unique:true,
        index:true,
        trim:true,
    },
    isPublic:{
        type:Boolean,
        default:true,
    },
    tags:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Tags",
            required:true,
        },
    ],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
},{timestamps:true});

SnippetSchema.pre("save",async function(next){
    try {
        if(!this.slug)
        {
         this.slug=slugify(this.title,{
            lower:true,
            strict:true,
            replacement:"-",
            
         })
        }
        let isSlugExist=await mongoose.models.Snippet.findOne({slug:this.slug})
        let suffix=1;
        while(isSlugExist)
        {
            this.slug=`${slugify(this.title,{
                lower:true,
                strict:true,
                replacement:"-",
            })}-${suffix}`
            isSlugExist=await mongoose.models.Snippet.findOne({slug:this.slug});
            suffix++;
        }
    } catch (error) {
        console.log("Error in generating slug",error)
        return next(error)
    }
})

const Snippet=mongoose.model("Snippet",SnippetSchema)

export default Snippet