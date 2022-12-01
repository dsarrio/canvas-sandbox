# Canvas Sandbox

Utility project to work with HTML Canvas elements like dynamic settings and presets, live reload, various input handlers like mouse moves, clicks, key presses or ability to go full screen, control framerate, etc.
Many different effects can be worked on at the same time.

## Getting started

This is a classical npm project so `npm install` to install dependencies and then `npm start` to start server with live-reload enabled

## Adding a new effect

A `default` effect is provided as a starting point, you can edit it directly if you want but preferably you should clone it by cloning the file `effects/fx_default.js` to another one like `effects/my_effect.js` to keep default as a pristine reference.
Once you have the effect js file you need to declare it inside index.html alongside default one. That's it, it should appear in the GUI menu and you can switch between effects.

## Presets

The GUI allows you to create presets, they are tied to the effect (based on their name) so when you change effect settings are loaded accordingly. Beware that when a live-reload occurs settings are automatically saved.

