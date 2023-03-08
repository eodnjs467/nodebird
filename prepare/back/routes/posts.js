const express = require('express');
const {Post, User, Image, Comment} = require('../models');
const router = express.Router();

router.get('/', async (req, res, next) => {
    try{
        const posts = await Post.findAll({
            limit: 10,
            order: [
                ['createdAt', 'DESC'],
                [Comment, 'createdAt', 'DESC'],
            ],
            include: [{
                model: User,
                attributes: ['id', 'email', 'nickname'],
            }, {
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id', 'email', 'nickname'],
                }]
            }, {
                model: Image,
            }, {
                model: User,    // 좋아요 누른 사람
                as: 'Likers',
                attributes: ['id'],
            }, {
                model: Post,
                as: 'Retweet',
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }, {
                    model: Image,
                }]
            }]
        });
        res.status(200).json(posts);
    } catch (error) {
        console.log(error);
        next(error);
    }

});


module.exports = router;
