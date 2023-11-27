// Define all global variable here

// lib
let _Box2D;
let Tween;
// Howl

// constants
const TILE_SIZE = 35;
const ALIEN_SIZE = TILE_SIZE;

// game setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 640;
canvas.height = 360;

// assets
const gImages = {};

const gFrames = {};

const gSounds = {};

let gStateMachine;

// control the input
const input = {
	mouse: {
		keysPressed: {},
		keysReleased: {},

		// x and y coordinate based on canvas
		x: 0,
		y: 0,
	},
	keyboard: {
		keysPressed: {},
	},
};
