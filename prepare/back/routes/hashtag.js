const express = require('express');
const {Post, User, Comment, Image, Hashtag} = require('../models');

const {Op} = require("sequelize");

const router = express.Router();
router.get('/:hashtag', async (req, res, next) => {
    try{
        const where = {};
        if(parseInt(req.query.lastId, 10)) {
            where.id = {[Op.lt]: parseInt(req.query.lastId, 10)}
        }
        const posts = await Post.findAll({
            where,
            limit: 10,
            include: [{
                model: Hashtag,
                where: {name: decodeURIComponent(req.params.hashtag)},
            }, {
                model: User,
                attributes: ['id', 'nickname'],
            }, {
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }]
            }, {
                model: User,
                through: 'Like',
                as: 'Likers',
                attributes: ['id'],
            }, {
                model: Image,
            }, {
                model: Post,
                as: 'Retweet',
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }, {
                    model: Image,
                }],
            }],
        });
        res.status(201).json(posts);
    } catch (error) {
        console.log(error);
        next(error);
    }
})

module.exports = router;
