//
// Example01
// ---

// Creates a fire effect
// Extends the base particle rather than create a new object
// Also uses a GPU filter to colorize the particles

var example01 = function() {

    // Grab a texture
    var particleTexture = PIXI.Texture.fromImage( './assets/img/particle.png' );

    // Example of creating a new particle
    var p = Particle;

    // Example extending Particle
    var pExtensions = {
        // Extensions can be specified as an object
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
                this.color.setMatrix( 1, 0.85, 0, 1 );
                this.filters = [ this.color ];
            },
            age: function() {
                this.maxLife = ( Math.random() * 50 ) + 10;
            },
            alpha: function() {
                this.alpha = 1;
            }
        },
        resetExtensions: {
            position: function() {
                this.position.x = ( Math.random() * 20 ) - 10;
                this.position.y = ( Math.random() * 20 ) - 10;
            },
            velocity: function() {
                this.velocity.x = ( Math.random() * 1.5 ) - 0.75;
                this.velocity.y = ( Math.random() * -6 );
            },
            scale: function() {
                this.scale.x = this.scale.y = (Math.random() * 0.25) + 0.25;
            },
            color: function() {
                this.color.setMatrix( 1, 0.85, 0, 1 );
            }
        },
        updateExtensions: {
            position: function() {
                this.position.x += this.velocity.x,
                this.position.y += this.velocity.y
            },
            scale: function() {
                this.scale.x *= 0.99;
                this.scale.y *= 0.99;
            },
            color: function() {
                this.color.setMatrix( 1, 0.85 - this.age, 0, 0 );
            },
            alpha: function() {
                this.alpha = 1 - this.age;
            }
        }
    };

    // Create the particle emitter
    return new ParticleEmitter( {
        position: new PIXI.Point( 400, 300 ),
//        emitterForces: new PIXI.Point( 0, -0.025 ),
        texture: particleTexture,
        maxParticles: 100,
//        particle: p,
        extendParticle: pExtensions
    } );

};
