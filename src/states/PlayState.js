import { Level } from '../game/Level.js';
import { BaseState } from './BaseState.js';

export class PlayState extends BaseState {
	constructor() {
		super();

		this.level = new Level();
		this.levelTranslateX = 0;
	}

	update() {
		this.level.update();
	}

	render() {
		this.level.render();
	}
}
