import Particle from './particle.js';
import getRandom from '../mainActions.js';

export default class ConfigController {
    
    constructor(canvas, partCtx, translatedCanvas, translatedCtx, target) {
        
        this.target = target;
        this.deleteParam = Math.sqrt(Math.pow(target.canvas.width/2, 2)+Math.pow(target.canvas.height/2, 2));
        this.repeatTime = 1000/this.target.fps;
        this.partCanvases = [document.getElementById('part-canvas-1'),
                            document.getElementById('part-canvas-2'),
                            document.getElementById('part-canvas-3'),
                            document.getElementById('part-canvas-4')];
        this.translateCanvases = [document.getElementById('translate-canvas-1'),
                                 document.getElementById('translate-canvas-2'),
                                 document.getElementById('translate-canvas-3'),
                                 document.getElementById('translate-canvas-4')];
        
    }
    
    render(config) {
        
        let particles = this.createParticles(getRandom(config.min, config.max));
        switch(config.type) {
            case 'CIRCLE-FLIGHT': {
                this.circleFlight(particles);
                break;
            }
            case 'SINGLE_FLIGHT': {
                this.singleFlight(particles);
                break;
            }
            case 'TRIPLE_FLIGHT': {
                this.tripleFlight(particles);
                break;
            }
            case 'RANDOM_FLIGHT': {
                this.randomFlight(particles);
                break;
            }
            case 'WALL_FLIGHT': {
                this.wallFlight(particles);
                break;
            }
        }
        
    }
    
    createParticles(amount) {
        
        let buff = [];
        for (let i = 0; i < amount; i++) {
            buff.push(new Particle(5, 50));
        }
        return buff;
        
    }
    
    circleFlight(particles) {
        
        let self = this,
            bump,
            speed = getRandom(5,8),
            radius = 0,
            rotateAngle = 2*Math.PI/particles.length,
            initialX = 0,
            initialY = 0,
            canvas,
            ctx;
        
        if (this.translateCanvases.length) {
            canvas = this.translateCanvases.pop();
            ctx = canvas.getContext('2d');
        } else {
            return;
        }
        
        this.resizeCanvas(canvas);
        ctx.translate(canvas.width/2, canvas.height/2);
        (function(ctx, canvas) {
            bump = setInterval(() => {
                self.clearTranslated(ctx, canvas);
                
                initialX = 0,
                initialY = radius;
                for (let i = 0; i < particles.length; i++) {
                    ctx.fillStyle = 'rgb('+particles[i].color+')';
                    ctx.beginPath();
                    ctx.arc(0, radius, particles[i].radius, 0, 2*Math.PI, false);

                    particles[i].x = initialX*Math.cos(rotateAngle) - initialY*Math.sin(rotateAngle);
                    particles[i].y = initialX*Math.sin(rotateAngle) + initialY*Math.cos(rotateAngle);

                    initialX = particles[i].x;
                    initialY = particles[i].y;

                    ctx.rotate(2*Math.PI/particles.length);
                    ctx.fill();
                }
                self.target.checkCollision(particles, true);
                radius += speed;
                if (radius > self.deleteParam + 50) {
                    clearInterval(bump);
                    self.clearTranslated(ctx, canvas);
                    particles.splice(0, particles.length);
                    self.translateCanvases.push(canvas);
                }

           }, self.repeatTime);
        })(ctx, canvas);
    }
    
