/*
 * pixi-dust
 * https://github.com/mstyles/pixi-dust
 *
 * Creates a fairly generic particle emitter for use with [PIXI](http://www.pixijs.com/)
 * with extension points allowing for some awesome particle goodness
 *
 * Copyright (c) 2013 Matt Styles
 * Licensed under the MIT license.
 */

// Common module wrapper - falls back to global
!function( exports, pixi ) {

    'use strict';

    //
    // ParticleEmitter prototype
    // ---
    exports.ParticleEmitter = function( texture, extend ) {
        // Expect PIXI to be a global
        try {
            if ( typeof pixi === 'undefined' ) {
                throw 'PIXI undefined';
            }
        } catch ( error ) {
            // Bail
            // @todo if PIXI goes amd then could try to require it here
            throw new Error( error );
        }

        // Check that a texture has been supplied
        if ( !(texture instanceof PIXI.Texture) ) {
            extend = texture;
            texture = null;

            // If it wasn't supplied explicitly then check its in the extensions
            if ( typeof extend.texture === 'undefined' ) {
                throw new Error( 'Particle texture undefined' );
            }
        }

        // Create the extension object
        extend = extend || {};

        // Call parent constructor
        PIXI.DisplayObjectContainer.call( this );

        //
        // Members
        // ---

        // Position of the emitter group
        // Particle positions will be relative to this point
        // Uses the supplied extension function for positioning if available or
        // falls back to basic assignment
        if ( typeof extend.setEmitterPosition === 'function' ) {
            extend.setEmitterPosition.apply( this );
        } else {
            this.position = extend.position || new PIXI.Point();
        }

        // Forces acting on the particles as they update
        this.emitterForces = extend.emitterForces ||  new PIXI.Point();

        // The base texture used for the particles
        this.particleTexture = texture || extend.texture;

        // The maximum number of particles this emitter uses
        this.maxParticles = extend.maxParticles || 100;

        // The array of particles
        this.particles = [];

        // The type of particle to use for this emitter
        // If a constructor function is passed then use that, other wise
        // expect it to be an extension object for base Particle
        if ( typeof extend.particle === 'object' ) {
            this.extendParticle = extend.particle;
            this.particle = Particle;
        } else if ( typeof extend.particle === 'function' ) {
            this.particle = extend.particle;
            this.extendParticle = extend.extendParticle || null;
        } else {
            this.particle = Particle;
            this.extendParticle = extend.extendParticle || null;
        }

        // The extension object - holds various functions to extend basic behaviour
        // @todo set abstract noops here or include them
        // @todo are these still necessary as they can be set using a function
        // when the emitter is created?
        this.setEmitterPosition = extend.setEmitterPosition || function() {
            return null;
        };

        this.setEmitterForces = extend.setEmitterForces || function() {
            return null;
        };

        // Call init to setup the emitter
        this.init();
    };

    // Particle emitter is a container for all those particles
    ParticleEmitter.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );

    //
    // Methods
    // ---

    // Initialises the emitter by setting up the particles
    ParticleEmitter.prototype.init = function() {
        for ( var i = 0; i < this.maxParticles; i++ ) {
            this.particles[ i ] = new this.particle( this.particleTexture, this.extendParticle );

            this.addChild( this.particles[ i ] );
        }
    };

    // Updates each of the particles
    ParticleEmitter.prototype.update = function() {
        var self = this;

        // @todo get some analytics up and make this quicker
        this.particles.forEach( function( particle ) {
            particle.update();
            particle.applyForce( self.emitterForces );
        });
    };


    //
    // Getters/Setters
    // ---
    ParticleEmitter.prototype.setPosition = function( x, y ) {
        this.position.x = ( x === 0 ) ? 0 : x || this.position.x;
        this.position.y = ( y === 0 ) ? 0 : y || this.position.y;
    };

    ParticleEmitter.prototype.setForces = function( x, y ) {
        this.emitterForces.x = ( x === 0 ) ? 0 : x || this.emitterForces.x;
        this.emitterForces.y = ( y === 0 ) ? 0 : y || this.emitterForces.y;
    };



    //
    // Particle prototype
    // ---
    exports.Particle = function( texture, extend ) {
        // Check that a texture has been supplied
        if ( !(texture instanceof PIXI.Texture) ) {
            extend = texture;
            texture = null;

            // If it wasn't supplied explicitly then check its in the extensions
            if ( typeof extend.texture === 'undefined' ) {
                throw new Error( 'Particle texture undefined' );
            }
        }

        // Create the extension object
        extend = extend || {};

        // Call parent constructor
        PIXI.Sprite.call( this, texture );

        //
        // Members
        // ---

        // Position of the particle
        this.position = new PIXI.Point();

        // Velocity of the particle
        this.velocity = new PIXI.Point();

        // Scale of the particle
        this.scale = new PIXI.Point();

        // Extension functions for when particles are created
        // @todo -apply- is doing a foreach each loop too slow?  probably a better way
        this.initialExtensions = ( function() {
            var ext = [];

            return {
                append: function( extension ) {
                    ext.push( extension );
                },

                apply: function( context ) {
                    ext.forEach( function( fn ) {
                        fn.apply( context );
                    } );
                }
            }
        })();

        if ( typeof extend.initialExtensions === 'object' ) {
            for( var prop in extend.initialExtensions ) {
                if ( typeof extend.initialExtensions[ prop ] === 'function' ) {
                    this.initialExtensions.append( extend.initialExtensions[ prop ] );
                }
            }
        }

        // Extensions to apply when a particle is reset
        this.resetExtensions = ( function() {
            var ext = [];

            return {
                append: function( extension ) {
                    ext.push( extension );
                },

                apply: function( context ) {
                    ext.forEach( function( fn ) {
                        fn.apply( context );
                    } );
                }
            }
        })();

        if ( typeof extend.resetExtensions === 'object' ) {
            for( var prop in extend.resetExtensions ) {
                if ( typeof extend.resetExtensions[ prop ] === 'function' ) {
                    this.resetExtensions.append( extend.resetExtensions[ prop ] );
                }
            }
        }

        // Extensions for the update function
        this.updateExtensions = ( function() {
            var ext = [];

            return {
                append: function( extension ) {
                    ext.push( extension );
                },

                apply: function( context ) {
                    ext.forEach( function( fn ) {
                        fn.apply( context );
                    } );
                }
            }
        })();

        if ( typeof extend.updateExtensions === 'object' ) {
            for( var prop in extend.updateExtensions ) {
                if ( typeof extend.updateExtensions[ prop ] === 'function' ) {
                    this.updateExtensions.append( extend.updateExtensions[ prop ] );
                }
            }
        }

        // Alpha value of the particle
        this.alpha = 1;

        // The current life of the particle
        this.currentLife = 0;

        // The maximum life of the particle
        this.maxLife = 0;

        // Age is clamped from 0 to 1
        this.age = 0;

        // Initialise the particle
        this.init();
    };

    // A particle is a basic PIXI sprite
    Particle.prototype = Object.create( PIXI.Sprite.prototype );

    //
    // Methods
    // ---

    // Initialise the particle
    // Fires once when the particle is created
    Particle.prototype.init = function() {
        // Fire any extra extension functions
        this.initialExtensions.apply( this );

        // Reset the particle to finish creating it
        this.reset();
    };

    // Reset the particle
    // We reuse particles so this is used to reset a dead particle
    Particle.prototype.reset = function() {
        this.resetExtensions.apply( this );
    };


    // Update the particle
    Particle.prototype.update = function() {
        // Get age
        this.age = this.currentLife / this.maxLife;

        // Fire extension functions
        this.updateExtensions.apply( this );

        // Update age and reset if too old
        this.currentLife += 1;
        if ( this.currentLife >= this.maxLife ) {
            this.currentLife = 0;
            this.reset();
        }
    };

    // Apply forces from outside of the particles own existence
    Particle.prototype.applyForce = function( force ) {
        this.velocity.x += force.x;
        this.velocity.y += force.y;
    };

}( typeof exports === 'object' && exports || this, this.PIXI );
