import { Background } from '../UI/Background.js';
import { Alien } from '../gameObject/Alien.js';
import { Obstacle } from '../gameObject/Obstacle.js';
import { keyboardWasPressed } from '../index.js';
import { AlienLaunchMarker } from './AlienLaunchMarker.js';

export class Level {
	static get #GROUND_ID() {
		return 9999;
	}

	static get #PLAYER_ID() {
		return 999;
	}

	static get #ALIEN_ID() {
		return 99;
	}

	static get #OBSTACLE_ID() {
		return 9;
	}

	constructor() {
		this.background = new Background();
		this.world = new _Box2D.b2World();
		this.world.SetGravity(new _Box2D.b2Vec2(0, 30));

		// an array of destroyed body
		this.destroyedBody = [];

		// box2D event
		const listener = new _Box2D.JSContactListener();
		listener.BeginContact = function (contactPtr) {
			const contact = _Box2D.wrapPointer(contactPtr, _Box2D.b2Contact);
			const fixtureA = contact.GetFixtureA();
			const fixtureB = contact.GetFixtureB();

			const types = {};
			types[fixtureA.GetUserData()] = true;
			types[fixtureB.GetUserData()] = true;

			// collided between obstacle and player
			if (types[Level.#OBSTACLE_ID] && types[Level.#PLAYER_ID]) {
				const playerFixture = fixtureA.GetUserData() === Level.#PLAYER_ID ? fixtureA : fixtureB;
				const obstacleFixture = fixtureB.GetUserData() === Level.#PLAYER_ID ? fixtureA : fixtureB;

				const { x: velX, y: velY } = playerFixture.GetBody().GetLinearVelocity();
				const sumVel = Math.abs(velX) + Math.abs(velY);
				if (sumVel > 20) {
					this.destroyedBody.push(obstacleFixture.GetBody());
				}
			}

			// collided between obstacle and alien (enemy)
			if (types[Level.#OBSTACLE_ID] && types[Level.#ALIEN_ID]) {
				const alienFixture = fixtureA.GetUserData() === Level.#ALIEN_ID ? fixtureA : fixtureB;
				const obstacleFixture = fixtureB.GetUserData() === Level.#ALIEN_ID ? fixtureA : fixtureB;

				// destroy alien when alien from falling debris if debris is fast enough; debris mean obstacle
				const { x: velX, y: velY } = obstacleFixture.GetBody().GetLinearVelocity();
				const sumVel = Math.abs(velX) + Math.abs(velY);
				// make it stronger otherwise game to easy
				if (sumVel > 80) {
					this.destroyedBody.push(alienFixture.GetBody());
				}
			}

			// collided between player and alien
			if (types[Level.#PLAYER_ID] && types[Level.#ALIEN_ID]) {
				const playerFixture = fixtureA.GetUserData() === Level.#PLAYER_ID ? fixtureA : fixtureB;
				const alienFixture = fixtureB.GetUserData() === Level.#PLAYER_ID ? fixtureA : fixtureB;

				// destroy alien if player fast enough
				const { x: velX, y: velY } = playerFixture.GetBody().GetLinearVelocity();
				const sumVel = Math.abs(velX) + Math.abs(velY);
				if (sumVel > 20) {
					this.destroyedBody.push(alienFixture.GetBody());
				}
			}

			if (types[Level.#PLAYER_ID] && types[Level.#GROUND_ID]) {
				gSounds.bounce.stop();
				gSounds.bounce.play();
			}
		}.bind(this);

		// implement empty listener callback; must implement
		listener.EndContact = function () {}.bind(this);
		listener.PreSolve = function () {}.bind(this);
		listener.PostSolve = function () {}.bind(this);

		// register event . listener to world
		this.world.SetContactListener(listener);

		// alien trajectory arrow
		this.launchMarker = new AlienLaunchMarker(this.world, Level.#PLAYER_ID);

		// aliens or enemy
		this.aliens = [];
		this.aliens.push(
			new Alien(this.world, 'square', canvas.width - 80, canvas.height - ALIEN_SIZE / 2, Level.#ALIEN_ID)
		);

		// (for test only use hardcode) obstacle in our game such as wood, etc...
		this.obstacles = [];
		this.obstacles.push(
			new Obstacle(this.world, 'vertical', canvas.width - 120, canvas.height - 110 / 2, Level.#OBSTACLE_ID)
		);
		this.obstacles.push(
			new Obstacle(this.world, 'vertical', canvas.width - 35, canvas.height - 110 / 2, Level.#OBSTACLE_ID)
		);
		this.obstacles.push(
			new Obstacle(this.world, 'horizontal', canvas.width - 80, canvas.height - 110 - 35 / 2, Level.#OBSTACLE_ID)
		);

		// bottom ground for collision
		const groundBodyDef = new _Box2D.b2BodyDef();
		groundBodyDef.set_type(_Box2D.b2_staticBody);
		groundBodyDef.set_position(new _Box2D.b2Vec2(-canvas.width, canvas.height));
		this.groundBody = this.world.CreateBody(groundBodyDef);

		this.groundShape = new _Box2D.b2EdgeShape();
		this.groundShape.set_m_vertex1(new _Box2D.b2Vec2(0, 0));
		this.groundShape.set_m_vertex2(new _Box2D.b2Vec2(canvas.width * 3, 0));

		const groundFixtureDef = new _Box2D.b2FixtureDef();
		groundFixtureDef.set_shape(this.groundShape);
		groundFixtureDef.set_friction(0.5);
		groundFixtureDef.set_userData(Level.#GROUND_ID);
		this.groundFixture = this.groundBody.CreateFixture(groundFixtureDef);
	}

	update() {
		if (keyboardWasPressed('r')) {
			gStateMachine.changeState('start');
		}

		this.launchMarker.update();

		const timeStep = 1 / 30;
		const velocityIterations = 20;
		const positionIterations = 10;

		this.world.Step(timeStep, velocityIterations, positionIterations);

		// do not destroy / remove body before the world.Step otherwise error
		this.destroyedBody.forEach(body => {
			if (body.IsActive()) body.SetActive(false);
		});

		// reset the body reference
		this.destroyedBody = [];

		// remove alien (enemy) if they destroyed
		for (let i = this.aliens.length - 1; i >= 0; i--) {
			if (!this.aliens[i].body.IsActive()) {
				this.aliens.splice(i, 1);
				gSounds.kill.stop();
				gSounds.kill.play();
			}
		}

		// remove obstacle if they are not active anymore
		for (let i = this.obstacles.length - 1; i >= 0; i--) {
			if (!this.obstacles[i].body.IsActive()) {
				this.obstacles.splice(i, 1);

				const soundNum = Math.floor(Math.random() * 5 + 1);
				gSounds['break' + soundNum].stop();
				gSounds['break' + soundNum].play();
			}
		}

		// restart alien trajectory if alien (player) is already too slow or stop
		if (this.launchMarker.launched) {
			const { x: xPos, y: _ } = this.launchMarker.alien.body.GetPosition();
			const { x: xVel, y: yVel } = this.launchMarker.alien.body.GetLinearVelocity();

			// restart if our player going to left screen or player is nearly too slow
			if (xPos < 0 || Math.abs(xVel) + Math.abs(yVel) < 1.5) {
				this.launchMarker.alien.body.SetActive(false);
				this.launchMarker = new AlienLaunchMarker(this.world, Level.#PLAYER_ID);

				// re-start game if alien (enemy) is no more left
				if (this.aliens.length === 0) {
					gStateMachine.changeState('start');
				}
			}
		}
	}

	render() {
		this.launchMarker.render();

		this.aliens.forEach(alien => alien.render());

		this.obstacles.forEach(obstacle => obstacle.render());
	}
}
