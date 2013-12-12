/*
 * pixi-dust base particle
 * https://github.com/mstyles/pixi-dust
 *
 * Creates a fairly generic particle emitter for use with [PIXI](http://www.pixijs.com/)
 * with extension points allowing for some awesome particle goodness
 *
 * Copyright (c) 2013 Matt Styles
 * Licensed under the MIT license.
 */


!function( exports, pixi ) {

    'use strict';

    //
    // Particle prototype
    // ---
    exports.Particle = function( texture, extend ) {
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
            };
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
            };
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
            };
        })();

        if ( typeof extend.updateExtensions === 'object' ) {
            for( var prop in extend.updateExtensions ) {
                if ( typeof extend.updateExtensions[ prop ] === 'function' ) {
                    this.updateExtensions.append( extend.updateExtensions[ prop ] );
                }
            }
        }

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