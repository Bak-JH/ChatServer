// Setup basic express server
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
const matchmaker = require('matchmaking');

function runGame(players:Player[]):void {
  console.log("Game started with:");
  console.log(players);
}

function getPlayerKey(player:Player):string{
  return player.id.toString();
}

let lobby = new matchmaker.LobbyMaker(runGame, getPlayerKey);

interface Player {
  id: number;
  name: string;
}

server.listen(port, () => {
  console.log('Server listening at http://localhost:%d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req:any, res:any) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/lists', (req:any, res:any) => {
  res.sendFile(path.join(__dirname, 'public/list.html'));
});

// Chatroom

let numUsers = 0;

io.on('connection', (socket: any) => {
  let addedUser = false;
  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data: string) => {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.player.username,
      message: data
    });
  });

  socket.on('create room', (host:Player) => {
    console.log(host);
    let id = lobby.createRoom(host, "Room 0");
    console.log('create room - ' + id);
  });

  socket.on('join room', (player:Player) => {
    console.log("find room: " + player.name);
    console.log(lobby.listRooms())
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username: string) => {
    if (addedUser) return;

    // we store the username in the socket session for this client
    ++numUsers;
    socket.player = {numUsers, username};
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
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.player.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.player.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
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