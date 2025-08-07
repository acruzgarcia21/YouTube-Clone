const express = require('express');
const { isLoggedIn } = require('../middleware/auth');
const router = express.Router();
const db = require('../config/database');

router.post("/create", isLoggedIn, async function(req,res,next){
    try {
        const user_id = req.session.user.user_id;
        const {post_id} = req.body;
        
        const[existing] = await db.query(
            `SELECT * FROM likes WHERE fk_user_id = ? AND fk_post_id = ?`,
            [user_id, post_id]
        );

        if(existing.length > 0) {
            // Unlikes post if already liked
            await db.query(
                `DELETE FROM likes WHERE fk_user_id = ? AND fk_post_id = ?`,
                [user_id, post_id]
            );
        } else {
            // Likes the post if not liked yet
            await db.query(
                `INSERT INTO likes (fk_user_id, fk_post_id) VALUES (?, ?)`,
                [user_id, post_id]
            );
        }
        
        res.json({liked: existing.length === 0});

    } catch (error) {
        next(error);
    }
});

module.exports = router;