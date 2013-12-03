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

var newEmitter = function( number ) {
    if ( ps ) {
        stage.removeChild( ps );
//        ps = null;
//        ps = this[ 'example' + number ]();
        stage.addChild( ps );
    }
};

// Events
window.onkeydown = function( event ) {
    // Space
    if ( event.keyCode === 32 ) {
        if ( ps ) {
//            stage.removeChild( ps );  // Remove child seems to break things
            stage.children = [];
            ps = null;
        } else {
            ps = example01();
            stage.addChild( ps );
        }
    }

    // Return
    if ( event.keyCode === 13 ) {
    }

    // 1
    if ( event.keyCode === 49 ) {
        newEmitter( '01' );
    }
};