const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {Post, User, Comment, Image} = require('../models');
const {isLoggedIn} = require("./middlewares");
const router = express.Router();

try {
    fs.accessSync('uploads');   //  uploads 폴더가 있는지 확인
} catch (error) {   //   없으면 error 나고 생성됨
    console.log('uploads 폴더가 없으므로 생성합니다.');
    fs.mkdirSync('uploads');
}
router.post('/', isLoggedIn, async (req, res, next) => {
    try{
        const post = await Post.create({
            content: req.body.content,
            UserId: req.user.id,
        });

        const fullPost = await Post.findOne({
            where: {id: post.id},
            include: [{
                model: Image,
            }, {
                model: Comment,
                include: [{
                    model: User,    // 댓글 작성자
                    attributes: ['id', 'email', 'nickname'],
                }],
            }, {
                model: User,    //게시글 작성자
                attributes: ['id', 'email', 'nickname'],
            }, {
                model: User,    // 좋아요 누른 사람
                as: 'Likers',
                attributes: ['id'],
            }],
        });
        res.status(201).json(fullPost);
    }catch (error){
        console.log(error);
        next(error);
    }
});

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads');
        },
        filename(req, file, done) { // 도라에몽.png
            const ext = path.extname(file.originalname);    //  확장자 추출(.png)
            const basename = path.basename(file.originalname, ext)  // 이름 추출(도라에몽)
            done(null, basename + new Date().getTime() + ext);  // 도라에몽42352342342.png
        }
    }),
    limits: {fileSize: 20 * 1024 * 1024}, // 20MB
});
router.post('/images', isLoggedIn, upload.array('image'), (req, res, next) => {
    console.log(req.files);
    res.json(req.files.map((v) => v.filename));
});

router.patch('/:postId/like', isLoggedIn, async (req, res, next) => {
    try{
        const post = await Post.findOne({
            where: {id: req.params.postId},
        });
        if(!post){
            return res.status(403).send('존재하지 않는 게시글입니다.');
        }
        await post.addLikers(req.user.id);
        res.json({PostId: post.id, UserId: req.user.id});
    } catch (error){
        console.log(error);
        next(error);
    }
});

router.delete('/:postId/like', isLoggedIn, async (req, res, next) => {
    try{
        const post = await Post.findOne({
            where: {id: req.params.postId},
        });
        if(!post){
            return res.status(403).send('존재하지 않는 게시글입니다.');
        }
        await post.removeLikers(req.user.id);
        res.json({PostId: post.id, UserId: req.user.id});
    } catch (error){
        console.log(error);
        next(error);
    }
});
router.post(`/:postId/comment`, isLoggedIn, async (req, res, next) => {
    try {
        console.log('back:  ', req.params.postId);
        const post = await Post.findOne({
            where: {id: req.params.postId},
        });
        if (!post) {
            return res.status(403).send('존재하지 않는 게시글입니다.');
        }
        const comment = await Comment.create({
            content: req.body.content,
            PostId: parseInt(req.params.postId),  //  req.params 는 무조건 문자열임
            UserId: req.user.id,
        });
        const fullComment = await Comment.findOne({
            where: {id: comment.id},
            include: [{
                model: User,
                attributes: ['id', 'email', 'nickname'],
            }],
        });
        res.status(201).json(fullComment);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.delete('/:postId', isLoggedIn, async (req, res, next) => {
    try{
        await Post.destroy({
            where: {
                id: req.params.postId,
                UserId: req.user.id,        //  본인 게시글인지 확인
            },
        });
        res.json({PostId: parseInt(req.params.postId, 10)});
    } catch (error){
        console.log(error);
        next(error);
    }
});

module.exports = router;
