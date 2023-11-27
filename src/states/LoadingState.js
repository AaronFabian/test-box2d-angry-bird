import { BaseState } from './BaseState.js';

export class LoadingState extends BaseState {
	render() {
		ctx.fillStyle = '#000000';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.font = '30px';
		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';
		ctx.fillText('Loading', canvas.width / 2, canvas.height / 2);
	}
}
