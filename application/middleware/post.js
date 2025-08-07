var pathToFFMPEG = require("ffmpeg-static");
var promisify = require('util').promisify; // need to install with npm i ffmpeg-static
var exec = promisify(require("child_process").exec);
const db = require('../config/database');

module.exports = {
    makeThumbnail: async function (req, res, next) {
        if (!req.file) {
            next(new Error("File upload failed"));
        } else {
            try {
                var destinationOfThumbnail = `public/images/uploads/thumbnail-${req.file.filename.split(".")[0]
                    }.png`;
                var thumbnailCommand =
                    `"${pathToFFMPEG}" -ss 00:00:01 -i ${req.file.path} -y -s 200x200 -vframes 1 -f image2 ${destinationOfThumbnail}`;
                var { stdout, stderr } = await exec(thumbnailCommand);
                console.log(stdout);
                console.log(stderr);
                req.file.thumbnail = destinationOfThumbnail;
                next();
            } catch (error) {
                next(error);
            }
        }
    },
    getRecentPosts: async function (req, res, next) {
        try {
            const [rows, _] = await db.query(`
                SELECT post_id, title, description, thumbnail, video, created_at 
                FROM post 
                ORDER BY created_at DESC 
                LIMIT 10;`
            );
            res.locals.recentPosts = rows;
            next();
        } catch (error) {
            next(error);
        }
    },
    getPostById: async function (req, res, next) {
        try {
            const { id } = req.params;
            const [rows] = await db.query(`
                SELECT post_id, title, description, video, u.username, p.created_at
                FROM post p
                JOIN user u ON p.fk_user_id = u.user_id
                WHERE post_id = ?;
            `, [id]);


            const post = row[0];
            if (!post) {
                return res.status(404).send("Post not found");
            }

            res.locals.post = post;
            next();
        } catch (err) {
            next(err);
        }
    },
    getCommentsByPostId: async function (req, res, next) {
        try {
            const { id } = req.params;
            const [rows, _] = await db.query(`
                SELECT c.id, c.text, c.created_at, u.username
                FROM comments c
                JOIN user u ON c.fk_user_id = u.user_id
                WHERE c.fk_post_id = ?
                ORDER BY c.created_at DESC;
            `, [id]);
            res.locals.post.commments = rows;
            next();
        } catch (error) {
            next(error);
        }

        // res.locals.post.comments 
    },
    getLikesByPostId: async function (req, res, next) {
        try {
            const { id } = req.params;
            const user_id = req.session?.user?.user_id || 0;

            // Total likes count
            const [likeCountResult] = await db.query(`
                SELECT COUNT(*) AS likeCount FROM likes WHERE fk_post_id = ?;
            `, [id]);
            const likeCount = likeCountResult[0]?.likeCount || 0;

            // Whether current user liked this post
            const [likedResult] = await db.query(`
                SELECT * FROM likes WHERE fk_post_id = ? AND fk_user_id = ?;
            `, [id, user_id]);
            const userLiked = likedResult.length > 0;

            res.locals.likeCount = likeCount;
            res.locals.userLiked = userLiked;

            next();
        } catch (err) {
            next(err);
        }
    },
    getPostByUserId: async function (req, res, next) {
        try {
            const user_id = req.params.user_id;
            const [rows, _] = await db.query(`
                SELECT post_id, title, description, thumbnail, video, created_at
                FROM post
                WHERE fk_user_id = ?
                ORDER BY created_at DESC;
            `, [user_id]);
            res.locals.post.userPosts = rows;
        } catch (error) {
            next(error);
        }
    }
};