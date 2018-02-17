/**
 * Chat app setup
 * @Socket.io
 */

const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);
const Log = require('log'),
    log = new Log('info');

var port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/view/index.html');
})

/**
 * @Description-Chat Logic Implementation
 * @asb
 */

var numUsers = 0;

io.on('connection', function (socket) {
    var addedUser = false;
    log.info('Socket connection enabled');

    // Execute and listen client 'new message' on emit
    socket.on('new message', function (data) {
        // command client to execute new message
        socket.broadcast.emit('new message', {
            username: socket.username,
            message: data
        })
    })

    // Client emit 'add user'
    socket.on('add user', function (username) {
        if (addedUser) return;

        socket.username = username;
        ++numUsers;
        addedUser = true;

        socket.emit('login', {
            numUsers: numUsers
        })

        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers
        });
    })

    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', function () {
        socket.broadcast.emit('typing', {
            username: socket.username
        });
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', function () {
        socket.broadcast.emit('stop typing', {
            username: socket.username
        });
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function () {
        if (addedUser) {
            --numUsers;

            // echo globally that this client has left
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        }
    });
});

http.listen(port, function () {
    console.log('listing on the port %d', port);
})