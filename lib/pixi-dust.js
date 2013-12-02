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


        PIXI.DisplayObjectContainer.call( this );

        // Define default props for the particle emitter
        this.position = new PIXI.Point();
        this.emitterForces = new PIXI.Point();
        this.particleTexture = texture;

        this.particle = new PIXI.Sprite( this.particleTexture );

        this.addChild( this.particle );
    };

    // Particle emitter is a container for all those particles
    ParticleEmitter.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );

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


}( typeof exports === 'object' && exports || this, this.PIXI );
