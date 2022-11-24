let playStyle = null;
let turn = null;
var modal = document.getElementById('myModal');
const alone = document.getElementById('alone');
const notAlone = document.getElementById('notAlone');


alone.addEventListener('click', () => {
    playStyle = 1;
    start()
})
notAlone.addEventListener('click', () => {
    playStyle = 0;
    start()
})

function start() {
    modal.style.display = 'none'
    turn = 0;
}

const takBox = document.querySelectorAll('.takBox')

