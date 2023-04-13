# Canvas Sandbox

Utility project to create 2D or 3D effects based on HTLM Canvas element. The sandbox provide an easy way to manage dynamic settings like canvas size, timeline, speed, pause, fullscreen, framerate control, etc. Any graphic framework could be used if needed, [three.js](https://threejs.org/), [GSAP](https://greensock.com/gsap/), [p5.js](https://p5js.org/)...

View demo live version here: https://dsarrio.github.io/canvas-sandbox/

## Getting started

Sandbox is written in typescript, you can run `npm install` to install dependencies and then `npm start` to start server with live-reload enabled

## Effects

An effect is a typescript class implementing [Effect](/src/core/engine/Effect.ts) interface. A settings gui can be provided by each effect using [tweakpane](https://github.com/cocopon/tweakpane).
For more details you can refer to provided samples effects.

### Adding a new effect

You can create an effect from scratch or clone any of the examples. The only thing required is to register the effect to the sandbox, see [main.ts](/src/main.ts)

## All Features

* Effect can be written as Typescript or Javascript
* Support almost any Framework
* Customizable GUIs
* Live-reload
* Effect recording (Webm)
* Snapshots export to clipboard or PNG file
* Fullscreen support
* Time control (play / pause / rewind / seekthrough)
* FPS monitoring
* Ability to limit FPS to simulate low end hardware
* Helpers (mouse, grid, etc.)
* Autonomous effects so they can be reused outside of sandbox
