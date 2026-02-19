const rateLimit = require('express-rate-limit');

const uploadLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 8, // limit each IP to 8 requests per windowMs
    message: { error: 'Too many uploads from this IP, please try again after 10 minutes' }
});

module.exports = { uploadLimiter };
