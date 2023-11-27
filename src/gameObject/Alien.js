import { keyboardWasPressed } from '../index.js';

export class Alien {
	constructor(
		world,
		type = 'square',
		x = Math.floor(Math.random() * canvas.width),
		y = Math.floor(Math.random() * canvas.height),
		userData
	) {
		this.world = world;
		this.type = type;

		// body
		const alienBodyDef = new _Box2D.b2BodyDef();
		alienBodyDef.set_type(_Box2D.b2_dynamicBody);
		alienBodyDef.set_position(new _Box2D.b2Vec2(x, y));

		this.body = this.world.CreateBody(alienBodyDef);
		// this.body.SetTransform(new _Box2D.b2Vec2(x, y), Math.PI); // 45deg

		// shape
		if (this.type === 'square') {
			this.shape = new _Box2D.b2PolygonShape();
			this.shape.SetAsBox(17.5, 17.5);
			this.sprite = Math.floor(Math.random() * 5);
		} else {
			this.shape = new _Box2D.b2CircleShape();
			this.shape.set_m_radius(17.5);
			this.sprite = 8;
		}

		// fixture
		const alienFixtureDef = new _Box2D.b2FixtureDef();
		alienFixtureDef.set_shape(this.shape);
		alienFixtureDef.set_density(1);
		// alienFixtureDef.set_friction(0.3);
		// alienFixtureDef.set_restitution(0.5);
		alienFixtureDef.set_userData(userData);
		this.fixture = this.body.CreateFixture(alienFixtureDef);
	}

	render() {
		const { x, y } = this.body.GetPosition();
		const angle = this.body.GetAngle();

		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(angle);
		gFrames.aliens[this.sprite].drawImage(ctx, -17.5, -17.5);
		ctx.restore();

		// gFrames.aliens[this.sprite].drawImage(ctx, x - 17.5, y - 17.5);
	}
}

// alienBodyDef.gravityScale = 0.4;
// alienBodyDef.angularVelocity = 0.;

// this.alien.body.SetLinearDamping(0);
// this.alien.body.ApplyForce(new _Box2D.b2Vec2(10, -10), this.alien.body.GetWorldCenter(), true);

// const massData = new _Box2D.b2MassData();
// massData.mass = 0.1;
// this.alien.body.SetMassData(massData);

// var aabb = new _Box2D.b2AABB();
// var d = 0.001;
// aabb.set_lowerBound(new _Box2D.b2Vec2(input.mouse.x - d, input.mouse.y - d));
// aabb.set_upperBound(new _Box2D.b2Vec2(input.mouse.x + d, input.mouse.y + d));
// let myQueryCallback = {};
// myQueryCallback.m_fixture = null;
// myQueryCallback.m_point = new _Box2D.b2Vec2(input.mouse.x, input.mouse.y);
// this.world.QueryAABB(myQueryCallback, aabb);

// // var body = myQueryCallback.m_fixture.GetBody();

// const mouseJointGroundBody = this.world.CreateBody(new _Box2D.b2BodyDef());
// const md = new _Box2D.b2MouseJointDef();
// md.set_bodyA(mouseJointGroundBody);
// md.set_bodyB(null);
// md.set_target(new _Box2D.b2Vec2(input.mouse.x, input.mouse.y));
// md.set_maxForce(1000);
// md.set_collideConnected(true);
// this.mouseJoint = _Box2D.castObject(this.world.CreateJoint(md), _Box2D.b2MouseJoint);
// // body.SetAwake(true);
