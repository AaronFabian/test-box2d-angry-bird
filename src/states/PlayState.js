import { Level } from '../game/Level.js';
import { keyboardIsDown, keyboardWasPressed } from '../index.js';
import { BaseState } from './BaseState.js';

export class PlayState extends BaseState {
	constructor() {
		super();

		this.level = new Level();
		this.levelTranslateX = 0;

		// ui decoration
		this.showUI = true;
		this.blink = false;
		this.blinkOpacity = 1;
		this.blinkIntervalId = setInterval(() => {
			new Tween(this).to({ blinkOpacity: this.blink ? 1 : 0 }, 1000).start();
			this.blink = !this.blink;
		}, 1000);
	}

	update() {
		if (keyboardWasPressed('j') || keyboardWasPressed('k')) {
			this.showUI = false;
		}

		if (keyboardIsDown('j')) {
			this.levelTranslateX += MAP_SCROLL_X_SPEED * 0.05;

			if (this.levelTranslateX > canvas.width) {
				this.levelTranslateX = canvas.width;
			} else {
				// only updating background if we able scroll the level
				this.level.background.update();
			}
		} else if (keyboardIsDown('k')) {
			this.levelTranslateX -= MAP_SCROLL_X_SPEED * 0.05;

			if (this.levelTranslateX < -canvas.width) {
				this.levelTranslateX = -canvas.width;
			} else {
				// only updating background if we able scroll the level
				this.level.background.update();
			}
		}

		// update all level except level.background
		this.level.update();
	}

	render() {
		this.level.background.render();

		ctx.save();
		ctx.translate(Math.floor(this.levelTranslateX), 0);
		this.level.render();
		ctx.restore();

		// game hint
		if (this.showUI) {
			ctx.fillStyle = 'rgba(64,64,64,0.5)';
			ctx.fillRect(10, 10, 255, 30);

			ctx.fillStyle = `rgba(255,255,255,${this.blinkOpacity})`;
			ctx.font = '14px fontTTF';
			ctx.textAlign = 'left';
			ctx.fillText('press j or k to move camera', 20, 28);
		}
	}
}
