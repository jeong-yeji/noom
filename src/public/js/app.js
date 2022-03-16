const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');

function backendDone(msg) {
    console.log(`The backend says: `, msg);
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector('input');
    // arg1 : event name - it can be anything. we can send any event that we make. => can custom event name
    // argsN : payload - we can send ANYTHING(json, string, boolean, number...). do not need to change object to string. we can send AS MANY AS we want.
    // last args : func that we can call from SERVER - call at BE, but func is on FE
    socket.emit('enter_room', input.value, backendDone); // := socket.send()
    input.value = '';
}
form.addEventListener('submit', handleRoomSubmit);
