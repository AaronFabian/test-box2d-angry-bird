import { StateMachine } from './os/StateMachine.js';
import { LoadingState } from './states/LoadingState.js';
import { PlayState } from './states/PlayState.js';
import { StartState } from './states/StartState.js';
import { generateQuads, newHowler as newSound, newImage, newQuad } from './util.js';

let msPrev = window.performance.now();
let fps = 120;
let fpsInterval = 1000 / fps;
function animation(time) {
	const _ = requestAnimationFrame(animation);

	// this will treat all computer have the same execute speed
	const msNow = window.performance.now();
	const elapsed = msNow - msPrev;
	if (elapsed < fpsInterval) return;
	msPrev = msNow - (elapsed % fpsInterval);

	// time is not dt like other game engine
	// in this "time" is current time elapsed since game run
	update(time);
	render();
}

async function init() {
	// draw loading screen
	const loadingState = new LoadingState();
	loadingState.render();

	// did not make howler shorter ...

	// make reference to the TWEEN library and make shorter name only for Tween function
	Tween = TWEEN.Tween;

	// await the Box2D library because Box2D function return promise
	_Box2D = await Box2D();

	// create and await all asset
	gImages.colored_land = await newImage('./../assets/colored_land.png');

	gImages.blue_desert = await newImage('./../assets/blue_desert.png');
	gImages.blue_grass = await newImage('./../assets/blue_grass.png');
	gImages.blue_shroom = await newImage('./../assets/blue_shroom.png');

	gImages.colored_desert = await newImage('./../assets/colored_desert.png');
	gImages.colored_grass = await newImage('./../assets/colored_grass.png');
	gImages.colored_shroom = await newImage('./../assets/colored_shroom.png');

	gImages.aliens = await newImage('./../assets/aliens.png');
	gImages.tiles = await newImage('./../assets/tiles.png');
	gImages.wood = await newImage('./../assets/wood.png');
	gImages.arrow = await newImage('./../assets/arrow.png');

	// create and cropped image to draw on the canvas using _QuadImage constructor
	gFrames.aliens = generateQuads(gImages.aliens, 35, 35);
	gFrames.woods = [
		newQuad(gImages.wood, 0, 0, 110, 35),
		newQuad(gImages.wood, 0, 35, 110, 35),
		newQuad(gImages.wood, 320, 180, 35, 110),
		newQuad(gImages.wood, 355, 355, 35, 110),
	];

	// create sound and sfx using Howler js
	gSounds.break1 = await newSound('./../sounds/break1.wav');
	gSounds.break2 = await newSound('./../sounds/break2.wav');
	gSounds.break3 = await newSound('./../sounds/break3.mp3');
	gSounds.break4 = await newSound('./../sounds/break4.wav');
	gSounds.break5 = await newSound('./../sounds/break5.wav');
	gSounds.bounce = await newSound('./../sounds/bounce.wav');
	gSounds.kill = await newSound('./../sounds/kill.wav');
	gSounds.music = await newSound('./../sounds/music.wav', true);

	// re-assign global stateMachine and immediately change to startState
	gStateMachine = new StateMachine({
		start: () => new StartState(),
		play: () => new PlayState(),
	});

	gStateMachine.changeState('start');

	// background music
	gSounds.music.play();
	gSounds.music.volume(0.3);

	// start all game
	requestAnimationFrame(animation);
}

export function mouseWasPressed(key) {
	return input.mouse.keysPressed[key];
}

export function mouseWasReleased(key) {
	return input.mouse.keysReleased[key];
}

export function keyboardWasPressed(key) {
	return input.keyboard.keysPressed[key];
}

export function keyboardIsDown(key) {
	return input.keyboard.isDown[key];
}

function update(time) {
	TWEEN.update(time);

	gStateMachine.update();

	input.mouse.keysPressed = {};
	input.mouse.keysReleased = {};
	input.keyboard.keysPressed = {};
}

function render() {
	ctx.reset();
	gStateMachine.render();
}

// event listener for all game
window.addEventListener('mousedown', ({ buttons }) => {
	input.mouse.keysPressed[buttons] = true;
});

window.addEventListener('mouseup', ({ button }) => {
	input.mouse.keysReleased[button] = true;
});

window.addEventListener('keypress', ({ key }) => {
	input.keyboard.keysPressed[key] = true;
});

window.addEventListener('keydown', ({ key }) => {
	if (input.keyboard.isDown[key] === undefined) return;
	input.keyboard.isDown[key] = true;
});

window.addEventListener('keyup', ({ key }) => {
	if (input.keyboard.isDown[key] === undefined) return;
	input.keyboard.isDown[key] = false;
});

canvas.addEventListener('mousemove', e => {
	// e.target is canvas element
	const rect = e.target.getBoundingClientRect();
	const x = e.clientX - rect.x;
	const y = e.clientY - rect.y;

	input.mouse.x = x;
	input.mouse.y = y;
});

// game starting point
init();
