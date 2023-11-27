class _QuadImage {
	constructor(imageObj, srcStartX, srcStartY, width, height) {
		this.imageObj = imageObj;
		this.srcStartX = srcStartX;
		this.srcStartY = srcStartY;
		this.width = width;
		this.height = height;
	}

	drawImage(context, dx, dy) {
		context.drawImage(
			this.imageObj,
			this.srcStartX,
			this.srcStartY,
			this.width,
			this.height,
			dx,
			dy,
			this.width,
			this.height
		);
	}
}

export function newImage(src) {
	const imgElement = new Image();
	imgElement.src = src;

	return new Promise((resolve, reject) => {
		imgElement.onload = () => resolve(imgElement);
		imgElement.onerror = e => reject(e);
	});
}

export function newQuad(imageObj, srcStartX, srcStartY, width, height) {
	return new _QuadImage(imageObj, srcStartX, srcStartY, width, height);
}

export function generateQuads(imageObj, tileWidth, tileHeight) {
	const imgWidth = imageObj.width / tileWidth;
	const imgHeight = imageObj.height / tileHeight;

	let sheetCounter = 0;
	const spriteSheet = {};

	for (let y = 0; y < imgHeight; y++) {
		for (let x = 0; x < imgWidth; x++) {
			spriteSheet[sheetCounter] = new _QuadImage(imageObj, x * tileWidth, y * tileHeight, tileWidth, tileHeight);
			sheetCounter++;
		}
	}

	return spriteSheet;
}

export function newHowler(src, loop = false) {
	return new Howl({
		src: [src],
		loop: loop,
	});
}
