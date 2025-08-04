const express = require('express');
const router = express.Router();
const multer = require('multer');
const { isLoggedIn } = require('../middleware/auth');
const db = require("../config/database");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/videos/uploads')
    },
    filename: function (req, file, cb) {
        let fileExt = file.mimetype.split("/")[1]
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExt}`)
    }
});

const uploader = multer({ storage: storage });


router.post('/create', isLoggedIn, uploader.single('videoUpload'), async function (req, res, next) {
    const user_id = req.session.user.user_id;
    const { title, description } = req.body;
    const { path } = req.file;

    if (!title || !description || !path) {
        req.flash("error", "Request must have title AND description AND video");
        return req.session.save((err) => {
            res.redirect("/post");
        })
    }
    try {
        const [ resultObj, _ ] = await db.query(`INSERT INTO post (title, description, video, thumbnail, fk_user_id) VALUE 
            (?,?,?,?,?)`, [title, description, path, "", user_id]);

        if (resultObj.affectedRows == 1) {
            req.flash("success", "Your post has been created");
            return req.session.save((err) => {
                if (err) next(err);
                res.redirect(`/posts/${resultObj.insertId}`);
            })
        } else {
            req.flash("error", "Your post could not be created");
            return req.session.save((err) => {
                if (err) next(err);
                return res.redirect('/post');
            })
        }
    } catch (err) {
        next(err)
    }
});

router.get('/:id(\\d+)', function (req, res, next) {
  res.render('view', { title: 'View Post', css: ['style.css'] });
});

module.exports = router;