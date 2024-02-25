const express = require('express');
const cors = require('cors');
const userRouter = require('./routers/UserRouter.js');
const authRouter = require('./routers/AuthRouter.js');
const chatRouter = require('./routers/ChatRouter.js');
const groupRouter = require('./routers/GroupRouter.js');
const postRouter = require('./routers/PostRouter.js');
const wallRouter = require('./routers/WallRouter.js');
const dotenv = require('dotenv');
const AuthHelper = require('./helpers/AuthHelper.js');

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

const socket = require('socket.io');
const server = require('http').Server(app);
const io = socket(server);
app.use(function (req, res, next) {
  req.io = io;
  next();
});

io.on('connection', (socket) => {
  console.log('user connected', socket.id);
  socket.on('listen personal messages', (token) => {
    try {
      const id = AuthHelper.simpleAuthorize(token);
      socket.join(`personal ${id}`);
    } catch (exc) {
      console.log(exc);
      socket.emit('error', 'authorization failed');
    }
  });
  socket.on('listen chat room', (token, roomId) => {
    try {
      AuthHelper.simpleAuthorize(token);
      socket.join(`chat room ${roomId}`);
      console.log(`${socket.id} listening to room ${roomId}`);
    } catch (exc) {
      console.log(exc);
      socket.emit('error', 'authorization failed');
    }
  });
});

app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/chat', chatRouter);
app.use('/groups', groupRouter);
app.use('/posts', postRouter);
app.use('/walls', wallRouter);

server.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});

module.exports = app;
