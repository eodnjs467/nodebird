const express = require('express');
const {Post, User, Comment, Image} = require('../models');
const {isLoggedIn} = require("./middlewares");
const router = express.Router();
router.post('/', isLoggedIn, async (req, res, next) => {
    console.log('req.user: ', req.user);
    try{
        const post = await Post.create({
            content: req.body.content,
            UserId: req.user.id,성
        });

        const fullPost = await Post.findOne({
            where: {id: post.id},
            include: [{
                model: Image,
            }, {
                model: Comment,
                include: [{
                    attributes: ['id', 'email', 'nickname'],
                }],
            }, {
                model: User,
                attributes: ['id', 'email', 'nickname'],
            }],
        });
        res.status(201).json(fullPost);
    }catch (error){
        console.log(error);
        next(error);
    }

});

router.post(`/:postId/comment`, isLoggedIn, async (req, res, next) => {
    try{
        console.log('back:  ', req.params.postId);
        const post = await Post.findOne({
            where: {id: req.params.postId},
        });
        if(!post){
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
    }catch (error){
        console.log(error);
        next(error);
    }
})

router.delete('/', isLoggedIn, async (req, res, next) => {
    res.json({id: req.body.postId});
});

module.exports = router;
