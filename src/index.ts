import './db/connection.ts';
import './db/associations';

const express = require('express')
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const usersRouter = require(__dirname + '/routes/users');
const authRouter = require(__dirname + '/routes/auth');
// const imagesRouter = require(__dirname + '/routes/images');
// const commentsRouter = require(__dirname + '/routes/comments');

app.use("/users", usersRouter);
app.use("/auth", authRouter);
// app.use("/images", imagesRouter);
// app.use("/comments", commentsRouter);




app.listen(8080);



