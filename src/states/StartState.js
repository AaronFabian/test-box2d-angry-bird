import { Background } from '../UI/Background.js';
import { Alien } from '../gameObject/Alien.js';
import { keyboardWasPressed, mouseWasPressed } from '../index.js';
import { BaseState } from './BaseState.js';

export class StartState extends BaseState {
	constructor() {
		super();

		this.background = new Background();

		// our world at this state
		this.world = new _Box2D.b2World();
		this.world.SetGravity(new _Box2D.b2Vec2(0, 30));

		// ground
		// - define body for ground and register it to box2d world
		// - define ground shape
		// - define fixture and apply shape to fixture

		// bottom ground
		const groundBodyDef = new _Box2D.b2BodyDef();
		groundBodyDef.set_type(_Box2D.b2_staticBody);
		groundBodyDef.set_position(new _Box2D.b2Vec2(0, canvas.height));
		this.groundBody = this.world.CreateBody(groundBodyDef);

		this.groundShape = new _Box2D.b2EdgeShape();
		this.groundShape.set_m_vertex1(new _Box2D.b2Vec2(0, 0));
		this.groundShape.set_m_vertex2(new _Box2D.b2Vec2(canvas.width, 0));

		const groundFixtureDef = new _Box2D.b2FixtureDef();
		groundFixtureDef.set_shape(this.groundShape);
		this.groundFixture = this.groundBody.CreateFixture(groundFixtureDef);

		// left edge
		const leftEdgeBodyDef = new _Box2D.b2BodyDef();
		leftEdgeBodyDef.set_type(_Box2D.b2_staticBody);
		leftEdgeBodyDef.set_position(new _Box2D.b2Vec2(0, 0));
		this.leftEdgeBody = this.world.CreateBody(leftEdgeBodyDef);

		this.leftEdgeShape = new _Box2D.b2EdgeShape();
		this.leftEdgeShape.set_m_vertex1(new _Box2D.b2Vec2(0, 0));
		this.leftEdgeShape.set_m_vertex2(new _Box2D.b2Vec2(0, canvas.height));

		const leftEdgeFixtureDef = new _Box2D.b2FixtureDef();
		leftEdgeFixtureDef.set_shape(this.leftEdgeShape);
		this.leftEdgeFixture = this.leftEdgeBody.CreateFixture(leftEdgeFixtureDef);

		// right edge
		const rightEdgeBodyDef = new _Box2D.b2BodyDef();
		rightEdgeBodyDef.set_type(_Box2D.b2_staticBody);
		rightEdgeBodyDef.set_position(new _Box2D.b2Vec2(canvas.width, 0));
		this.rightEdgeBody = this.world.CreateBody(rightEdgeBodyDef);

		this.rightEdgeShape = new _Box2D.b2EdgeShape();
		this.rightEdgeShape.set_m_vertex1(new _Box2D.b2Vec2(0, 0));
		this.rightEdgeShape.set_m_vertex2(new _Box2D.b2Vec2(0, canvas.height));

		const rightEdgeFixtureDef = new _Box2D.b2FixtureDef();
		rightEdgeFixtureDef.set_shape(this.rightEdgeShape);
		this.rightEdgeFixture = this.rightEdgeBody.CreateFixture(rightEdgeFixtureDef);

		// generate a bunch of aliens
		this.aliens = [];
		for (let i = 1; i <= 100; i++) {
			this.aliens.push(new Alien(this.world));
		}

		// ui decoration
		this.blink = false;
		this.blinkOpacity = 1;
		this.blinkIntervalId = setInterval(() => {
			new Tween(this).to({ blinkOpacity: this.blink ? 1 : 0 }, 1000).start();
			this.blink = !this.blink;
		}, 1000);
	}

	update() {
		if (mouseWasPressed(1)) {
			gStateMachine.changeState('play');
		}

		if (keyboardWasPressed('s')) {
			this.aliens.forEach(alien => {
				const shakePower = -(Math.random() * 100);
				const shakeDirection = Math.random() >= 0.5 ? shakePower : -shakePower;
				alien.body.SetLinearVelocity(new _Box2D.b2Vec2(shakeDirection, shakePower));
				// this.groundBody.ApplyForceToCenter(force);
			});
		}

		const timeStep = 1 / 30;
		const velocityIterations = 20;
		const positionIterations = 10;

		this.world.Step(timeStep, velocityIterations, positionIterations);
	}

	render() {
		this.background.render();

		this.aliens.forEach(alien => alien.render());

		ctx.fillStyle = 'rgba(64,64,64,0.5)';
		ctx.fillRect(canvas.width / 2 - 164, canvas.height / 2 - 40, 328, 108);

		// text
		ctx.font = '40px fontTTF';
		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';
		ctx.fillText('Angry Alien', canvas.width / 2, canvas.height / 2);

		ctx.font = '20px fontTTF';
		ctx.fillText('Click to start !', canvas.width / 2, canvas.height / 2 + 40);

		ctx.fillStyle = 'rgba(64,64,64,0.5)';
		ctx.fillRect(10, 10, 152, 30);

		ctx.fillStyle = `rgba(255,255,255,${this.blinkOpacity})`;
		ctx.font = '14px fontTTF';
		ctx.textAlign = 'left';
		ctx.fillText('press s to shake', 20, 28);
	}

	exit() {
		clearInterval(this.blinkIntervalId);
	}
}
