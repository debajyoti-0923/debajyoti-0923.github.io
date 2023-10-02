let playerText = document.getElementById('playerText')
let restartBtn = document.getElementById('restartBtn')
let compbtn=document.getElementById('comp')
let boxes = Array.from(document.getElementsByClassName('box2'))
let tiles = Array.from(document.getElementsByClassName('gameboarddiv'))
let player = document.getElementById('turn')

let winnerIndicator = getComputedStyle(document.body).getPropertyValue('--winning-blocks')
let bgcolor=getComputedStyle(document.body).getPropertyValue('--bg')
let playcolor=getComputedStyle(document.body).getPropertyValue('--playable-tile')
let playfont=getComputedStyle(document.body).getPropertyValue('--black')
let bgfont=getComputedStyle(document.body).getPropertyValue('--yellow')


const O_TEXT = "O"
const X_TEXT = "X"
let currentPlayer = X_TEXT
let spaces = Array(9).fill(null).map(() => Array(9).fill(null));
let playable_tile=-1
let mode=0

const startGame = () => {
    boxes.forEach(box => box.addEventListener('click', boxClicked))
}
function getRandomInt() {
    let x= Math.floor(Math.random() * 10)
    console.log("random "+x)
    if(x>8)
        return getRandomInt()
    else return x
}

function boxClicked(e) {
    const id = e.target.id
    
    let x=id[1]
    let y=id[2]

    play(x,y)
}
function toggleplay(x,y){
    if (spaces[y]=='X'|| spaces[y]=='O')
        playable_tile=-1
    else
        playable_tile=y
    console.log("play "+playable_tile)
    tiles.forEach( tile => {
        if (playable_tile!=-1 && tile.id!='tile'+playable_tile){
            tile.style.backgroundColor=bgcolor
            tile.style.color=bgfont
        }else{
            tile.style.backgroundColor=playcolor
            tile.style.color=playfont
        }
    })
}
function playcomp(y){
    let cy=getRandomInt()
    console.log(cy)
    if(spaces[y][cy]!=null)
        return playcomp(y)
    else
        play(y,cy)
}
function play(x,y){
    console.log(x,y)
    if(playable_tile!=-1 && playable_tile!=x)
        return

    if(spaces[x][y]==null){
        spaces[x][y]=currentPlayer
        document.getElementById('b'+x+y).innerText=currentPlayer

        if(wonTile(x)!==false){
            let tile=document.getElementById("tile"+x)
            tile.style.display='none'
            if(currentPlayer=='X'){
                let box=document.getElementById("x"+x)
                box.style.display='flex'
            }else{
                let box=document.getElementById("o"+x)
                box.style.display='flex'
            }
            console.log(x==playable_tile)
            if(x==playable_tile)
                playable_tile=-1
            spaces[x]=currentPlayer
            if(wonGame()!==false){
                playerText.innerHTML = `${currentPlayer} has won!`
                let winning_blocks=wonGame()
                winning_blocks.map( box => document.getElementById(box).style.backgroundColor=winnerIndicator)
                return
            }
        }

        currentPlayer = currentPlayer == X_TEXT ? O_TEXT : X_TEXT
        player.innerText='player '+currentPlayer
        toggleplay(x,y)
        if(!mode){
            if(currentPlayer=='O'){   
                playcomp(y)
            }
        }
    }
}
const winningCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

function wonTile(x) {
    for (const condition of winningCombos) {
        let [a, b, c] = condition

        if(spaces[x][a] && (spaces[x][a] == spaces[x][b] && spaces[x][a] == spaces[x][c])) {
            return true
        }
    }
    return false
}
function wonGame() {
    for (const condition of winningCombos) {
        let [a, b, c] = condition

        if(spaces[a] && (spaces[a] == spaces[b] && spaces[a] == spaces[c])) {
            playable_tile=-2
            return [a,b,c]
        }
    }
    return false
}

restartBtn.addEventListener('click', restart)

function restart() {
    playable_tile=-1
    spaces = Array(9).fill(null).map(() => Array(9).fill(null));
    player.innerText='player x'
    boxes.forEach( box => {
        box.innerText = ''
    })
    for(let i=0;i<9;i++){
        let box=document.getElementById(i)
        box.style.backgroundColor=''
        let tile=document.getElementById('tile'+i)
        tile.style.display='flex'
        tile.style.backgroundColor=playcolor
        tile.style.color=playfont
        let x=document.getElementById('x'+i)
        x.style.display='none'
        let o=document.getElementById('o'+i)
        o.style.display='none'
    }

    playerText.innerHTML = 'Super Tic Tac Toe'

    currentPlayer = X_TEXT
}

compbtn.addEventListener('click',togglemode)

function togglemode(){
    mode=mode^1
    console.log(mode)
    if(mode)
        compbtn.innerText='Two Player'
    else
        compbtn.innerText='Computer'
    restart()
}
startGame()