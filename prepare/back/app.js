const express = require('express');
const cors = require('cors');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const db = require('./models');
const app = express();
const passportConfig = require('./passport');

db.sequelize.sync()
    .then(() => {
        console.log('db 연결 성공');
    })
    .catch(console.error);

passportConfig();

app.use(cors({
    origin: '*',
    credentials: false,
}));
app.use(express.json());        // 프론트에서 json 형식으로 보냈을 때 json 형식을 넣어주고
app.use(express.urlencoded({extended: true}));      // form 데이터를 넣었을 때 urlencoded 방식으로 넣어줌 이두개가 프론트에서 받은 데이터를 req.body 에 넣어주는 역할을 해준다.

// app.get('/', (req, res) => {
//     res.send('hello express!');
// });
app.use('/post', postRouter);
app.use('/user', userRouter);

app.listen(3065, () => {
    console.log('서버 실행 중...');
});
