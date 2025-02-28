const express=require('express');
const path=require("path");
const bcrypt=require('bcrypt');
const collection=require("./config");

const app=express();

//convert data into json format
app.use(express.json());

app.use(express.urlencoded({extended:false}));


//use ejs as the view engine
app.set('view engine','ejs');
//static file path
app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.render("login");
});

app.get("/signup",(req,res)=>{
    res.render("signup");
});


//Register user
app.post("/signup",async(req,res)=>{
    try{
    const data={
        name:req.body.username,
        password:req.body.password
    }

    //check if user already exists in the database
    const existingUser= await collection.findOne({name:data.name});

    if(existingUser)
    {
        res.send("User already exists. Please choose a different name");
    }
    else{
    //hash the password using bcrypt
    const saltRounds=10;//number of salt round for bcrypt
    const hashedPassword=await bcrypt.hash(data.password, saltRounds);

    data.password=hashedPassword;//replace the hashed password with original password

    const userdata=await collection.insertMany(data);
    console.log(userdata);
    }
}catch(error)
{
    console.error('Error registering user:', error);
    res.status(500).send('Internal server error');
}
});

//Login user
app.post("/login",async(req,res)=>{
    try{
        const check=await collection.findOne({name:req.body.username});
        if(!check)
        {
            res.send("user name cannot be found");
        }
        //compare the hash password with the plain text 
        const isPasswordMatch=await bcrypt.compare(req.body.password,check.password);
        if(isPasswordMatch)
        {
            res.render("home");
        }
        else{
            res.send("wrong password");
        }
    }catch(error){
        console.error('Error during login:', error);
        res.status(500).send('Internal server error');
    }
});


const port=7000;
app.listen(port,()=>{
    console.log(`Server is running on Port ${port}`);
})