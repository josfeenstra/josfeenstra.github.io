// Helpers

function imageDataToHex(index, imageData) {
	let r = imageData[index];
	let g = imageData[index + 1];
	let b = imageData[index + 2];

	let hr = r.toString(16);
	let hg = g.toString(16);
	let hb = b.toString(16);

	hr = (hr.length == 1) ? "0" + hr : hr;
	hg = (hg.length == 1) ? "0" + hg : hg;
	hb = (hb.length == 1) ? "0" + hb : hb;

	return "#" + hr + hg + hb;
}

