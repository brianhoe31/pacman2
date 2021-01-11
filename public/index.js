//store name in it's own respective DOM
let name;

//translate the world from the array data input to a HTML output
function displayWorld(world) {
    var output = '';
    for (var i = 0; i < world.length; i++) {
        output += "<div class='row'>";
        for (var j = 0; j < world[i].length; j++) {
            if (world[i][j] == 2) {
                output += "<div class='brick'></div>";
            } else if (world[i][j] == 1) {
                output += "<div class='coin'></div>";
            } else if (world[i][j] == 0) {
                output += "<div class='empty'></div>";
            }
        }
        output += "</div>";
    }
    return output;
}

$(document).ready(function () {
    var socket = io();

    while (!name) {
        name = prompt("Please enter your name");
    }

    function displayPacman(x, y, name) {
        console.log(name);
        $('#' + name).css({ 'top': y * 23 + 'px' });
        $('#' + name).css({ 'left': x * 20 + 'px' });
    }

    //create a new pacman div with class .pacman
    //set pacman to it's current location 
    function createPacman(name) {
        $('#container').append("<div class='pacman' id='" + name + "'></div>");
    }

    //takes the coordinates of player's x/y coordinate and if there is a coin, eats it 
    function eatCoin(x, y) {
        $('div.row:nth-of-type(' + (y + 1) + ') div:nth-of-type(' + (x + 1) + ')').addClass('empty').removeClass('coin');
    }

    function update_move(){
        socket.on('update_move', function (data) {
            console.log(data);
            displayPacman(data.x, data.y, data.name);
        })
        socket.on('update_coin', function (data) {
            eatCoin(data.x, data.y);
        })
    }

    //on page load, create new user and set user location on game
    socket.emit('new_user', { name: name });
    socket.on('start_player', function (data) {
        createPacman(data.name);
        displayPacman(data.x, data.y, data.name);

        socket.emit('check_player');
        socket.on('start_map', function (data) {
            //create opponents pacman on each other's screen
            socket.emit('update_opp', {name: name});
            socket.on('send_opp', function(data){
                createPacman(data.name);
                displayPacman(data.x, data.y, data.name);
            })

            $('#stage').html(displayWorld(data.map));
        })
    })

    //pacman directional movement on direction key press
    $(document).keydown(function (e) {
        if (e.keyCode == 38) {
            let data = { direction: 'up', name: name };
            socket.emit('move', data);
            update_move();
        } else if (e.keyCode == 39) {
            let data = { direction: 'right', name: name };
            socket.emit('move', data);
            update_move();
        } else if (e.keyCode == 40) {
            let data = { direction: 'down', name: name };
            socket.emit('move', data);
            update_move();
        } else if (e.keyCode == 37) {
            let data = { direction: 'left', name: name };
            socket.emit('move', data);
            update_move();
        }
    })
});