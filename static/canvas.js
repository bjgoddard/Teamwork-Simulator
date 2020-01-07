console.log("CANVAS.JS")



//TODO: Resize function?



document.addEventListener("DOMContentLoaded", function() {
    
    let canvas = document.getElementById('whiteboard')
    let context = canvas.getContext('2d')
    // let width = window.innerWidth;
    // let height = window.innerHeight;
    let socket = io.connect()
    let rect = canvas.getBoundingClientRect()
    

    //Creating color functionality
    let colors = document.getElementsByClassName('color')


    let current = {
        color: 'black'
    };
    const onColorUpdate = (e) => {
        current.color = e.target.className.split(' ')[1]
    }
    for (var i = 0; i < colors.length; i++) {
        colors[i].addEventListener('click', onColorUpdate, false)
    }

    let mouse = {
        click: false,
        move: false,
        pos: { x:0, y:0},
        pos_prev: false
    }
    
    canvas.width = 1000;
    canvas.height = 500;
    //Clear function
    var clearButton = document.getElementById('clear')
    clearButton.addEventListener('click', () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }, false)

    canvas.onmousedown = (e) => {
        mouse.click = true;
    };

    canvas.onmouseup = (e) => {
        mouse.click = false;
    };

    canvas.onmousemove = (e) => {
        mouse.pos.x = e.clientX - rect.left;
        mouse.pos.y = e.clientY - rect.top;
        mouse.move = true;
        
    }

    socket.on('draw_line', data => {
        var line = data.line;
        
        // console.log(current.color)
        context.beginPath();
        console.log(data.line)
        // context.strokeStyle = current.color;
        context.strokeStyle = line[2]
        context.lineWidth = 2;
        context.moveTo(line[0].x, line[0].y);
        context.lineTo(line[1].x, line[1].y);
        context.stroke();
    })
    
    var mainLoop = () => {
        if (mouse.click && mouse.move && mouse.pos_prev) {
            socket.emit('draw_line', { line: [ mouse.pos, mouse.pos_prev, current.color ] })
            mouse.move = false;
        }
        mouse.pos_prev = { x: mouse.pos.x, y: mouse.pos.y};
        setTimeout(mainLoop, 25);
    }

    mainLoop();
    })