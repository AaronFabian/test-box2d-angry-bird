import { StateMachine } from './os/StateMachine.js';
import { PlayState } from './states/PlayState.js';
import { StartState } from './states/StartState.js';
import { generateQuads, newHowler as newSound, newImage, newQuad } from './util.js';

function animation() {
	requestAnimationFrame(animation);

	update();
	render();
}

async function init() {
	// make reference to the TWEEN library and make shorter name
	Tween = TWEEN.Tween;

	// await the library because Box2D function return promise
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
	gSounds.break1 = newSound('./../sounds/break1.wav');
	gSounds.break2 = newSound('./../sounds/break2.wav');
	gSounds.break3 = newSound('./../sounds/break3.mp3');
	gSounds.break4 = newSound('./../sounds/break4.wav');
	gSounds.break5 = newSound('./../sounds/break5.wav');
	gSounds.bounce = newSound('./../sounds/bounce.wav');
	gSounds.kill = newSound('./../sounds/kill.wav');
	gSounds.music = newSound('./../sounds/music.wav', true);

	// re-assign global stateMachine and immediately change to startState
	gStateMachine = new StateMachine({
		start: () => new StartState(),
		play: () => new PlayState(),
	});

	gStateMachine.changeState('start');

	// background music
	gSounds.music.play();
	gSounds.music.volume(0.5);

	// start all game
	animation();
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

function update() {
	TWEEN.update();

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

canvas.addEventListener('mousemove', e => {
	const rect = e.target.getBoundingClientRect();
	const x = e.clientX - rect.x;
	const y = e.clientY - rect.y;

	input.mouse.x = x;
	input.mouse.y = y;
});

// game starting point
init();
