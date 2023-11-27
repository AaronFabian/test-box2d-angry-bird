import { Alien } from '../gameObject/Alien.js';
import { mouseWasPressed, mouseWasReleased } from '../index.js';

export class AlienLaunchMarker {
	constructor(world, playerData) {
		this.world = world;

		// starting coordinate for launcher used to calculate launch vector
		this.baseX = 90;
		this.baseY = canvas.height - 100;

		// shifted coordinate when clicking and dragging launch alien
		this.shiftedX = this.baseX;
		this.shiftedY = this.baseY;

		// (state) whether our arrow is showing where we're aiming
		this.aiming = false;

		// whether we launched the alien and should stop rendering preview
		this.launched = false;

		// for alien object late init
		this.alien = null;
		this.playerData = playerData;

		// super power
		// code ...
	}

	update() {
		if (!this.launched) {
			// grab mouse coordinates
			const [x, y] = [input.mouse.x, input.mouse.y];

			// we click the arrow but not released the button
			if (mouseWasPressed(1) && !this.launched) {
				this.aiming = true;
			} else if (mouseWasReleased(0) && this.aiming) {
				// the mouse was released then shoot
				this.launched = true;

				// generate new Alien and register to world
				this.alien = new Alien(this.world, 'circle', this.shiftedX, this.shiftedY, this.playerData);
				this.alien.body.SetGravityScale(0.3);
				this.alien.body.SetLinearVelocity(
					new _Box2D.b2Vec2((this.baseX - this.shiftedX) * 2, (this.baseY - this.shiftedY) * 2)
				);

				// bounciness
				this.alien.fixture.SetRestitution(0.4);
				this.alien.body.SetAngularDamping(1);

				// we're no longer aiming
				this.aiming = false;
			} else if (this.aiming) {
				this.shiftedX = Math.min(this.baseX + 30, Math.max(x, this.baseX - 30));
				this.shiftedY = Math.min(this.baseY + 30, Math.max(y, this.baseY - 30));
			}
		} else if (this.launched) {
			// code ...
		}
	}

	render() {
		if (!this.launched) {
			// render non physic alien
			gFrames.aliens[6].drawImage(ctx, this.shiftedX - 17.5, this.shiftedY - 17.5);
		} else {
			this.alien.render();
		}
	}
}
