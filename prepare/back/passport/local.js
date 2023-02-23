const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const {User} = require('../models');
const bcrypt = require('bcrypt');

module.exports = () => {
    //패스포트 local 정해진 사용법임
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        // email, password 는 프론트에서 요청보낸 email, password 값
    }, async (email, password, done) => {
        try{
            const user = await User.findOne({
                where: {email}
            });
            if(!user) {
                return done(null, false, {reason: '존재하지 않는 계정입니다.'});
            }
            const result = await bcrypt.compare(password, user.password);
            if(result){
                return done(null, user);
            }
            return done(null, false, {reason: '비밀번호가 틀렸습니다.'});
        } catch (error){
            console.log(error);
            return done(error);
        }
    }));
};
