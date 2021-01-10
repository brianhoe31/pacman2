const express = require('express');
const app = express();
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');
const server = app.listen(8888);
const io = require('socket.io')(server);
let playerNum = 1;
let players = [];

let world = [
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    [2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2],
    [2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2],
    [2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2],
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    [2, 1, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 2],
    [2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2],
    [2, 1, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 2],
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    [2, 1, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 2],
    [2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2],
    [2, 1, 2, 2, 2, 1, 2, 1, 2, 2, 2, 1, 2],
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
];

class User {
    constructor(playerNum, name, x) {
        this.x = playerNum;
        this.y = 1;
        this.name = name;
        this.number = playerNum
    }
}


io.on('connection', function (socket) {

    socket.on('new_user', function (data) {
        var newPlayer = new User(playerNum, data.name);
        players.push(newPlayer);
        playerNum++;
        let foundPlayer = players.find(x => x.name === data.name);
        socket.emit('start_player', foundPlayer);
    })

    //when the 'start game' button is pressed, 
    socket.on('start_game', function (data) {

        socket.emit('start_map', { map: world });
    })

    socket.on('move', function (data) {
        //get the player
        let foundPlayer = players.find(x => x.name === data.name);

        if (data.move == 'up') {
            foundPlayer.y--;

            if (world[foundPlayer.y][foundPlayer.x] == 2) {
                pacman.y++;
            } else if (world[foundPlayer.y][foundPlayer.x] == 1) {
                //change that spot to have no coin
                world[foundPlayer.y][foundPlayer.x] = 0;
            }
            
            socket.emit('update_move', foundPlayer);
        }
    })

});
