# pixi-dust

Particle emitter for [PIXI](http://www.pixijs.com/)

## Getting Started
It’s not registered with bower or npm yet so only way is to clone this repo:

```shell
git clone git@github.com:mattstyles/pixi-dust.git
```

and build it:

```shell
grunt
```

`/dist/` will now be populated with minified and unminified builds.  Include a build on your page after PIXI, extend the emitter and/or particles with some functionality and you’re good to go.

Best way to learn how to use it is to follow the examples.


## Documentation
It’s a fairly simple implementation of a particle emitter whose actual functionality is defined mainly by what you as the developer wants.  Best place to learn is to dive into the examples and see different ways of specifying emitters and their particles.

## Examples
Check out the examples folder (_note that some examples may take a while to get going, this is because creating loads of particles and their filters on the fly isn’t a good idea, in production you’ll probably want to use pools of particles_).

_You’ll need to serve `examples/index.html` from a webserver or PIXI won’t be happy_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

_Also, please don't edit files in the "dist" subdirectory as they are generated via Grunt. You'll find source code in the "lib" subdirectory!_

## Release History
0.1.0 - Dec 11th 2013 - Released

## License
Copyright (c) 2013 Matt Styles
Licensed under the MIT license.
