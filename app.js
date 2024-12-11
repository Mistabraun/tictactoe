document.addEventListener("DOMContentLoaded", (event) => {
    const tiles = document.querySelectorAll(".tile")
    const turn_dialog = document.querySelector(".turn-dialog")
    const start_button = document.querySelector("#start-button")

    let started = false
    let animating = false
    
    let turn = 2 //  1 : "X", 2 : "O",

    let occupied_grids = 0
    let grid = [
        [-1, -1, -1],
        [-1, -1, -1],
        [-1, -1, -1]
    ]

    function reset_grid() {
        grid.forEach(element => {
            element.fill(-1)
        });
    }

    function get_grid_position(number) {
        const pointer = number - 1
        const row = Math.floor(pointer / 3)
        const column = pointer % 3

        return [row, column]
    }

    function is_full() {
        console.log(occupied_grids)
        return occupied_grids >= 9
    }
    
    function is_position_empty(value) {
        return value == -1
    }

    function is_grid_occupied(number) {
        var [row, column] = get_grid_position(number)
        return !is_position_empty(grid[row][column])
    }

    function occupy_grid_position(number, value) {
        if (number < 1 | number > 9) {
            return false
        }
        if (is_grid_occupied(number)) {
            return false
        }
        var [row, column] = get_grid_position(number)
        grid[row][column] = value
        occupied_grids++
        return true
    
    }

    function determine_winner() { 

        function horizontally() { 
            for (let index = 0; index < 3; index++) {
                const row = grid[index]
                first = row[0]
                if (is_position_empty(first)) { 
                    continue
                }
                if (row[1] == first & row[2] == first) { 
                    return first
                }
            }
        }

    function vertically() { 
        for (let index = 0; index < 3; index++) {
            const first = grid[0][index];
            if (is_position_empty(first)) { 
                continue
            }
            console.log("grids: ", first, grid[1][index], grid[2][index], ", index: ", index, "result", grid[1][index] == first & grid[2][index] == first)
            if (grid[1][index] == first & grid[2][index] == first) { 
                return first
            }   
        }
    }

    function  diagonally() { 
        const first = grid[0][0]
        if (is_position_empty(first)) { 
            return
        }
        if (grid[1][1] == first & grid[2][2] == first) { 
            return first
        }

        const last = grid[0][2]
        if (is_position_empty(last)) { 
            return
        }
        if (grid[1][1] == last & grid[2][0] == last) { 
            return last
        }
        
        }
        // console.log(grid)
        console.log(diagonally(), horizontally(), vertically())
        return diagonally() | horizontally() | vertically()

    }

    function show_animated(elements, visible, duration) {
        const dt = (duration / elements.length)
        elements.forEach((element, index) => {
            const timeout = dt * index;
            
            setTimeout(() => {
                element.style.fontSize = "1em"
                element.innerHTML = visible ? (index + 1) : ""
            }, timeout);
        });
    }

    function get_symbol(number) {
        return number == 2 ? "O" : "X"
    }

    function flip_turn() {
        turn = turn == 2 ? 1 : 2
        turn_dialog.innerHTML = `It's currently ${get_symbol(turn)} turn.`
    }

     function on_determining_winner(symbol) { 
        if (occupied_grids <= 3) { 
            return
        }
       
         const winner = determine_winner()
         const draw = is_full()

         console.log("result : ", winner, draw)
        
         if (!(winner || draw)) { 
             return
         }

         started = false

         if (winner) {
             console.log("Winner", symbol)
             announce_winner(symbol)
         } else { 
             console.log("announce draw")
             announce_draw()
         }
         
         setTimeout(() => {
                end_game()
            }, 3000);
        
    }
    
    function on_tile_added(element) {
        element.addEventListener("click", function () {
            if (!started) { return }
            if (!occupy_grid_position(this.getAttribute("position"), turn)) { return }
            const symbol = get_symbol(turn)
            this.style.fontSize = "3em"
            this.innerHTML = symbol
            flip_turn()
            on_determining_winner(symbol)
        })
    }

    function announce_winner(winner) { 
        turn_dialog.innerHTML = `${winner} won the game.`
    }

    function announce_draw() { 
        turn_dialog.innerHTML = "Game ended with a draw."
    }

    function end_game() { 
        turn_dialog.style.display = "none"
        start_button.style.display = "block"
        turn = 2
        occupied_grids = 0
        show_animated(tiles, true, 1000)
    }

    function on_started() {
        flip_turn()
        reset_grid()
    }

    function on_starting() { 
        turn_dialog.style.display = "block"
        turn_dialog.innerHTML = "Preparing game."
        start_button.style.display = "none"
        show_animated(tiles, false, 1000)
    }

    function on_start_event() { 
        if (started | animating) { return }
        animating = true
        on_starting()

        setTimeout(() => {
            animating = false
            started = true
            on_started()
        }, 1000);
        
    }

    start_button.addEventListener("click", on_start_event)
    tiles.forEach(on_tile_added);
    end_game()
})
