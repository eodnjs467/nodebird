const express = require('express');
const {Post, User, Image, Comment} = require('../models');
const {Op} = require('sequelize');
const router = express.Router();

router.get('/', async (req, res, next) => {
    try{
        const where = {};
        // 초기 로딩이 아닐때
        if (parseInt(req.query.lastId, 10)) {
            where.id = {[Op.lt]: parseInt(req.query.lastId, 10)};
        }
        const posts = await Post.findAll({
            where,
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
