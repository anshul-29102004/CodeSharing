interface ITag{
    _id:String;
    name:String;
}
interface IUser{
   _id:string;
   name:string;
   bio:string;
   email:string;
   photo:string;
   createdAt:string;
   github:string;
   linkedin:string;
   publicEmail:string;
   role:String;
}
interface ISnippet{
    _id:string;
    title:string;
    code:string;
    description:string;
    language:string;
    tags:ITag[];
    likedBy:string[];
    user:IUser;
    createdAt:string;
}

export type {IUser,ITag,ISnippet}