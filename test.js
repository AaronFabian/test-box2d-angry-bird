'use strict';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1080;
canvas.height = 720;
let _Box2D = null; // do not animate anything before Box2D is ready

class Ball {
	constructor(body, fixture) {
		this.body = body;
		this.fixture = fixture;

		// console.log(this.body.GetWorldPoint());
		// console.log(this.body.GetPosition());
	}

	update() {}

	render() {
		const radius = this.fixture.shape.m_radius;
		const { x, y } = this.body.GetWorldPoint();

		ctx.arc(x, y, radius, 0, Math.PI * 2);
		ctx.stroke();
		console.log(this.body.GetAngle());
	}
}

class Person {}

class Edge {
	constructor(body, fixture, shape) {
		this.body = body;
		this.fixture = fixture;
		this.shape = shape;
	}

	update() {}

	render() {
		const { x: x1, y: y1 } = this.body.GetWorldPoint();

		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(canvas.width, canvas.height);

		// Draw the Path
		ctx.stroke();
		ctx.closePath();
	}
}

let world = null;

let ground = null;
let rightWall = null;
const balls = [];

async function load() {
	_Box2D = await Box2D();

	console.log(_Box2D);
	world = new _Box2D.b2World();

	const gravity = new _Box2D.b2Vec2(0, 30);
	world.SetGravity(gravity);

	const listener = new _Box2D.JSContactListener();
	listener.BeginContact = function (contactPtr) {
		const contact = _Box2D.wrapPointer(contactPtr, _Box2D.b2Contact);
		const fixtureA = contact.GetFixtureA();
		const fixtureB = contact.GetFixtureB();

		// -----------------------------------
		const types = {};
		types[fixtureA.GetUserData()] = true;
		types[fixtureB.GetUserData()] = true;

		if (types[999] && types[69]) {
			console.log('ok');
			const velocity = new _Box2D.b2Vec2(500, -500);
			fixtureB.GetBody().SetLinearVelocity(velocity);
		}

		// console.log(fixtureA.GetUserData());
		// console.log(fixtureB.GetUserData());
	};

	// Empty implementations for unused methods.
	listener.EndContact = function () {};
	listener.PreSolve = function () {};
	listener.PostSolve = function () {};

	world.SetContactListener(listener);

	// circle
	const circleSd = new _Box2D.b2CircleShape();
	circleSd.m_radius = 20;

	const bodyDef = new _Box2D.b2BodyDef();
	bodyDef.type = _Box2D.b2_dynamicBody;
	// bodyDef.angularDamping = 1;
	bodyDef.position.Set(50, 150);

	const body = world.CreateBody(bodyDef);

	const fixtureDef = new _Box2D.b2FixtureDef();
	fixtureDef.shape = circleSd;
	fixtureDef.density = 0.5;
	fixtureDef.userData = 999;
	// fixtureDef.friction = 0.3;

	body.CreateFixture(fixtureDef);

	balls.push(new Ball(body, fixtureDef));

	// ground
	const groundShape = new _Box2D.b2EdgeShape();
	groundShape.Set(new _Box2D.b2Vec2(0, 0), new _Box2D.b2Vec2(canvas.width, 0));
	// groundShape.Set(new _Box2D.b2Vec2(0, 0), new _Box2D.b2Vec2(canvas.width, 0 + 100));
	// m_vertex1
	// m_vertex2
	// console.log(groundShape.m_vertex2.get_y());

	const groundBodyDef = new _Box2D.b2BodyDef();
	groundBodyDef.type = _Box2D.b2_staticBody;
	groundBodyDef.position.Set(0, canvas.height);
	// groundBodyDef.position.Set(0, canvas.height - 100);

	const groundFixtureDef = new _Box2D.b2FixtureDef();
	groundFixtureDef.shape = groundShape;
	groundFixtureDef.friction = 0.1;
	groundFixtureDef.restitution = 0.5; // Set restitution here, not in bodyDef
	groundFixtureDef.userData = 69;

	const groundBody = world.CreateBody(groundBodyDef);
	groundBody.CreateFixture(groundFixtureDef);
	ground = new Edge(groundBody, groundFixtureDef, groundShape);

	// right wall
	const rightWallShape = new _Box2D.b2EdgeShape();
	rightWallShape.Set(new _Box2D.b2Vec2(0, 0), new _Box2D.b2Vec2(0, canvas.height));

	const rightWallBodyDef = new _Box2D.b2BodyDef();
	rightWallBodyDef.type = _Box2D.b2_staticBody;
	rightWallBodyDef.position.Set(canvas.width, 0);

	const rightWallFixtureDef = new _Box2D.b2FixtureDef();
	rightWallFixtureDef.shape = rightWallShape;
	rightWallFixtureDef.restitution = 0.5;
	rightWallFixtureDef.userData = 69;

	const rightWallBody = world.CreateBody(rightWallBodyDef);
	rightWallBody.CreateFixture(rightWallFixtureDef);
	rightWall = new Edge(rightWallBody, rightWallFixtureDef, rightWallShape);
}

function animation() {
	requestAnimationFrame(animation);
	if (!_Box2D) return;

	update();
	draw();
}

function update() {
	const timeStep = 1 / 60;
	const velocityIterations = 6;
	const positionIterations = 2;

	world.Step(timeStep, velocityIterations, positionIterations);
}

function draw() {
	ctx.reset();

	balls.forEach(ball => ball.render());
	ground.render();
}

load();
animation();
