const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cors = require('cors');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const db = require('./models');

const dotenv = require('dotenv');
const morgan = require('morgan');
const passportConfig = require('./passport');
const path = require("path");

dotenv.config();
const app = express();
db.sequelize.sync()
    .then(() => {
        console.log('db 연결 성공');
    })
    .catch(console.error);
passportConfig();
app.use(morgan('dev'));
app.use(cors({
    origin: true,
    credentials: true,
}));
app.use('/', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());        // 프론트에서 json 형식으로 보냈을 때 json 형식을 넣어주고
app.use(express.urlencoded({extended: true}));      // form 데이터를 넣었을 때 urlencoded 방식으로 넣어줌 이두개가 프론트에서 받은 데이터를 req.body 에 넣어주는 역할을 해준다.
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(passport.initialize());
app.use(passport.session());

// app.get('/', (req, res) => {
//     res.send('hello express!');
// });
app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/user', userRouter);

app.listen(3065, () => {
    console.log('서버 실행 중...');
});
