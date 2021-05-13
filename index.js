let express = require('express');
let app = express();

// var cors = require('cors');
// app.use(cors());

let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server, {
    cors: {
        origin: '*',
    }
});

const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const botName = 'Student Commune Bot';


//Runs when a new client connects
io.on('connection', (socket) => {
    console.log('User Connected');

    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        //Welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to Student Commune!'));

        //Broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${username} has joined the chat`));

        //Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    //Listen for Chat Message 
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        console.log('Message', msg);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
        }

        //Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

    });

    // socket.on('new-message', (message) => {
    //     io.emit('new-message', message);
    // })
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Started on port ${port}`);
});