import './db/connection.ts';
import './db/associations';

const express = require('express')
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const usersRouter = require(__dirname + '/routes/users');
const authRouter = require(__dirname + '/routes/auth');
const imagesRouter = require(__dirname + '/routes/images');
const commentsRouter = require(__dirname + '/routes/comments');

app.use('/getImage', express.static(__dirname + '/images/posts'));
app.use('/getImageProfile', express.static(__dirname + '/images/profile'));

app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/images", imagesRouter);
app.use("/comments", commentsRouter);



app.listen(8080);



