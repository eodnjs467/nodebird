const express = require('express');
const {Post, User, Comment, Image} = require('../models');
const {isLoggedIn} = require("./middlewares");
const router = express.Router();
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
