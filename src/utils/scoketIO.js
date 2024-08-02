const { Server } = require('socket.io');

const connectChat = () => {
    try {
        const io = new Server({
            cors: {
              origin: "http://localhost:3000"
            }
          });


        io.on('connection', (socket) => {
            console.log('User connected', socket.id);
            socket.emit("welcome", "Welcome to fruitables.");
            socket.broadcast.emit("broadcast", `${socket.id} is join the server`);

            socket.on("message", ({message, group}) => {
                // console.log({message, to});
                // socket.broadcast.emit("rec-msg", message);
                // io.to(to).emit("rec-msg", message);  //specific user
    
                io.to(group).emit("rec-msg", message);  //to group
            });

            socket.on("join_group", (group) => {
                socket.join(group);
            })
        });

        io.listen(8080);
    } catch (error) {
        console.log(error);
    }   
}

module.exports = {
    connectChat
}