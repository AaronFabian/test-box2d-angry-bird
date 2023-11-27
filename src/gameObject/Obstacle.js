export class Obstacle {
	constructor(
		world,
		type = 'horizontal',
		x = Math.floor(Math.random() * canvas.width),
		y = Math.floor(Math.random() * canvas.height),
		userData
	) {
		this.world = world;

		if (type === 'horizontal') this.frame = 1;
		else if (type === 'vertical') this.frame = 3;

		this.startX = x;
		this.startY = y;

		if (type === 'horizontal') {
			this.width = 110;
			this.height = 35;
		} else if (type === 'vertical') {
			this.width = 35;
			this.height = 110;
		}

		const bodyDef = new _Box2D.b2BodyDef();
		bodyDef.set_type(_Box2D.b2_dynamicBody);
		bodyDef.set_position(new _Box2D.b2Vec2(this.startX, this.startY));
		this.body = this.world.CreateBody(bodyDef);

		this.shape = new _Box2D.b2PolygonShape();
		this.shape.SetAsBox(this.width / 2, this.height / 2);

		const fixtureDef = new _Box2D.b2FixtureDef();
		fixtureDef.set_shape(this.shape);
		fixtureDef.set_density(1);
		fixtureDef.set_userData(userData);
		this.fixture = this.body.CreateFixture(fixtureDef);
	}

	update() {}

	render() {
		const { x, y } = this.body.GetPosition();
		const angle = this.body.GetAngle();

		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(angle);
		gFrames.woods[this.frame].drawImage(ctx, -this.width / 2, -this.height / 2);
		ctx.restore();

		// gFrames.woods[this.frame].drawImage(ctx, x - this.width / 2, y - this.height / 2);
	}
}
