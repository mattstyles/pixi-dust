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
    exports.ParticleEmitter = function( texture ) {
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

        // Call parent constructor
        PIXI.DisplayObjectContainer.call( this );

        //
        // Members
        // ---

        // Position of the emitter group
        // Particle positions will be relative to this point
        this.position = new PIXI.Point();

        // Forces acting on the particles as they update
        this.emitterForces = new PIXI.Point();

        // The base texture used for the particles
        this.particleTexture = texture;

        // The maximum number of particles this emitter uses
        this.maxParticles = 0;

        // The array of particles
        this.particles = [];

        // The extension object - holds various functions to extend basic behaviour
        // @todo set abstract noops here or include them
        this.setEmitterPosition = function() {
            return null;
        };

        this.setEmitterForces = function() {
            return null;
        };
    };

    // Particle emitter is a container for all those particles
    ParticleEmitter.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );

    //
    // Methods
    // ---

    // Initialises the emitter by setting up the particles
    ParticleEmitter.prototype.init = function() {
        // Set up the emitter using custom extension functions if available
        this.position = this.setEmitterPosition() || this.position;
        this.emitterForces = this.setEmitterForces() || this.emitterForces;

        this.maxParticles = 200;

        for ( var i = 0; i < this.maxParticles; i++ ) {
            this.particles[ i ] = new Particle( this.particleTexture );
            this.particles[ i ].init();

            this.addChild( this.particles[ i ] );
        }
    };

    // Updates each of the particles
    ParticleEmitter.prototype.update = function() {
        var self = this;

        this.particles.forEach( function( particle ) {
            particle.update();
            particle.applyForce( self.emitterForces );
        });
    };


    //
    // Getters/Setters
    // ---
    ParticleEmitter.prototype.setPosition = function( x, y ) {
        this.position.x = x || this.position.x;
        this.position.y = y || this.position.y;
    };

    ParticleEmitter.prototype.setForces = function( x, y ) {
        this.emitterForces.x = x || this.emitterForces.x;
        this.emitterForces.y = y || this.emitterForces.y;
    };



    //
    // Particle prototype
    // ---
    exports.Particle = function( texture ) {
        // Call parent constructor
        PIXI.Sprite.call( this, texture );

        //
        // Members
        // ---

        // Position of the particle
        // These will be relative to the particle emitter it is grouped to
        this.position = new PIXI.Point();

        // Velocity of the particle
        this.velocity = new PIXI.Point();

        // The current life of the particle
        this.currentLife = 0;

        // The maximum life of the particle
        this.maxLife = 0;
    };

    // A particle is a basic PIXI sprite
    Particle.prototype = Object.create( PIXI.Sprite.prototype );

    Particle.prototype.init = function() {
        this.position.x = ( Math.random() * 50 ) - 25;
        this.position.y = ( Math.random() * 50 ) - 25;

        this.velocity.x = ( Math.random() * 2 ) - 1;
        this.velocity.y = ( Math.random() * 2 ) - 1;
//        this.velocity.y = ( Math.random() * -4 );
    };

    Particle.prototype.update = function() {
        // Update position
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    };

    Particle.prototype.applyForce = function( force ) {
        this.position.y += force.y;
    };

}( typeof exports === 'object' && exports || this, this.PIXI );
