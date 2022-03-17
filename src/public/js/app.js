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
    const input = form.querySelector('input');
    // arg1 : event name - it can be anything. we can send any event that we make. => can custom event name
    // argsN : payload - we can send ANYTHING(json, string, boolean, number...). do not need to change object to string. we can send AS MANY AS we want.
    // last args : func that we can call from SERVER - call at BE, but func is on FE
    socket.emit('enter_room', input.value, showRoom); // := socket.send()
    roomName = input.value;
    input.value = '';
}
form.addEventListener('submit', handleRoomSubmit);

socket.on('welcome', (user) => {
    addMessage(`${user} joined!`);
});

socket.on('bye', (left) => {
    addMessage(`${left} left!`);
});

socket.on('new_message', addMessage);
