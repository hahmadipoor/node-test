const mongoose=require("mongoose");

const postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Err:Post mustt have title"]
    },
    body:{
        type:String,
        required:[true,"Err: Post musst have body"]
    }
});

const Post=mongoose.model("Post",postSchema);
module.exports=Post;
