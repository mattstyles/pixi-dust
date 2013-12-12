//
// Example04
// ---

// Burst emitter plasma jet
// Creates particles on the fly rather than all in one big lump
// On each update it'll create new particles if necessary
// This version also has a burst timer
// Sensible timings and burst amounts make creating filters reasonable

var BurstEmitter = function( extend ) {
    // Fire the parent constructor
    ParticleEmitter.call( this, extend );

    // The amount to create in one burst
    this.burstAmount = extend.burstAmount || 10;

    // The number currently created
    this.currentParticles = 0;

    // How many frames should elapse before creating a new burst
    this.burstTimer = extend.burstTimer || 0;

    // The burst timer
    this.currentTimer = this.burstTimer;
}

// Inherit from base particle emitter
BurstEmitter.prototype = Object.create( ParticleEmitter.prototype );

// Override init to do nothing
BurstEmitter.prototype.init = function() {
    // noop - particles get their shizzle each update
};

// Update creates particles and then calls the base update to do basic updating
BurstEmitter.prototype.update = function() {
    if ( this.currentParticles < this.maxParticles && this.currentTimer === this.burstTimer) {
        this.currentTimer = 0;

        for ( var i = 0; i < this.burstAmount; i++ ) {
            this.createParticle( this.currentParticles++ );
        }
    }

    if ( this.burstTimer ) {
        this.currentTimer++;
    }

    ParticleEmitter.prototype.update.call( this )
};

// Creates a particle and adds it to the internal representation and to the stage
// Expects to be told where to place the new particles
BurstEmitter.prototype.createParticle = function( id ) {
    // @todo check if pushing onto the array is quicker than creating the array on init
    this.particles[ id ] = new this.particle( this.particleTexture, this.extendParticle );
    this.addChild( this.particles[ id ] );
};



var example05 = function() {
    var COLOR_R = 1.2,  // Try > 1.0 for super-red
        COLOR_G = 0.85,
        COLOR_B = 2.0,
        SPEC = 0;

    // Grab a texture
    var particleTexture = PIXI.Texture.fromImage( './assets/img/particle.png' );

    // Example of creating a new particle
    var p = Particle;

    // Example extending Particle
    var pExtensions = {
        initialExtensions: {
            color: function() {
                this.color = new PIXI.ColorMatrixFilter();
                // @todo this could be done better by moving it all to the GPU via the filter
                this.color.setMatrix = function( r, g, b, a ) {
                    this.matrix[0] = r;
                    this.matrix[5] = g;
                    this.matrix[10] = b;
                    this.matrix[15] = a;  // Does some specular shizzle
                };
                this.color.setMatrix( COLOR_R - (Math.random * 0.65), COLOR_G - (Math.random * 0.25), COLOR_B * (Math.random * 0.2) + 0.8, SPEC );
                this.filters = [ this.color ];
            },
            age: function() {
                this.maxLife = ( Math.random() * 50 ) + 150;
            },
            alpha: function() {
                this.alpha = 1;
            }
        },
        resetExtensions: {
            position: function() {
                this.position.x = ( Math.random() * 10 ) - 5;
                this.position.y = ( Math.random() * 10 ) - 5;
            },
            velocity: function() {
                this.velocity.x = ( Math.random() * 0.4 ) + 2;
                this.velocity.y = ( Math.random() * 0.5 ) - 5;
            },
            scale: function() {
                this.scale.x = this.scale.y = (Math.random() * 0.25) + 0.1;
            },
            alpha: function() {
                this.alpha = 1;
            },
            color: function() {
                this.color.setMatrix( COLOR_R - (Math.random * 0.15), COLOR_G - (Math.random * 0.25), COLOR_B * (Math.random * 0.2) + 0.8, SPEC );
            }
        },
        updateExtensions: {
            position: function() {
                this.position.x += this.velocity.x,
                this.position.y += this.velocity.y
            },
            scale: function() {
                this.scale.x *= 1.025;
                this.scale.y *= 1.025;
            },
            alpha: function() {
//                this.alpha = 1 - (this.age * this.age)
                this.alpha = 1 - this.age;
            },
            color: function() {
                this.color.setMatrix( COLOR_R + ( this.age * ( 1 - COLOR_R ) ), COLOR_G + ( this.age * ( 1 - COLOR_G ) ), COLOR_B, SPEC );
            }
        }
    };

    return new BurstEmitter( {
        position: new PIXI.Point( 50,400 ),
        emitterForces: new PIXI.Point( 0, 0.05 ),
        maxParticles: 100,
        burstAmount: 3,
        burstTimer: 20,
        texture: particleTexture,
        extendParticle: pExtensions
    } );

};
