import {monster, startTime} from '../mainActions.js';

export default class Player {
    
    constructor(img, ctx, canvas, initialX, initialY, speed, width = 80, height = 80) {
        this.pic = new Image();
        this.pic.src = img;
        this.initialX = initialX;
        this.initialY = initialY;
        this.ctx = ctx;
        this.canvas = canvas;
        this.leftMark = 5;
        this.upMark = 23;
        this.rightMark = 30;
        this.downMark = 45;
        this.useKeys = [];
        this.speed = 10;
        this.width = width;
        this.height = height;
        this.pic.onload = () => { this.initialDraw(ctx); }
        this.interval = null;
        this.fps = 60;
        
    }
    
    initialDraw() {
        this.ctx.drawImage(this.pic, this.initialX - this.width/2, this.initialY - this.height/2, this.width, this.height);
    }
    
    moveLeft() {
        let self = this;
        this.interval =  setInterval(function(){
            self.clearPlayer();
            self.initialX -= self.speed;
            self.ctx.drawImage(self.pic, self.initialX - self.width/2, self.initialY - self.height/2, self.width, self.height);
            if ((self.initialX + self.width/2) < 0) {
                self.initialX = self.canvas.width + self.width;
                self.clearPlayer();
            }
        }, 1000/this.fps);
    }
       
    moveTop() {
        let self = this;
        this.interval =  setInterval(function(){
            self.clearPlayer();
            self.initialY -= self.speed;
            self.ctx.drawImage(self.pic, self.initialX - self.width/2, self.initialY - self.height/2, self.width, self.height);
            if ((self.initialY + self.height/2) < 0) {
                self.initialY = self.canvas.height + self.height;
                self.clearPlayer();
            }
        }, 1000/this.fps);
    }
       
    moveRight() {
        let self = this;
        this.interval =  setInterval(function(){
            self.clearPlayer();
            self.initialX += self.speed;
            self.ctx.drawImage(self.pic, self.initialX - self.width/2, self.initialY - self.height/2, self.width, self.height);
            if ((self.initialX - self.width/2) > (self.canvas.width)) {
                self.initialX = 0;
                self.clearPlayer();
            }
        }, 1000/this.fps);
    }
       
     moveDown() {
         let self = this;
         this.interval =  setInterval(function(){
            self.clearPlayer();
            self.initialY += self.speed;
            self.ctx.drawImage(self.pic, self.initialX - self.width/2, self.initialY - self.height/2, self.width, self.height);
            if ((self.initialY - self.height) > (self.canvas.height)) {
                self.initialY = 0 - self.height/2;
                self.clearPlayer();
            }
        }, 1000/this.fps);
    }
      
    moveLeftUp() {
        let self = this;
        this.interval =  setInterval(function(){
            self.clearPlayer();
            self.initialX -= self.speed;
            self.initialY -= self.speed;
            self.ctx.drawImage(self.pic, self.initialX - self.width/2, self.initialY - self.height/2, self.width, self.height);
            if ((self.initialX + self.width/2) < 0 || (self.initialY + self.height/2) < 0) {
                self.initialX = self.canvas.width + self.width;
                self.initialY = self.canvas.height + self.height;
                self.clearPlayer();
            }
        }, 1000/this.fps);
    }
       
    moveLeftDown() {
        let self = this;
        this.interval =  setInterval(function(){
            self.clearPlayer();
            self.initialX -= self.speed;
            self.initialY += self.speed;
            self.ctx.drawImage(self.pic, self.initialX - self.width/2, self.initialY - self.height/2, self.width, self.height);
            if ((self.initialX + self.width/2) < 0 || (self.initialY - self.height) > (this.canvas.height)) {
                self.initialX = self.canvas.width + self.width;
                self.initialY = 0 - self.height/2;
                self.clearPlayer();
            }
        }, 1000/this.fps);
    }
       
    moveRightUp() {
        let self = this;
        this.interval =  setInterval(function(){
            self.clearPlayer();
            self.initialX += self.speed;
            self.initialY -= self.speed;
            self.ctx.drawImage(self.pic, self.initialX - self.width/2, self.initialY - self.height/2, self.width, self.height);
            if ((self.initialX - self.width/2) > (self.canvas.width) || (self.initialY + self.height/2) < 0) {
                self.initialX = 0;
                self.initialY = self.canvas.height + self.height;
                self.clearPlayer();
            }
        }, 1000/this.fps);
    }
       
    moveRightDown() {
        let self = this;
        this.interval =  setInterval(function(){
            self.clearPlayer();
            self.initialX += self.speed;
            self.initialY += self.speed;
            self.ctx.drawImage(self.pic, self.initialX - self.width/2, self.initialY - self.height/2, self.width, self.height);
            if ((self.initialX - self.width) > (self.canvas.width + self.width/2) || (self.initialY - self.height) > (self.canvas.height)) {
                self.initialX = 0;
                self.initialY = 0 - self.height/2;
                self.clearPlayer();
            }
        }, 1000/this.fps);
    }
    
    checkCollision(particles, isTranslated) {
        let line = Math.sqrt(Math.pow((this.initialX - monster.canvas.width/2), 2) + Math.pow((this.initialY - monster.canvas.height/2), 2)),
            monsterHornsSize = 56,
            width = isTranslated ? this.canvas.width/2 : 0,
            height = isTranslated ? this.canvas.height/2 : 0;
        if (line <= this.width + monster.radius - monsterHornsSize) {
            location.replace('lost.html');
        }
        if (particles) {
            for (let i = 0; i < particles.length; i++) {
                let bumpLine = Math.sqrt(Math.pow((this.initialX - particles[i].x - width), 2) + Math.pow((this.initialY - particles[i].y - height), 2)),
                    buff = isTranslated ? particles[i+1] || particles[0] : particles[i];
                
                if (bumpLine <= this.width/2 + buff.radius) {
                    let nickName = localStorage.getItem('currentPlayer'),
                        deathTime = Date.now() - startTime;
                    if (deathTime > localStorage.getItem(nickName)) {
                        localStorage.setItem(nickName, deathTime);
                    }
                    location.replace('lost.html');
                }
            }    
        }
    }
    
    clearPlayer() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    stopAnimation() {
        clearInterval(this.interval);
        this.interval = null;
    }
}