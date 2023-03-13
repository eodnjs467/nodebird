const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {Post, User, Comment, Image, Hashtag} = require('../models');
const {isLoggedIn} = require("./middlewares");
const router = express.Router();

try {
    fs.accessSync('uploads');   //  uploads 폴더가 있는지 확인
} catch (error) {   //   없으면 error 나고 생성됨
    console.log('uploads 폴더가 없으므로 생성합니다.');
    fs.mkdirSync('uploads');
}
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

router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
    try{
        const hashtag = req.body.content.match(/#[^\s#]+/g);
        const post = await Post.create({
            content: req.body.content,
            UserId: req.user.id,
        });
        if (hashtag) {
            const result = await Promise.all(hashtag.map((tag) => Hashtag.findOrCreate({
                where: {name: tag.slice(1).toLowerCase()}
            })));   //[[노드, true], [익스프레스, true]]
            await post.addHashtags(result.map((v) => v[0]));
        }
        if(req.body.image) {
            if(Array.isArray(req.body.image)){
                const images = await Promise.all(req.body.image.map((image) => Image.create({src: image})));
                await post.addImages(images);
            } else {
                const image = await Image.create({src: req.body.image})
                await post.addImages(image);
            }
        }

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

router.post('/images', isLoggedIn, upload.array('image'), (req, res, next) => {
    console.log(req.files);
    res.json(req.files.map((v) => v.filename));
});

router.get('/:postId', async (req, res, next) => {
    try{
        const post = await Post.findOne({
            where: {id: req.params.postId},
        });
        console.log('여기!', req.params.postId);
        if(!post){
            return res.status(403).send('존재하지 않는 게시글입니다.');
        }
        const fullPost = await Post.findOne({
            where: {id: post.id},
            include: [{
                model: Post,
                as: 'Retweet',
                include: [{
                    model: User,
                    attributes: ['id', 'nickname']
                }, {
                    model: Image,
                }],
            }, {
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }],
            }, {
                model: User,
                attributes: ['id', 'nickname'],
            }, {
                model: User,
                as: 'Likers',
                attributes: ['id'],
            }, {
                model: Image,
            }],
        });
        res.status(200).json(fullPost);
    } catch (error){
        console.log(error);
        next(error);
    }
});

router.post('/:postId/retweet', isLoggedIn, async (req, res, next) => {
    try{
        const post = await Post.findOne({
            where: {id: req.params.postId},
            include: [{
                model: Post,
                as: 'Retweet',
            }],
        });
        if(!post){
            return res.status(403).send('존재하지 않는 게시글입니다.');
        }
        if (post.UserId === req.user.id || post.Retweet && post.Retweet.UserId === req.user.id) {
            return res.status(403).send('자신의 게시글을 리트윗 할 수 없습니다.');
        }
        const retweetTargetId = post.RetweetId || post.id;
        const exPost = await Post.findOne({
            where: {
                UserId: req.user.id,
                RetweetId: retweetTargetId,
            },
        });
        if (exPost) {
            return res.status(403).send('이미 리트윗 하셨습니다.')
        }
        const retweet = await Post.create({
            UserId: req.user.id,
            RetweetId: retweetTargetId,
            content: 'retweet',
        });
        //위 retweet 에 정보를 추가해서 보내주기 위함
        const retweetWithPrevPost = await Post.findOne({
            where: {id: retweet.id},
            include: [{
                model: Post,
                as: 'Retweet',
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }, {
                    model: Image,
                }]
            }, {
                model: User,
                attributes: ['id', 'nickname'],
            }, {
                model: Image,
            }, {
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }]
            }, {
                model: User,
                as: 'Likers',
                attributes: ['id'],
            }]
        });
        res.status(200).json(retweetWithPrevPost);
    } catch (error){
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
