const express=require('express');
const app=express();
const User = require('./models/User');
const Song=require('./models/Song');
const authRoutes=require('./routes/auth');
const songRoutes=require('./routes/song');
const playlistRoutes=require('./routes/playlist');
app.use(express.json());
require('dotenv').config();
const PORT = process.env.PORT || 3000;
app.use('/auth',authRoutes);
app.use('/song',songRoutes);
app.use('/playlist',playlistRoutes);
app.listen(PORT,()=>{
    console.log('Server is running on port 3000');
});