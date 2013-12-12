//
// Basic sling for some examples of sprinkling some pixi dust
// Feel free to cornify!
// ---

//
// Some static
// Live a little, add em as globals
// ---
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

var ps = example01();

stage.addChild( ps );

// Start render loop
requestAnimationFrame( animate );
function animate() {

    stats.begin();

    if ( ps ) {
        ps.update();
    }

    renderer.render( stage );
    requestAnimationFrame( animate );

    stats.end();
};

//
// Do some not-so-smart stuff to handle changing examples
// ---

// Creates a new emitter based on the example
var newEmitter = function( number ) {
    if ( ps && number) {
        stage.removeChild( ps );
        ps = this[ 'example' + number ]();
        stage.addChild( ps );
    }
};

// This causes a little slowdown on init but so does
// creating loads of sprites/filters in one batch so...
var actionMap = (function() {
    var map = [100];

    map[ 49 ] = '01';   // 1
    map[ 50 ] = '02';   // 2
    map[ 51 ] = '03';   // 3
    map[ 52 ] = '04';   // 4
    map[ 53 ] = '05';   // 5

    return function( keyCode ) {
        return map[ keyCode ];
    };
})();

// Events
window.onkeydown = function( event ) {
    // Space
    if ( event.keyCode === 32 ) {

    }

    // Return
    if ( event.keyCode === 13 ) {

    }

    // Will throw errors from time to time but who doesnt like to live dangerously?
    newEmitter( actionMap( event.keyCode ) );
};