    singleFlight(particles) {
        
        let self = this,
            bump,
            speedTime = 45,
            radius = 0,
            rotateAngle = 0,
            initialX = 0,
            initialY = 0,
            canvas,
            ctx,
            playerCoordX = this.target.initialX,
            playerCoordY = this.target.initialY,
            speedX = 0,
            speedY = 0,
            checkX = 0,
            checkY = 0;
        
        if (this.partCanvases.length) {
            canvas = this.partCanvases.pop();
            ctx = canvas.getContext('2d');
        } else {
            return;
        }
        
        this.resizeCanvas(canvas);
        for (let i = 0; i < particles.length; i++) {
            particles[i].x = canvas.width/2;
            particles[i].y = canvas.height/2;
        }
        
        speedX = (particles[0].x - playerCoordX)/speedTime;
        speedY = (particles[0].y - playerCoordY)/speedTime;
        
        (function(ctx, canvas) {
            bump = setInterval(() => {
                self.clearCanvas(ctx, canvas);

                for (let i = 0; i < particles.length; i++) {
                   
                    ctx.fillStyle = 'rgb('+particles[i].color+')';
                    ctx.beginPath();
                    ctx.arc(particles[i].x, particles[i].y, particles[i].radius, 0, 2*Math.PI, false);
                   
                    particles[i].x -= speedX;
                    particles[i].y -= speedY;
                    checkX += speedX;
                    checkY += speedY;
                   
                    ctx.fill();
                }
                self.target.checkCollision(particles, false);
                if (checkX > canvas.width || checkY > canvas.height) {
                    clearInterval(bump);
                    self.clearCanvas(ctx, canvas);
                    particles.splice(0, particles.length);
                    self.partCanvases.push(canvas);
                }

           }, self.repeatTime);
        })(ctx, canvas);
    }
    
    tripleFlight(particles) {
        
        let self = this,
            bump,
            radius = 20,
            radius2 = 0,
            radius3 = 0,
            initialX1 = 0,
            initialX2 = 0,
            initialX3 = 0,
            initialY1 = 0,
            initialY2 = 0,
            initialY3 = 0,
            rotateAngle = 2*Math.PI/(particles.length/3), 
            canvas,
            ctx;
        
        if (this.translateCanvases.length) {
            canvas = this.translateCanvases.pop();
            ctx = canvas.getContext('2d');
        } else {
            return;
        }
        
        this.resizeCanvas(canvas);
        ctx.translate(canvas.width/2, canvas.height/2);
        (function(ctx, canvas) {
            bump = setInterval(() => {
                self.clearTranslated(ctx, canvas);
                
                initialX1 = 0;
                initialX2 = 0;
                initialX3 = 0;
                initialY1 = radius;
                initialY2 = radius2;
                initialY3 = radius3;
                for (let i = 0; i < 6; i++) {
                    ctx.fillStyle = 'rgb('+particles[i].color+')';
                    ctx.beginPath();
                    ctx.arc(0, radius, particles[i].radius, 0, 2*Math.PI, false);
                       
                    particles[i].x = initialX1*Math.cos(rotateAngle) - (initialY1)*Math.sin(rotateAngle);
                    particles[i].y = initialX1*Math.sin(rotateAngle) + (initialY1)*Math.cos(rotateAngle);
                       
                    initialX1 = particles[i].x;
                    initialY1 = particles[i].y;
                       
                    ctx.rotate(rotateAngle);
                    ctx.fill();

                }
                for (let i = 6; i < 12; i++) { 
                    ctx.fillStyle = 'rgb('+particles[i].color+')';
                    ctx.beginPath();
                    ctx.arc(0, radius2, particles[i].radius, 0, 2*Math.PI, false);
                       
                    particles[i].x = initialX2*Math.cos(rotateAngle) - (initialY2)*Math.sin(rotateAngle);
                    particles[i].y = initialX2*Math.sin(rotateAngle) + (initialY2)*Math.cos(rotateAngle);
                       
                    initialX2 = particles[i].x;
                    initialY2 = particles[i].y;
                       
                    ctx.rotate(rotateAngle);
                    ctx.fill();
                }
                
                for (let i = 12; i < 18; i++) { 
                    ctx.fillStyle = 'rgb('+particles[i].color+')';
                    ctx.beginPath();
                    ctx.arc(0, radius3, particles[i].radius, 0, 2*Math.PI, false);
                       
                    particles[i].x = initialX3*Math.cos(rotateAngle) - (initialY3)*Math.sin(rotateAngle);
                    particles[i].y = initialX3*Math.sin(rotateAngle) + (initialY3)*Math.cos(rotateAngle);
                       
                    initialX3 = particles[i].x;
                    initialY3 = particles[i].y;
                       
                    ctx.rotate(rotateAngle);
                    ctx.fill();
                }
                radius += 5;
                radius2 += 7;
                radius3 += 10;
                self.target.checkCollision(particles, true);
                if (radius > self.deleteParam + 50) {
                    clearInterval(bump);
                    self.clearTranslated(ctx, canvas);
                    particles.splice(0, particles.length);
                    self.translateCanvases.push(canvas);
                }

           }, self.repeatTime);
        })(ctx, canvas);
        
    }
    
