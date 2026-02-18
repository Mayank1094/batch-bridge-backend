const adminAuth = (req, res, next) => {
    const adminPassword = req.header('x-admin-password');

    if (!adminPassword) {
        return res.status(401).json({ error: 'No admin password provided' });
    }

    if (adminPassword !== process.env.ADMIN_PASSWORD) {
        return res.status(403).json({ error: 'Invalid admin password' });
    }

    next();
};

module.exports = adminAuth;
