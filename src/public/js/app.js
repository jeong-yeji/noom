const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');
const room = document.getElementById('room');

room.hidden = true;

let roomName;

function addMessage(message) {
    const ul = room.querySelector('ul');
    const li = document.createElement('li');
    li.innerText = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector('#msg input');
    const value = input.value;
    socket.emit('new_message', input.value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = '';
}

function handleNicknameSubmit(event) {
    event.preventDefault();
    const input = room.querySelector('#name input');
    socket.emit('nickname', input.value);
}

function refreshTitle(newCount) {
    const h3 = room.querySelector('h3');
    h3.innerText = `Room ${roomName} (${newCount})`;
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector('h3');
    h3.innerText = `Room ${roomName}`;
    const msgForm = room.querySelector('#msg');
    const nameForm = room.querySelector('#name');
    msgForm.addEventListener('submit', handleMessageSubmit);
    nameForm.addEventListener('submit', handleNicknameSubmit);
}

function handleRoomSubmit(event) {
    event.preventDefault();

    // const input = form.querySelector('input');
    const room_name = form.querySelector('#roomName');
    const name = form.querySelector('#name');

    // arg1 : event name - it can be anything. we can send any event that we make. => can custom event name
    // argsN : payload - we can send ANYTHING(json, string, boolean, number...). do not need to change object to string. we can send AS MANY AS we want.
    // last args : func that we can call from SERVER - call at BE, but func is on FE
    socket.emit('enter_room', room_name.value, name.value, showRoom); // := socket.send()
    roomName = room_name.value;
    room_name.value = '';

    room.querySelector('#name input').value = name.value;
}
form.addEventListener('submit', handleRoomSubmit);

socket.on('welcome', (user, newCount) => {
    refreshTitle(newCount);
    addMessage(`${user} joined!`);
});

socket.on('bye', (left, newCount) => {
    refreshTitle(newCount);
    addMessage(`${left} left!`);
});

socket.on('new_message', addMessage);

socket.on('room_change', (rooms) => {
    const roomList = welcome.querySelector('ul');
    roomList.innerHTML = '';
    if (rooms.length === 0) {
        return;
    }
    rooms.forEach((room) => {
        const li = document.createElement('li');
        li.innerText = room;
        roomList.append(li);
    });
});
