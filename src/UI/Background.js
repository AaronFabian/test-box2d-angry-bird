import { keyboardIsDown } from '../index.js';

export class Background {
	BACKGROUND_TYPES = [
		'colored_land',
		'blue_grass',
		'blue_desert',
		'colored_desert',
		'blue_shroom',
		'colored_grass',
		'colored_shroom',
	];

	constructor() {
		this.background = this.BACKGROUND_TYPES[Math.floor(Math.random() * this.BACKGROUND_TYPES.length)];

		this.width = gImages[this.background].width;
		this.xOffset = 0;
	}

	update() {
		if (keyboardIsDown('j')) {
			this.xOffset += BACKGROUND_SCROLL_X_SPEED * 0.05;
		} else if (keyboardIsDown('k')) {
			this.xOffset -= BACKGROUND_SCROLL_X_SPEED * 0.05;
		}

		this.xOffset %= this.width;
	}

	render() {
		ctx.drawImage(gImages[this.background], this.xOffset, -128);
		ctx.drawImage(gImages[this.background], this.xOffset + this.width, -128);
		ctx.drawImage(gImages[this.background], this.xOffset - this.width, -128);
	}
}
