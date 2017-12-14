import getRandom from '../mainActions.js';

export default class Particle {
    
    constructor(minRad, maxRad) {
        this.colors = [
            '255, 255, 255',
            '202,225,255',
            '19, 19, 19',
            '127,255,212',
            '0,	245, 255',
            '224,102,255']
        this.minRadius = minRad; 
        this.maxRadius = maxRad;
        
        this.radius = Math.ceil(getRandom(this.minRadius, this.maxRadius));
        this.color = this.colors[Math.floor(getRandom(0, this.colors.length))];
    }
    
}