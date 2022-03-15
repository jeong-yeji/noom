const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector('input');
    // arg1 : event name - it can be anything. we can send any event that we make. => can custom event name
    // args2 : payload - we can send js object. do not need to change object to string.
    // args3 : func that we can call from SERVER - call at BE, but func is on FE
    socket.emit('enter_room', { payload: input.value }, () => {
        console.log('server is done!');
    }); // := socket.send()
    input.value = '';
}
form.addEventListener('submit', handleRoomSubmit);
