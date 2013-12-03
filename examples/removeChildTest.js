
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
doc.position.x = 400;
doc.position.y = 300;
var spr = null;

for ( i = 0; i < 200; i++ ) {
    spr = new PIXI.Sprite( texture );
    spr.position.x = ( Math.random() * 200 ) - 100;
    spr.position.y = ( Math.random() * 200 ) - 100;
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
    // `Uncaught TypeError: Cannot read property 'renderable' of null `
    if ( event.keyCode === 32 ) {
        stage.removeChild( doc );
        stage.addChild( new PIXI.Sprite( texture ) );
    }

    // Return
    if ( event.keyCode === 13 ) {
        spr = new PIXI.Sprite( texture );
        spr.position.x = Math.random() * WIDTH;
        spr.position.y = Math.random() * HEIGHT;
        stage.addChild( spr );
    }

    // 1
    // `Crashes browser tab`
    if ( event.keyCode === 49 ) {
        stage.removeChild( doc );
        stage.addChild( doc );
    }

    // 2
    // `Uncaught TypeError: Cannot read property 'renderable' of null`
    // Works fine without filters
    if ( event.keyCode === 50 ) {
        stage.removeChild( doc );
        doc = new PIXI.DisplayObjectContainer();
        doc.position.x = 400;
        doc.position.y = 300;
        for ( i = 0; i < 200; i++ ) {
            spr = new PIXI.Sprite( texture );
            spr.position.x = ( Math.random() * 200 ) - 100;
            spr.position.y = ( Math.random() * 200 ) - 100;
            spr.scale.x = spr.scale.y = Math.random() * 0.75;
            spr.filters = [ new PIXI.ColorMatrixFilter() ];
            doc.addChild( spr );
        }
        stage.addChild( doc );
    }
};