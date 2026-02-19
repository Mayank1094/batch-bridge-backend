const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'batch-bridge-notes',
        resource_type: 'auto', // Handle both images and PDFs automatically
        public_id: (req, file) => file.originalname.split('.')[0] + '-' + Date.now(),
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 30 * 1024 * 1024 } // 30MB limit
});

module.exports = upload;
