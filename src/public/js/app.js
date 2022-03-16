const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');
const room = document.getElementById('room');

room.hidden = true;

let roomName;

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector('h3');
    h3.innerText = `Room ${roomName}`;
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
