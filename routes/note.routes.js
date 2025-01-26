const express = require('express');
const {NoteModel} = require('../models/note.model');
const {authMiddleware} = require('../middlewares/auth.middleware');


const noteRouter = express.Router();


noteRouter.post('/',authMiddleware, async(req, res) => {
  // const {title, description, userId, user} = req.body; // userId and user are automatically added by the authMiddleware 
  try{
    const newNote = new NoteModel(req.body);
    await newNote.save();
    res.status(201).json({"msg":"Note created successfully",newNote});
  }catch(error){
    res.status(500).json({msg:"Internal server error",error:error.message});
  }
});

noteRouter.get('/',authMiddleware, async(req, res) => {
  try{
    const notes = await NoteModel.find({userId:req.body.userId}); //to get notes of a specific user
    // const notes = await NoteModel.find();//to get all notes
    res.status(200).json({message:"The List of Notes",notes});
  }catch(error){
    res.status(500).json({msg:"Internal server error",error:error.message});
  }
    
});

noteRouter.patch('/:noteId', authMiddleware,async(req, res) => {
  const {noteId} = req.params;
  try{
    const updatedNote = await NoteModel.findOne({_id:noteId});

    // console.log("userId from note : ",noteId.userId);
    // console.log("userId from req : ",req.body.userId);
    
    if(updatedNote.userId.toString() === req.body.userId){
      await NoteModel.findByIdAndUpdate({_id:noteId},req.body,{new:true});
      res.status(200).json({msg:`The Note with ID : ${noteId} has been updated successfully`,updatedNote});
    }else{
      res.status(404).json({msg:"You are not authorized to update this note"});
    }
  }catch(error){
    res.status(500).json({msg:"Internal server error",error:error.message});
  }
    
});

noteRouter.delete('/:noteId',authMiddleware, async(req, res) => {
  const {noteId} = req.params;
  try{
    const noteToBeDeleted = await NoteModel.findOne({_id:noteId});
    
    if(noteToBeDeleted.userId.toString() === req.body.userId){
      await NoteModel.findByIdAndDelete({_id:noteId});
      res.status(200).json({msg:`The Note with ID : ${noteId} has been delete successfully`});
    }else{
      res.status(404).json({msg:"You are not authorized to delete this note"});
    }
  }catch(error){
    res.status(500).json({msg:"Internal server error",error:error.message});
  }
    
});

module.exports = noteRouter;