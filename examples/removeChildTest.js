
var WIDTH = 800,
    HEIGHT = 600,
    BG_COLOR = '0a0a0a';

document.body.style.background = '#' + BG_COLOR;

//
// Set up stats stuff
// ---
var stats = new Stats();
stats.setMode( 0 ); // 0: fps, 1: ms

// Align top-left
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

document.body.appendChild( stats.domElement );

//
// Set up pixi stuff
// ---

var renderer = new PIXI.autoDetectRenderer( WIDTH, HEIGHT );
document.body.appendChild( renderer.view );

var stage = new PIXI.Stage( '0x' + BG_COLOR, true );
var texture = new PIXI.Texture.fromImage( './assets/img/particle.png' );

var i;

var doc = new PIXI.DisplayObjectContainer();
doc.position.x = 0;
doc.position.y = 0;
var spr = null;

for ( i = 0; i < 200; i++ ) {
    spr = new PIXI.Sprite( texture );
    spr.position.x = ( Math.random() * 800 );
    spr.position.y = ( Math.random() * 600 );
    spr.scale.x = spr.scale.y = Math.random() * 0.75;
    spr.filters = [ new PIXI.ColorMatrixFilter() ];
    doc.addChild( spr );
}


stage.addChild( doc );

// Start render loop
requestAnimationFrame( animate );

function animate() {

    stats.begin();

    renderer.render( stage );
    requestAnimationFrame( animate );

    stats.end();
};

// Events
window.onkeydown = function( event ) {
    // Space
    // Adds 200 sprites/filters directly to stage
    if ( event.keyCode === 32 ) {
        for ( i = 0; i < 200; i++ ) {
            spr = new PIXI.Sprite( texture );
            spr.position.x = ( Math.random() * 800 );
            spr.position.y = ( Math.random() * 600 );
            spr.scale.x = spr.scale.y = Math.random() * 0.75;
            spr.filters = [ new PIXI.ColorMatrixFilter() ];
            stage.addChild( spr );
        }
    }

    // Return
    // Nukes stage children
    if ( event.keyCode === 13 ) {
        while( stage.children.length > 0 ) {
            stage.removeChild( stage.children[ 0 ] );
        }
    }

    // 1
    // Removes the container from stage and then readds it
    if ( event.keyCode === 49 ) {
        stage.removeChild( doc );
        setTimeout( function() {
            stage.addChild( doc );
        },1000 );
    }

    // 2
    // Removes and then recreates 200 sprites/filters and adds
    // them to stage again
    if ( event.keyCode === 50 ) {
        var size = Math.random() * 300 + 200;

        stage.removeChild( doc );
        doc = new PIXI.DisplayObjectContainer();
        doc.position.x = 400;
        doc.position.y = 300;
        for ( i = 0; i < 200; i++ ) {
            spr = new PIXI.Sprite( texture );
            spr.position.x = ( Math.random() * size ) - size/2;
            spr.position.y = ( Math.random() * size ) - size / 2;
            spr.scale.x = spr.scale.y = Math.random() * 0.75;
            spr.filters = [ new PIXI.ColorMatrixFilter() ];
            doc.addChild( spr );
        }
        stage.addChild( doc );
    }
};