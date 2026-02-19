const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const upload = require('../config/multer');
const cloudinary = require('../config/cloudinary');
const adminAuth = require('../middleware/auth');
const { uploadLimiter } = require('../middleware/rateLimit');

// @route   POST /api/upload
// @desc    Upload a new note
// @access  Public
router.post('/upload', uploadLimiter, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a file' });
        }

        const { subject, unit } = req.body;

        if (!subject || !unit) {
            // If validation fails, we should delete the uploaded file from Cloudinary to save space
            await cloudinary.uploader.destroy(req.file.filename, { resource_type: 'raw' });
            return res.status(400).json({ error: 'Please provide subject and unit' });
        }

        const newNote = new Note({
            subject,
            unit,
            fileUrl: req.file.path,
            publicId: req.file.filename
        });

        const savedNote = await newNote.save();

        res.status(201).json({
            message: 'Note uploaded successfully! It is pending approval.',
            note: savedNote
        });
    } catch (error) {
        console.error(error);
        if (req.file) {
            await cloudinary.uploader.destroy(req.file.filename, { resource_type: 'raw' });
        }
        res.status(500).json({ error: 'Server Error' });
    }
});

// @route   GET /api/notes
// @desc    Get all approved notes (with optional filtering)
// @access  Public
router.get('/notes', async (req, res) => {
    try {
        const { subject, unit } = req.query;
        let query = { isApproved: true };

        if (subject) query.subject = subject;
        if (unit) query.unit = unit;

        const notes = await Note.find(query).sort({ createdAt: -1 });
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// @route   GET /api/admin/all
// @desc    Get all notes (pending and approved)
// @access  Private (Admin)
router.get('/admin/all', adminAuth, async (req, res) => {
    try {
        const notes = await Note.find({}).sort({ isApproved: 1, createdAt: -1 }); // Pending first, then newest
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// @route   PATCH /api/admin/approve/:id
// @desc    Approve a note
// @access  Private (Admin)
router.patch('/admin/approve/:id', adminAuth, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        note.isApproved = true;
        await note.save();

        res.json({ message: 'Note approved successfully', note });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// @route   DELETE /api/admin/reject/:id
// @desc    Reject (delete) a note
// @access  Private (Admin)
router.delete('/admin/reject/:id', adminAuth, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(note.publicId, { resource_type: 'raw' });

        // Delete from MongoDB
        await note.deleteOne();

        res.json({ message: 'Note rejected and deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
