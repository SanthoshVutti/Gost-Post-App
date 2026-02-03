const Secret = require("../models/Secret.js");
const mongoose = require("mongoose");

const getSecrets = async (req,res)=>{
    try{
        const secrets=(await Secret.find()).sort({createdAt:-1});
        res.json(secrets);
    } catch (error){
        console.log("Error at get ",error);
        res.status(500).json({message:error.message});
    }
};

const createSecret = async (req,res)=>{
    const { text, category}=req.body;
    try{
        const newSecret = await Secret.create({text,category});
        res.status(201).json(newSecret);
    } catch(error){
         console.log("Error at post ",error);
        res.status(500).json({message:error.message});
    }
};

const likeSecret = async (req,res)=>{
    const{id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error:"Invalid secret id"});
    }
    try{
        const secret = await Secret.findByIdAndUpdate(
            id,
            {$inc:{likes:1}},
            {new:true},
        );
        if(!secret){
           return res.status(404).json({error:"No such secret"});
        }
        res.json(secret);
    } catch(error){
         console.log("Error at put ",error);
        res.status(500).json({message:error.message});
    }
};

module.exports={
    getSecrets,
    createSecret,
    likeSecret,
};
