let clamp = (n, min, max) => Math.min(Math.max(n, min), max);

let randInt = (min, exMax) => min + Math.floor(Math.random() * (exMax - min));

let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

let rotatingSlice = (a, start, end) => {
	if (start < 0 && end > a.length)
		return a.slice(start).concat(a.slice(0, end));
	if (start < 0)
		return a.slice(start).concat(a.slice(0, end));
	else if (end > a.length)
		return a.slice(start).concat(a.slice(0, end % a.length));
	else
		return a.slice(start, end);
};

let tryJsonParse = maybeString => {
	try {
		return JSON.parse(maybeString);
	} catch {
		return null;
	}
};

let updateListEl = (containerEl, contents, createHandler, updateHandler) => {
	let els = [...containerEl.children];
	contents.forEach((content, i) => {
		let el;
		if (i >= els.length) {
			el = createHandler(i);
			if (el)
				containerEl.appendChild(el);
		} else
			el = els[i];
		if (el)
			updateHandler(el, content, i);
	});
	els
		.filter((_, i) => i >= contents.length)
		.forEach(el => el.remove());
};

module.exports = {clamp, randInt, sleep, rotatingSlice, tryJsonParse, updateListEl};
