const { Server } = require('socket.io');

const connectChat = () => {
    const io = new Server({
        cors: {
          origin: "https://2pm-frontend.vercel.app"
        }
      });

    io.on('connection', (socket) => {
        console.log('a user connected', socket.id);

        socket.emit("welcome", "Welcome to fruitables.");   //client who join the chat get message

        socket.broadcast.emit("greeting", "Hello all"); //all client get message instead of ourself
    });

    io.listen(8080);
}

module.exports = connectChat