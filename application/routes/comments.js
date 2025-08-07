const express = require('express');
const { isLoggedIn } = require('../middleware/auth');
const router = express.Router();
const db = require('../config/database');

router.post("/create", isLoggedIn, async function (req, res, next) {
    try {
        const user_id = req.session.user.user_id;
        const { text, post_id } = req.body;

        if (!text || !post_id) {
            return res.status(400).json({ error: "Missing comment text or post ID" });
        }

        const [row, _] = await db.query(
            `INSERT INTO comments (text, fk_post_id, fk_user_id) VALUES (?, ?, ?)`,
            [text, post_id, user_id]
        );
        res.json({
            id: result.insertId,
            text,
            username: req.session.user.username,
            created_at: new Date().toISOString()
        });

    } catch (err) {
        next(err);
    }
});

module.exports = router;