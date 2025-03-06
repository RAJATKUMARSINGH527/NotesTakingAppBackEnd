const express = require('express');
const {NoteModel} = require('../models/note.model');
const {verifyToken,isUserBlocked} = require('../middlewares/auth.middleware');



const noteRouter = express.Router();


// routes/note.routes.js

/**
 * @swagger
 * components:
 *   schemas:
 *     Note:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the note.
 *           example: "64af23a95c3e4b1b1e6c2e12"
 *         title:
 *           type: string
 *           description: The title of the note.
 *           example: "Meeting Notes"
 *         description:
 *           type: string
 *           description: The description or content of the note.
 *           example: "Meeting notes from the project kickoff."
 *         userId:
 *           type: string
 *           description: The ID of the user who created the note.
 *           example: "64af23a95c3e4b1b1e6c2e99"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the note was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the note was last updated.
 */


/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Create a new note.
 *     description: Endpoint to create a new note for the authenticated user.
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Note'
 *     responses:
 *       201:
 *         description: Note created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Note created successfully"
 *                 newNote:
 *                   $ref: '#/components/schemas/Note'
 *       401:
 *         description: Unauthorized, token is missing or invalid.
 *       403:
 *         description: User is blocked.
 *       500:
 *         description: Internal server error.
 */

noteRouter.post('/createnotes',verifyToken,isUserBlocked, async(req, res) => {
  // const {title, description, userId, user} = req.body; // userId and user are automatically added by the authMiddleware 
  try{
    const newNote = new NoteModel(req.body);
    await newNote.save();
    res.status(201).json({"msg":"Note created successfully",newNote});
  }catch(error){
    res.status(500).json({msg:"Internal server error",error:error.message});
  }
});


/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Get all notes for the authenticated user.
 *     description: Endpoint to retrieve all notes for the logged-in user.
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of notes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The List of Notes"
 *                 notes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Note'
 *       401:
 *         description: Unauthorized, token is missing or invalid.
 *       403:
 *         description: User is blocked.
 *       500:
 *         description: Internal server error.
 */


noteRouter.get('/',verifyToken,isUserBlocked, async(req, res) => {
  try{
    const notes = await NoteModel.find({userId:req.body.userId}); //to get notes of a specific user
    // const notes = await NoteModel.find();//to get all notes
    res.status(200).json({message:"The List of Notes",notes});
  }catch(error){
    res.status(500).json({msg:"Internal server error",error:error.message});
  }
    
});


/**
 * @swagger
 * /notes/{noteId}:
 *   patch:
 *     summary: Update a specific note.
 *     description: Endpoint to update a specific note by its ID. Only the owner of the note can update it.
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the note to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Note'
 *     responses:
 *       200:
 *         description: Note updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "The Note with ID : 64af23a95c3e4b1b1e6c2e12 has been updated successfully"
 *                 updatedNote:
 *                   $ref: '#/components/schemas/Note'
 *       401:
 *         description: Unauthorized, token is missing or invalid.
 *       403:
 *         description: User is blocked.
 *       404:
 *         description: Unauthorized to update the note.
 *       500:
 *         description: Internal server error.
 */

noteRouter.patch('/:noteId', verifyToken,isUserBlocked,async(req, res) => {
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




/**
 * @swagger
 * /notes/{noteId}:
 *   delete:
 *     summary: Delete a specific note.
 *     description: Endpoint to delete a specific note by its ID. Only the owner of the note can delete it.
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the note to delete.
 *     responses:
 *       200:
 *         description: Note deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "The Note with ID : 64af23a95c3e4b1b1e6c2e12 has been deleted successfully"
 *       401:
 *         description: Unauthorized, token is missing or invalid.
 *       403:
 *         description: User is blocked.
 *       404:
 *         description: Unauthorized to delete the note.
 *       500:
 *         description: Internal server error.
 */




noteRouter.delete('/:noteId',verifyToken, isUserBlocked, async(req, res) => {
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