const mongoose=require("mongoose");
const connect=mongoose.connect("mongodb+srv://pantaman98:aman989768052@cluster0.h06v34q.mongodb.net/tesstttt")


//check database connected or not
connect.then(()=>{
    console.log("Database connected successfully");
    })
    .catch(()=>{
        console.log("Database cannot be connected");
    })
    
    //create a schema
    const LoginSchema=new mongoose.Schema({
        name:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        }
    });
    
    //collection Part
    const collection=new mongoose.model("users",LoginSchema);
    
    module.exports=collection;