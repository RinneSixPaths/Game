export default class Monster {
    
    constructor(img, audioURL, clienID, ctx, canvas, enemy, width = 110, height = 100) {
        
        this.pic = new Image();
        this.pic.src = img;
        this.clienID = clienID;
        this.musicURL = audioURL;
        this.enemy = enemy;
        this.music = null;
        this.audioContext = null;
        this.analyser = null;
        this.source = null;
        this.fbc_array = null;
        this.radius_old = null;
        this.bar_x = null;
        this.bar_y = null;
        this.bar_width = null;
        this.bar_height = null;
        this.radius = 0;
        this.intencity = 0;
        this.width = width;
        this.height = height;
        this.ctx = ctx;
        this.canvas = canvas;
        this.area = canvas.height / 3;
        this.pic.onload = () => { this.initMonster(); }
        
    }
    
    initMonster() {
        
        this.music = new Audio();
        this.music.crossOrigin = "anonymous";
        this.music.controls = true;
        this.music.loop = false;
        this.music.autoplay = false;

        this.audioContext = new AudioContext();
        this.analyser = this.audioContext.createAnalyser();
        this.source = this.audioContext.createMediaElementSource(this.music);
        this.source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);

        this.fbc_array = new Uint8Array(this.analyser.frequencyBinCount);
        
        this.initMonsterPlayer();
        this.frameLooper(this.ctx, this.canvas);
        
    }
    
    initMonsterPlayer() {
        this.music.src = this.musicURL;
        this.music.play();
          
    }
    
    frameLooper(ctx, canvas) {
        
        let self = this;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
				
        this.intensity = 0;

        this.analyser.getByteFrequencyData(this.fbc_array);

        for (var i = 0; i < this.area; i++) {

            this.bar_height = Math.min(99999, Math.max((this.fbc_array[i] * 2.5 - this.area), 0));
            this.bar_width = this.bar_height * 0.02;


            this.intensity += this.bar_height;
        }


        this.radius_old = this.radius;
        this.radius =  25 + (this.intensity * 0.002);

        ctx.drawImage(this.pic, canvas.width/2 - this.width/2 - this.radius/2, canvas.height/2 - this.height/2 -this.radius/2, this.width + this.radius, this.height + this.radius);
        
        this.enemy.checkCollision();
        
        window.requestAnimationFrame(() => {
            self.frameLooper(self.ctx, self.canvas);
        });
    }
    
}