const express=require('express');
const router=express.Router();
const Playlist=require('../models/Playlist');
const User=require('../models/User');
const Song=require('../models/Song');
const auth=require('../middleware/auth');
const passport=require('passport');
router.post('/create',passport.authenticate('jwt',{session:false}),async(req,res)=>{
    const currentUser=req.user;
    const {name,thumbnail,songs}=req.body;
    if(!name || !thumbnail || !songs){
        return res.status(301).json({error:"Please fill all the fields"});
    }
    const playlistData={
        name,
        thumbnail,
        songs,
        owner:currentUser._id,
        collaborators:[]
    }
    const playlist=await Playlist.create(playlistData);
    return res.status(201).json(playlist);
});
router.get('/get/playlist/:playlistId',passport.authenticate('jwt',{session:false}),async(req,res)=>{
    const playlistId=req.params.playlistId;
    const playlist=await Playlist.findOne({_id:playlistId});
    if(!playlist){
        return res.status(301).json({error:"Playlist not found"});
    }
    return res.status(200).json(playlist);
});
router.get('/get/artist/:artistId',passport.authenticate('jwt',{session:false}),async(req,res)=>{
    const artistId=req.params.artistId;
    const artist=User.findOne({_id:artistId});
    if(!artist){
        return res.status(304).json({error:"Artist not found"});
    }
    const playlist=await Playlist.find({owner:artistId});
    return res.status(200).json({data:playlist});
});
router.post('/add/song',passport.authenticate('jwt',{session:false}),async(req,res)=>{
    const currentUser=req.user;
    const {playlistId,songId}=req.body;
    const playlist=await Playlist.findOne({_id:playlistId});
    if(!playlist){
        return res.status(304).json({error:"Playlist not found"});
    }
    if(!playlist.owner.equals(currentUser._id)&&!playlist.collaborators.includes(currentUser._id)){
        return res.status(304).json({error:"You are not authorized to perform this action"});        
    }
    const song=await Song.findOne({_id:songId});
    if(!song){
        return res.status(304).json({error:"Song not found"});
    }
    playlist.songs.push(songId);
    await playlist.save();
    return res.status(200).json(playlist);
})
module.exports=router;