const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        let resourceType = 'image';
        let format = undefined;

        if (file.mimetype === 'application/pdf') {
            resourceType = 'raw';
            format = 'pdf';
        }

        return {
            folder: 'batch-bridge-notes',
            resource_type: resourceType,
            format: format,
            public_id: file.originalname.split('.')[0] + '-' + Date.now(),
        };
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 30 * 1024 * 1024 } // 30MB limit
});

module.exports = upload;
