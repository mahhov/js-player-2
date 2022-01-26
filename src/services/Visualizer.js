class Visualizer {
	#width;
	#height;
	#canvasCtx;
	#smoothValues;
	#lowSmoothValues;
	#xMargin;
	#yMargin;
	#barSpace;
	#barWidth;
	#minBarHeight;
	#maxBarHeight;

	constructor(width, height, canvasCtx, barCount) {
		this.#width = width;
		this.#height = height;
		this.#canvasCtx = canvasCtx;
		this.#smoothValues = Array(barCount).fill(0);
		this.#lowSmoothValues = Array(barCount).fill(0);

		this.clearColor = [0, 0, 0];
		this.leftColor = [255, 0, 0];
		this.rightColor = [0, 0, 255];
		this.leftSmoothColor = [255, 150, 100];
		this.rightSmoothColor = [100, 150, 255];
		this.leftLowSmoothColor = [200, 0, 0];
		this.rightLowSmoothColor = [0, 0, 200];
		this.blurColor = [200, 100, 200];
		this.smoothWeight = .98;
		this.lowSmoothValueMult = .8;
		this.blur = .05;

		this.#xMargin = this.#width * .03;
		this.#yMargin = this.#height * .1;
		this.#barSpace = (this.#width - this.#xMargin * 2) / barCount;
		this.#barWidth = this.#barSpace * .75;
		this.#minBarHeight = this.#height * .01;
		this.#maxBarHeight = (this.#height - this.#minBarHeight - this.#yMargin * 2) * (1 - this.blur);
	}

	static averageColor(c1, c2, weight) {
		return Visualizer.rgb(...c1.map((c, i) => c * (1 - weight) + c2[i] * weight));
	}

	static rgb(r, g, b) {
		return `rgb(${r}, ${g}, ${b})`;
	}

	draw(values) {
		this.#smoothValues = this.#smoothValues
			.map((value, i) => value * this.smoothWeight + values[i] * (1 - this.smoothWeight))
			.map((value, i) => Math.max(value, values[i]));

		this.#lowSmoothValues = this.#lowSmoothValues
			.map((value, i) => value * this.smoothWeight + values[i] * (1 - this.smoothWeight))
			.map((value, i) => Math.min(value, values[i]));

		this.#canvasCtx.fillStyle = Visualizer.rgb(...this.clearColor);
		this.#canvasCtx.fillRect(0, 0, this.#width, this.#height);

		values.forEach((value, i) => {
			let gradient = i / values.length;
			let barHeight = value * this.#maxBarHeight + this.#minBarHeight;
			let left = i * this.#barSpace + this.#xMargin + (this.#barSpace - this.#barWidth) / 2;
			let top = this.#height - barHeight - this.#yMargin;
			let smoothHeight = (this.#smoothValues[i] - value) * this.#maxBarHeight;
			let lowSmoothHeight = this.#lowSmoothValues[i] * this.#maxBarHeight * this.lowSmoothValueMult;
			let blurHeight = barHeight * this.blur;

			if (smoothHeight > 0) {
				this.#canvasCtx.fillStyle = Visualizer.averageColor(this.leftSmoothColor, this.rightSmoothColor, gradient);
				this.#canvasCtx.fillRect(left, top - smoothHeight, this.#barWidth, smoothHeight);
			}

			this.#canvasCtx.fillStyle = Visualizer.averageColor(this.leftColor, this.rightColor, gradient);
			this.#canvasCtx.fillRect(left, top, this.#barWidth, barHeight);

			this.#canvasCtx.fillStyle = Visualizer.averageColor(this.leftLowSmoothColor, this.rightLowSmoothColor, gradient);
			this.#canvasCtx.fillRect(left, top + barHeight - lowSmoothHeight, this.#barWidth, lowSmoothHeight);

			this.#canvasCtx.fillStyle = Visualizer.rgb(...this.blurColor);
			this.#canvasCtx.fillRect(left, top - blurHeight, this.#barWidth, blurHeight);
		});
	}
}

module.exports = Visualizer;
