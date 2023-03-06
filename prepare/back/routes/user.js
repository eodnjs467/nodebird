const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const {User, Post} = require('../models');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        if (req.user){
            const fullUserWithoutPassword = await User.findOne({
                where: {id: req.user.id},
                attributes: {
                    exclude: ['password'],
                },
                include: [{
                    model: Post,
                    attributes: ['id'],
                }, {
                    model: User,
                    as: 'Followers',
                    attributes: ['id'],
                }, {
                    model: User,
                    as: 'Followings',
                    attributes: ['id'],
                }],
            });
            res.status(200).json(fullUserWithoutPassword);
        }
        res.status(200).json(null);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        //  err 이 있다는 건 비동기요청한 서버에러가 발생했다.
        if(err){
            console.log(err);
            return next(err);
        }
        //  info 가 있다는건 클라이언트가 잘못함. 참고, local.js 에서 reason 설정해준 부분
        if(info) {
            return res.status(401).send(info.reason);
        }
        // user 가 있다는건데 로그인 성공 했다는거임.
        // user 내가 만든 서비스를 거치고나서 패스포트 로그인을 또 거침
        return req.login(user, async (loginError) => {
            //  passport 로그인 에러이다.
            if(loginError){
                console.log(loginError);
                return next(loginError);
            }
            const fullUserWithoutPassword = await User.findOne({
                where: {id: user.id},
                attributes: {
                    exclude: ['password'],
                },
                include: [{
                    model: Post,
                }, {
                    model: User,
                    as: 'Followers',
                    attributes: ['id'],
                }, {
                    model: User,
                    as: 'Followings',
                    attributes: ['id'],
                }]
            });
            // 내가 만든 서비스 통과 후, 패스포트 로그인 통과해서 진짜 최종 로그인 성공이라 user 정보 넘겨줌.
            return res.status(200).json(fullUserWithoutPassword);
        })
    })(req, res, next);
});

router.post('/', isNotLoggedIn, async (req, res, next) => {
    try {
        const exUser = await User.findOne({
            where: {
                email: req.body.email,
            }
        })
        if (exUser) {
            return res.status(403).send('이미 사용중인 아이디입니다.'); // 이게 사가에서 err.response.로 들어감
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        await User.create({
            email: req.body.email,
            nickname: req.body.nickname,
            password: hashedPassword,
        });
        // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3060');
        res.status(201).send('OK');
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.post('/logout', isLoggedIn, async (req, res, next) => {
    await req.logout(err => {
        if(err) {
            return next(err);
        }
        res.send('ok');
    })
});

router.patch('/nickname', isLoggedIn, async (req, res, next) => {
    try {
        console.log('req.body.nickname:', req.body.nickname)
        await User.update({
            nickname: req.body.nickname,
        }, {
            where: {id: req.user.id},
        });
        res.status(200).json({nickname: req.body.nickname});
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => { // PATCH /user/1/follow
    try{
        const user = await User.findOne({
            where: {id: req.params.userId},
        });
        if(!user) {
            return res.status(403).send('존재하지 않는 사용자입니다.');
        }
        // res.status(200).send(' good~~');
        await user.addFollowers(req.user.id);
        // await user.addFollowings(req.params.id);
        res.status(200).json({UserId: parseInt(req.params.userId, 10)});
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => {  // DELETE /user/1/follow
    try{
        const user = await User.findOne({
            where: {id: req.params.userId},
        });
        if(!user) {
            return res.status(403).send('존재하지 않는 사용자입니다.');
        }
        await user.removeFollowers(req.user.id);
        res.status(200).json({UserId: parseInt(req.params.userId, 10)});
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.delete('/follower/:userId', async (req, res, next) => {  // DELETE /user/follower/1
    try{
        const user = await User.findOne({
            where: {id: req.params.userId},
        });
        if(!user) {
            return res.status(403).send('존재하지 않는 사용자입니다.');
        }
        await user.removeFollowings(req.user.id);
        res.status(200).json({UserId: user.id});
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.get('/follower', isLoggedIn, async (req, res, next) => {
    try{
        const user = await User.findOne({
            where: {id: req.user.id},
        });
        if(!user) {
            return res.status(403).send('존재하지 않는 사용자입니다.');
        }
        const followers = await user.getFollowers({
            attributes:['id', 'nickname']
        });
        res.status(200).json(followers)
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.get('/following', isLoggedIn, async (req, res, next) => {
    try{
        const user = await User.findOne({
            where: {id: req.user.id},
        });
        if(!user) {
            return res.status(403).send('존재하지 않는 사용자입니다.');
        }
        const followings = await user.getFollowings({
            attributes:['id', 'nickname']
        });
        res.status(200).json(followings)
    } catch (error) {
        console.log(error);
        next(error);
    }
});


module.exports = router;
