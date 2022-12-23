"use strict";
// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var matchmaker = require('matchmaking');
function runGame(players) {
    console.log("Game started with:");
    console.log(players);
}
function getPlayerKey(player) {
    return player.id.toString();
}
var lobby = new matchmaker.LobbyMaker(runGame, getPlayerKey);
server.listen(port, function () {
    console.log('Server listening at http://localhost:%d', port);
});
// Routing
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});
app.get('/lists', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/list.html'));
});
// Chatroom
var numUsers = 0;
io.on('connection', function (socket) {
    var addedUser = false;
    // when the client emits 'new message', this listens and executes
    socket.on('new message', function (data) {
        // we tell the client to execute 'new message'
        socket.broadcast.emit('new message', {
            username: socket.player.username,
            message: data
        });
    });
    socket.on('create room', function (host) {
        console.log(host);
        var id = lobby.createRoom(host, "Room 0");
        console.log('create room - ' + id);
    });
    socket.on('join room', function (player) {
        console.log("find room: " + player.name);
        console.log(lobby.listRooms());
    });
    // when the client emits 'add user', this listens and executes
    socket.on('add user', function (username) {
        if (addedUser)
            return;
        // we store the username in the socket session for this client
        ++numUsers;
        socket.player = { numUsers: numUsers, username: username };
        addedUser = true;
        socket.emit('login', {
            numUsers: numUsers
        });
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
            username: socket.player.username,
            numUsers: numUsers
        });
    });
    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', function () {
        socket.broadcast.emit('typing', {
            username: socket.player.username
        });
    });
    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', function () {
        socket.broadcast.emit('stop typing', {
            username: socket.player.username
        });
    });
    // when the user disconnects.. perform this
    socket.on('disconnect', function () {
        if (addedUser) {
            --numUsers;
            // echo globally that this client has left
            socket.broadcast.emit('user left', {
                username: socket.player.username,
                numUsers: numUsers
            });
        }
    });
});
