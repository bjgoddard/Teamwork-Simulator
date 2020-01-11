console.log("CANVAS.JS")



document.addEventListener("DOMContentLoaded", function() {
    
    let canvas = document.getElementById('whiteboard')
    let context = canvas.getContext('2d')
    let socket = io.connect()
    let rect = canvas.getBoundingClientRect()
    let currentMember = ""
    let selectedMemberList = document.getElementById("memberList")
    let selectedMemberIcon = ""
    //Put icon onto screen at mouse ?
    var elem = document.querySelectorAll('select');
    var instance = M.FormSelect.init(elem);

    const selectedMemberChanged = () => {
        selectedMemberIcon = document.getElementById("memberList").value;
    }
    selectedMemberList.addEventListener("change", selectedMemberChanged, false)
    
    //Creating color functionality
    let colors = document.getElementsByClassName('color')
    let current = { color: 'black' };

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
        
        context.beginPath();
        context.strokeStyle = line[2]
        context.lineWidth = 2;
        context.moveTo(line[0].x, line[0].y);
        context.lineTo(line[1].x, line[1].y);
        context.stroke();
    })

    socket.on('member_icon', data => {
        var icon = data.icon;
        console.log(icon)
        context.font = '30px serif'
        context.strokeText(icon[1], icon[0].x, icon[0].y)

    })
    var iconLoop = () => {
        if (mouse.click && selectedMemberIcon) {
            socket.emit('member_icon', { icon: [ mouse.pos, selectedMemberIcon ] })
            selectedMemberIcon = ""
        }
        setTimeout(iconLoop, 100)
    }
    iconLoop();
    
    var mainLoop = () => {
        if (mouse.click && mouse.move && mouse.pos_prev) {
            socket.emit('draw_line', { line: [ mouse.pos, mouse.pos_prev, current.color ] })
            mouse.move = false;
        }
        mouse.pos_prev = { x: mouse.pos.x, y: mouse.pos.y};
        setTimeout(mainLoop, 40);
    }
    mainLoop();
    })