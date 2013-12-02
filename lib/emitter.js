/*
 * pixi-dust base emitter
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

}( typeof exports === 'object' && exports || this, this.PIXI );
