export class StateMachine {
	constructor(states) {
		this.empty = {
			enter: function () {},
			exit: function () {},
			update: function () {},
			render: function () {},
		};

		this.current = this.empty;
		this.states = states;
	}

	changeState(stateName, enterParams) {
		if (this.states[stateName] == null) throw new Error('state not exist !');

		this.current.exit();
		this.current = this.states[stateName]();
		this.current.enter(enterParams);
	}

	update() {
		this.current.update();
	}

	render() {
		this.current.render();
	}
}