    randomFlight(particles) {
        let self = this,
            bump,
            speedTime = 50,
            radius = 0,
            rotateAngle = 0,
            initialX = 0,
            initialY = 0,
            canvas,
            ctx,
            speedX = 0,
            speedY = 0,
            checkX = 0,
            checkY = 0;
        
        if (this.partCanvases.length) {
            canvas = this.partCanvases.pop();
            ctx = canvas.getContext('2d');
        } else {
            return;
        }
        this.resizeCanvas(canvas);
        for (let i = 0; i < particles.length; i++) {
            particles[i].x = canvas.width/2;
            particles[i].y = canvas.height/2;
            particles[i].randomCoordX = getRandom(0, canvas.width);
            particles[i].randomCoordY = getRandom(0, canvas.height);
            particles[i].speedX = (particles[i].x - particles[i].randomCoordX)/speedTime;
            particles[i].speedY = (particles[i].y - particles[i].randomCoordY)/speedTime;
        }
        
        (function(ctx, canvas) {
            bump = setInterval(() => {
                self.clearCanvas(ctx, canvas);

                for (let i = 0; i < particles.length; i++) {
                   
                    ctx.fillStyle = 'rgb('+particles[i].color+')';
                    ctx.beginPath();
                    ctx.arc(particles[i].x, particles[i].y, particles[i].radius, 0, 2*Math.PI, false);
                   
                    particles[i].x -= particles[i].speedX;
                    particles[i].y -= particles[i].speedY;
            
                    ctx.fill();
                }
                self.target.checkCollision(particles, false);
           }, self.repeatTime);
        })(ctx, canvas);
        setTimeout(() => {
            for (let i = 0; i < particles.length; i++) {
                particles[i].radius = 100;
                particles[i].color = '255,0,0';
            } 
            setTimeout (() => {
                clearInterval(bump);
                self.clearCanvas(ctx, canvas);
                particles.splice(0, particles.length);
                self.partCanvases.push(canvas);
            }, 500);
            
        }, 2500);
    }
    
    wallFlight(particles) {
        let self = this,
            bump,
            radius = 0,
            rotateAngle = 0,
            initialX = 0,
            initialY = 0,
            canvas,
            ctx,
            len,
            buffCoord = 0,
            speedX = 0,
            speedY = 0,
            checkX = 0,
            checkY = 0,
            minSpeed = 10, 
            minSpeedIndx = 0;
        
        if (this.partCanvases.length) {
            canvas = this.partCanvases.pop();
            ctx = canvas.getContext('2d');
        } else {
            return;
        }
        
        this.resizeCanvas(canvas);
        len = canvas.width/particles.length;
        for (let i = 0; i < particles.length; i++) {
                     
            particles[i].x = buffCoord + len;
            buffCoord = particles[i].x;
            particles[i].y = canvas.height + 100;
            particles[i].speed = getRandom(5, 7);
            if (minSpeed > particles[i].speed) {
                minSpeedIndx = i;
                minSpeed = particles[i].speed;
            }
        }
        
        (function(ctx, canvas) {
            bump = setInterval(() => {
                self.clearCanvas(ctx, canvas);

                for (let i = 0; i < particles.length; i++) {
                   
                    ctx.fillStyle = 'rgb('+particles[i].color+')';
                    ctx.beginPath();
                    ctx.arc(particles[i].x, particles[i].y, particles[i].radius, 0, 2*Math.PI, false);
                   
                    particles[i].y -= particles[i].speed;
                   
                    ctx.fill();
                }
                self.target.checkCollision(particles, false);
                if (particles[minSpeedIndx].y < -100) {
                    clearInterval(bump);
                    self.clearCanvas(ctx, canvas);
                    particles.splice(0, particles.length);
                    self.partCanvases.push(canvas);
                }

           }, self.repeatTime);
        })(ctx, canvas);
    }
    
    clearTranslated(ctx, canvas) {
        ctx.clearRect(-canvas.width, -canvas.height, canvas.width*2, canvas.height*2);
    }
    
    clearCanvas(ctx, canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    resizeCanvas(cnvs) {
        cnvs.width  = window.innerWidth;
        cnvs.height = window.innerHeight;
    }
    
}