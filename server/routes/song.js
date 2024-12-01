const express = require('express');
const router=express.Router();
const Song=require('../models/Song');
const User=require('../models/User');
const db = require('../db');
const passport=require('passport');
const jwt=require('../jwt');
router.post('/create',passport.authenticate("jwt",{session:false}),async(req,res)=>{
    const {name,thumbnail,track}=req.body;
    if(!name || !thumbnail || !track){
        return res.status(400).json({error:"Please fill all the fields"});
    }
    const artist=req.user._id;
    const newSongData=new Song({
        name,
        thumbnail,
        track,
        artist
    });
    const newSong=await Song.create(newSongData);
    return res.status(200).json(newSong);
});
router.get('/all/mysongs',passport.authenticate("jwt",{session:false}),async(req,res)=>{
    const currentuser=req.user;
    const songs=await Song.find({artist:currentuser._id});
    return res.status(200).json(songs); 
});
router.get('/get/artist/:artistId',passport.authenticate("jwt",{session:false}),async(req,res)=>{
    const {artistId}=req.params;
    const artist=await User.find({_id:artistId});
    if(!artist){
        return res.status(301).json({error:"No artist found"});
    }
    const songs=await Song.findOne({artist:artistId});
    return res.status(200).json(songs);
});
router.get('/get/songname/:songName',passport.authenticate("jwt",{session:false}),async(req,res)=>{
    const {songName}=req.params;
    const songs=await Song.find({name:songName});
    return res.status(200).json(songs);
});
module.exports = router;