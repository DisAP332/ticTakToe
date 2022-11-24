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

const start = (() => {
    modal.style.display = 'none'
    turn = 0;
    const data = {

    }
    game(data);
})

const takBox = document.querySelectorAll('.takBox')



const game = ((data) =>{
    data.turn = '0';
    data.player1 = 'X';
    data.player2 = 'O';
    data.box = [1,2,3,4,5,6,7,8,9];
    data.winValues = [1,5,9] && [1,2,3];
    console.log(data)
})