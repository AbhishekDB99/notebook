const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser')
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');


// ROUTE 1:To fetch all the notes endpoint: "/api/auth/fetchallnotes,   Login required"
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    const notes = await Note.find({ user: req.user.id })
    res.send(notes);
})

// ROUTE 2:To add a new Note endpoint: "/api/auth/addnote,   Login required"
router.post('/addnote', fetchuser, [
    body("title", "Enter valid title").isLength({ min: 3 }),
    body("description", "Enter a valid description").isLength({ min: 5 })], async (req, res) => {
        try {

            const { title, description, tag } = req.body
            // If errors , return bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const note = new Note({
                title, description, tag, user: req.user.id
            })
            const saveNotes = await note.save()
            res.send(saveNotes);
        }
        catch (error) {
            console.log(error.message);
            res.status(400).send("Internal Server Error");
        }
    })
// ROUTE 3:To update a Note endpoint: "/api/auth/updatenote,   Login required"
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body
    try {
        
        // Create a newNote object to hold the updated notes
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };
        //Find the note and update it
        
        let note = await Note.findById(req.params.id)
        // To find the note to be updated
        if (!note) { return res.status(404).send("Not Found!") }
        // Allow updation only if the user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json(note)
    }catch (error) {
        console.log(error.message);
        res.status(400).send("Internal Server Error");
    }
    })
    
// ROUTE 4:To delete a Note endpoint: "/api/auth/deletenote,   Login required"
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        
        //Find the note and update it
        let note = await Note.findById(req.params.id)
        
        // To find the note to be deleted
        if (!note) { return res.status(404).send("Not Found!") }
        
        // Allow deletion only if the user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({"Success":"The note has been deleted", note:note})
    }catch (error) {
        console.log(error.message);
        res.status(400).send("Internal Server Error");
    }
})
module.exports = router