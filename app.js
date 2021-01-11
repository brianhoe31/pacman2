const express = require('express');
const app = express();
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');
const server = app.listen(8888);
const io = require('socket.io')(server);
let playerNum = 0;
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
        this.x = playerNum + 1;
        this.y = 1;
        this.name = name;
        this.number = playerNum
        this.coin = false;
        this.points = 0;
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

    //check if there are 2 players, if so, start the map
    socket.on('check_player', function(){
        if(playerNum > 1){
            io.emit('start_map', { map: world });
        }
    })

    //send the data of the person that's not sent from data
    socket.on('update_opp', function(data){
        let opp;
        for(var i=0; i<players.length; i++){
            if(players[i].name !== data.name){
                opp = players[i];
            }
        }
        socket.emit('send_opp', opp);
    })

    socket.on('move', function (data) {
        //get the player
        let foundPlayer = players.find(x => x.name === data.name);

        if (data.direction == 'up') {
            foundPlayer.y--;

            if (world[foundPlayer.y][foundPlayer.x] == 2) {
                foundPlayer.y++;
                foundPlayer.coin = false;
            } else if (world[foundPlayer.y][foundPlayer.x] == 1) {
                foundPlayer.coin = true;
                world[foundPlayer.y][foundPlayer.x] = 0;
            }
        } else if (data.direction == 'right'){
            foundPlayer.x++;
            
            if (world[foundPlayer.y][foundPlayer.x] == 2) {
                foundPlayer.x--;
                foundPlayer.coin = false;
            } else if (world[foundPlayer.y][foundPlayer.x] == 1) {
                foundPlayer.coin = true;
                world[foundPlayer.y][foundPlayer.x] = 0;
            } 
        } else if (data.direction == 'down'){
            foundPlayer.y++;
            
            if (world[foundPlayer.y][foundPlayer.x] == 2) {
                foundPlayer.y--;
                foundPlayer.coin = false;
            } else if (world[foundPlayer.y][foundPlayer.x] == 1) {
                foundPlayer.coin = true;
                world[foundPlayer.y][foundPlayer.x] = 0;
            } 
        } else if (data.direction == 'left'){
            foundPlayer.x--;
            
            if (world[foundPlayer.y][foundPlayer.x] == 2) {
                foundPlayer.x++;
                foundPlayer.coin = false;
            } else if (world[foundPlayer.y][foundPlayer.x] == 1) {
                foundPlayer.coin = true;
                world[foundPlayer.y][foundPlayer.x] = 0;
            } 
        }

        io.emit('update_move', foundPlayer);
        if(foundPlayer.coin = true){
            foundPlayer.points = 10;
            io.emit('update_coin', foundPlayer);
        };
    })

});
