const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', protect, adminOnly, upload.single('image'), (req, res) => {
    if (req.file) {
        const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        res.json({ url });
    } else {
        res.status(400).send('No file uploaded or file not supported.');
    }
});

module.exports = router;
