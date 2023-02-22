const express = require('express');
const postRouter = require('./routes/post');
const db = require('./models');
const app = express();

db.sequelize.sync()
    .then(() => {
        console.log('db 연결 성공');
    })
    .catch(console.error);

app.get('/', (req, res) => {
    res.send('hello express!');
});

app.post('/post', (req, res) => {
    res.json({id: 1, content: 'hello'});
});

app.delete('/post', (req, res) => {
    res.json({id: 1});
});
// app.use('post', postRouter);

app.listen(3066, () => {
    console.log('서버 실행 중...');
});
