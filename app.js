/**
 * Chat app setup
 * @Socket.io
 */

const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/view/index.html');
})

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.broadcast.emit('hi');
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
         io.emit('chat message', msg);
      });
});

http.listen(3000, function () {
    console.log('listing on the port 3000');
})