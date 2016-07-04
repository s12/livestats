// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('../..')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Data
var mem     = {},
    cpu     = {},
    disk    = {},
    uptime  = {},
    users   = 0,
    leads   = 0,
    game    = {
      rules = [/* An array of objects */ /*{
        title: "string",
        description: "string",
        pointValue: 0,
      },*/],
      players = {
        byron: {
          points: 0,
        },
        michael: {
          points: 0,
        },
        jd: {
          points: 0,
        },
      },
    },
    hours   = 0;

io.on('connection', function(socket){
  var addedUser     = false,
      addedLead     = false,
      addedPoints   = false,
      addedHours    = false,
// Added events will update over brodcast message from socket connections

      changedMem    = false,
      changedCpu    = false,
      changedDisk   = false,
      changedUptime = false,
// Change events will update on an interval instead

// Update Intervals
      memInterval = 1000, // 1 second
      cpuInterval = 1000,
      diskInterval = 1000 *60 *60, // 1 hour
      uptimeInterval = 1000 *60 *3; // 3 minutes

  socket.on('add user', function(/* just counting don't need to pass any data */){
    if(addedUser) return;

    ++users;
    addedUser = true;

    socket.emit('visit', {
      users: users,
    });
  });

  socket.on('add lead', function(/* again just counting */){
    if(addedLead) return;

    ++leads;
    addedLead = true;

    socket.emit('convert', {
      leads: leads,
    });
  });

  socket.on('add points', function(player, points){
    if(addedPoints) return;

    ++game.players[player].points;
    addedPoints = true;

    socket.emit('score', {
      player: game.players[player],
      points: game.players[player].points,
    });
  });

  socket.on('add hours', function(/* no input needed */){
    if(addedHours) return;

    ++hours;
    addedHours = true;

    socket.emit('chaching', {
      hours: hours,
    });
  });
});
