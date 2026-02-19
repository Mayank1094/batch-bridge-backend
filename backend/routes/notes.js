const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

const cloudinary = require('../config/cloudinary');
const adminAuth = require('../middleware/auth');
const { uploadLimiter } = require('../middleware/rateLimit');

// @route   GET /api/upload-signature
// @desc    Get signature for client-side upload
// @access  Public
router.get('/upload-signature', uploadLimiter, (req, res) => {
    try {
        const timestamp = Math.round((new Date).getTime() / 1000);
        const signature = cloudinary.utils.api_sign_request({
            timestamp: timestamp,
            folder: 'batch-bridge-notes'
        }, process.env.CLOUDINARY_API_SECRET);

        res.json({
            timestamp,
            signature,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// @route   POST /api/upload
// @desc    Save note metadata after client-side upload
// @access  Public
router.post('/upload', uploadLimiter, async (req, res) => {
    try {
        const { subject, unit, fileUrl, publicId } = req.body;

        if (!fileUrl || !publicId) {
            return res.status(400).json({ error: 'Missing file information' });
        }

        if (!subject || !unit) {
            // If we have the publicId, we should try to delete the orphaned file from Cloudinary
            if (publicId) {
                await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
            }
            return res.status(400).json({ error: 'Please provide subject and unit' });
        }

        const newNote = new Note({
            subject,
            unit,
            fileUrl,
            publicId
        });

        const savedNote = await newNote.save();

        res.status(201).json({
            message: 'Note uploaded successfully! It is pending approval.',
            note: savedNote
        });
    } catch (error) {
        console.error(error);
        // If there's a server error saving to DB, try to clean up the uploaded file
        if (req.body.publicId) {
            await cloudinary.uploader.destroy(req.body.publicId, { resource_type: 'raw' });
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
