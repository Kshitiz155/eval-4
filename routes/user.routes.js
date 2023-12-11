const userRouter = require("express").Router();
const { UserModel } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

userRouter.post("/register",async(req,res)=>{
    try {
        const {email,password, gender,name} = req.body;        

        const hashpass = bcrypt.hashSync(password,5)
        const user = new UserModel({
            email,password:hashpass,gender,name
        });
        await user.save();
        res.status(200).send({msg:"The new user has been registered","newUser":user});
    
    } catch (error) {
        res.status(400).send({error:error.message});
    }
});


userRouter.post("/login",async(req,res)=>{
    try {
        const {email,password,}= req.body;

        const user = await UserModel.findOne({email});

        if(user){
            bcrypt.compare(password,user.password ,(err,result)=>{
                if(result){
                    const token = jwt.sign({username:user.name,userId:user._id},"token",{expiresIn:"1h"});

                    res.status(200).send({msg:"user has been logged in ","token":token});
                }
            })
        }
        else{
            res.status(400).send({msg:"email not correct"})
        }
    } catch (error) {
        res.status(400).send({error:error.message});
        
    }
});



module.exports ={userRouter}