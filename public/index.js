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

    function displayPacman(x, y) {
        $('#pacman').css({ 'top': y * 23 + 'px' });
        $('#pacman').css({ 'left': x * 20 + 'px' });
    }


    function eatCoin() {
        $('div.row:nth-of-type(' + (pacman.y + 1) + ') div:nth-of-type(' + (pacman.x + 1) + ')').addClass('empty').removeClass('coin');
    }

    while (!name) {
        name = prompt("Please enter your name");
    }

    //on page load, create new user and set user location on game
    socket.emit('new_user', { name: name });
    socket.on('start_player', function (data) {
        displayPacman(data.x, data.y);
    })


    $('button').click(function () {
        socket.emit('start_game', { name: name });

        socket.on('start_map', function (data) {
            $('#stage').html(displayWorld(data.map));
        })
    });

    //pacman directional movement on direction key press
    $(document).keydown(function (e) {
        if (e.keyCode == 38) {
            let data = { direction: 'up', name: name };
            socket.emit('move', data);

            socket.on('update_move', function(data){
                displayPacman(data.x, data.y);
            })
            // pacman.y--;

            // if (world[pacman.y][pacman.x] == 2) {
            //     pacman.y++;
            //     return;
            // } else {
            //     movePacman();
            // }
        } else if (e.keyCode == 39) {
            pacman.x++;

            if (world[pacman.y][pacman.x] == 2) {
                pacman.x--;
                return;
            } else {
                movePacman();
            }
        } else if (e.which == 40) {
            pacman.y++;

            if (world[pacman.y][pacman.x] == 2) {
                pacman.y--;
                return;
            } else {
                movePacman();
            }
        } else if (e.which == 37) {
            pacman.x--;

            if (world[pacman.y][pacman.x] == 2) {
                pacman.x++;
                return;
            } else {
                movePacman();
            }
        }
    })
});