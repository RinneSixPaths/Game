import Player from './classes/player.js';
import Monster from './classes/monster.js';
import ConfigController from './classes/configController.js';
import $ from './jquery-3.1.1.min.js';

const AUDIO_URL = 'https://api.soundcloud.com/tracks/216640012/stream?client_id=8df0d68fcc1920c92fc389b89e7ce20f',
      CLIENT_ID = "8df0d68fcc1920c92fc389b89e7ce20f",
      PLAYER_ICON = './img/player1.png',
      MONSTER_ICON = './img/demon.png',
      BPM = 87.5,
      WALL_INDX = 4,
      RESERVE_INDX = 3,
      VICTORY_TIME = 450000,
      typesOfFlight = [{type: 'CIRCLE-FLIGHT', min: 5, max: 20},
                      {type: 'SINGLE_FLIGHT', min: 1, max: 1},
                      {type: 'TRIPLE_FLIGHT', min: 18, max: 18},
                      {type: 'RANDOM_FLIGHT', min: 5, max: 7},
                      {type: 'WALL_FLIGHT', min: 10, max: 15}];

export let readKeys = 0,
    player,
    ctx,
    canvas,
    monster,
    monsterCanvas,
    monsterCtx,
    partCanvas,
    partCtx,
    translatedCanvas,
    translatedCtx,
    vawes,
    configIndx,
    indxTemp = 0,
    startTime,
    checkTime,
    configController;

$(document).ready(() => {
    getCanvases();
    resizeCanvas(canvas);
    resizeCanvas(monsterCanvas);
    player = new Player(PLAYER_ICON, ctx, canvas, 100, canvas.height/2, 20);
    monster = new Monster(MONSTER_ICON, AUDIO_URL, CLIENT_ID, monsterCtx, monsterCanvas, player);
    configController = new ConfigController(partCanvas, partCtx, translatedCanvas, translatedCtx, player);
    startTime = Date.now();
    
    vawes = setInterval(function() {
        configIndx = Math.floor(getRandom(0, typesOfFlight.length));
        if (indxTemp == WALL_INDX) {
            configIndx = configIndx != indxTemp ? configIndx : RESERVE_INDX;
        }
        indxTemp = configIndx;
        configController.render(typesOfFlight[configIndx]);
    }, BPM*15);
    
    checkTime = setInterval(function() {
        if (Date.now() - startTime >= VICTORY_TIME) {
            let nickName = localStorage.getItem('currentPlayer');
            localStorage.setItem(nickName, VICTORY_TIME);
            location.replace('win.html');
        }
    }, 1000);
    
});

function resizeCanvas(cnvs) {
    cnvs.width  = window.innerWidth;
    cnvs.height = window.innerHeight;
}

function getCanvases(cnvs, context, id) {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    monsterCanvas = document.getElementById("monster-canvas");
	monsterCtx = monsterCanvas.getContext("2d");
}

export default function getRandom(min, max){
  return Math.random() * (max - min) + min;
}

$(window).resize(() => {
    location.reload();
});

$(document).keydown((e) => {
    switch(e.keyCode) {
        case 65: {
            if (player.useKeys.indexOf(player.leftMark) < 0 && readKeys != player.leftMark) {
                readKeys += player.leftMark;
                player.useKeys.push(player.leftMark);
            }
            break;
        }
        case 87: {
            if (player.useKeys.indexOf(player.upMark) < 0 && readKeys!= player.upMark) {
                readKeys += player.upMark;
                player.useKeys.push(player.upMark);
            }
            break;
        }
        case 68: {
            if (player.useKeys.indexOf(player.rightMark) < 0 && readKeys!=player.rightMark) {
                readKeys += player.rightMark;
                player.useKeys.push(player.rightMark);
            }
            break;
        }
        case 83: {
            if (player.useKeys.indexOf(player.downMark) < 0 && readKeys!=player.downMark) {
                readKeys += player.downMark;
                player.useKeys.push(player.downMark);
            }
            break;
        }
    }

    switch(readKeys) {
        case player.leftMark: {
            if (!player.interval) player.moveLeft();
            break;
        }
        case player.upMark: {
            if (!player.interval) player.moveTop();
            break;
        }
        case player.rightMark: {
            if (!player.interval) player.moveRight();
            break;
        }
        case player.downMark: {
            if (!player.interval) player.moveDown();
            break;
        }
        case (player.leftMark + player.upMark): {
            player.stopAnimation();
            player.moveLeftUp();
            break;
        }
        case (player.leftMark + player.downMark): {
            player.stopAnimation();
            player.moveLeftDown();
            break;
        }
        case (player.rightMark + player.downMark): {
            player.stopAnimation();
            player.moveRightDown();
            break;
        }
        case (player.rightMark + player.upMark): {
            player.stopAnimation();
            player.moveRightUp();
            break;
        }
    }
});

$(document).keyup((e) => {
    switch(e.keyCode) {
        case 65: {
            if (readKeys >= player.leftMark) {
                readKeys -= player.leftMark;
                player.useKeys.splice(player.useKeys.indexOf(player.leftMark),1);
            }
            player.stopAnimation();
            $(document).keydown();
            break;
        }
        case 87: { 
            readKeys -= player.upMark;
            player.useKeys.splice(player.useKeys.indexOf(player.upMark),1);
            player.stopAnimation();
            $(document).keydown();
            break;
        }
        case 68: {
            if (readKeys >= player.rightMark) {
                readKeys -= player.rightMark;
                player.useKeys.splice(player.useKeys.indexOf(player.rightMark),1);
            }
            player.stopAnimation();
            $(document).keydown();
            break;
        }
        case 83: {
            readKeys -= player.downMark;
            player.useKeys.splice(player.useKeys.indexOf(player.downMark),1);
            player.stopAnimation();
            $(document).keydown();
            break;
        }
    } 
});