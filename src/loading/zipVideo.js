const urls = [];

function draw() {
	//remove broken frame
	const frames = urls.filter(x => x);
	const c = $('#root .video').get(0);
	c.className += ' playing';
	const w = window.innerWidth, h = window.innerHeight;
	const ctx = c.getContext('2d');
	const len = frames.length;
	let i = 0;

	const s = setInterval(function () {
		i++;
		if(frames[i]) {
			const image = new Image();
			image.onload = function () {
				ctx.drawImage(image, 0, 0, 320, 504);
			};
			image.onerror = function(){
				debugger;
			};
			image.src = frames[i];
		}
		if (i >= len) {
			$(window).trigger('ball_show');
			clearInterval(s);
		}
	}, 16);
}

const genUrl = (URL || webkitURL).createObjectURL;

export function parseImages(zip) {
	let loaded = 0;
	const len = _.size(zip.files) - 1;
	for (var name in zip.files) {
		if (name !== 'video/') {
			const index = name.match(/\d+/)[0] - 0 - 1;
			const file = zip.files[name];
			((i) => file.async('blob').then(res => {
				loaded++;
				urls[i] = genUrl(res);
				if (loaded >= len) {
					draw();
				}
			}).catch(e => {
				console.error(e);
				loaded++;
				if (loaded >= len) {
					draw();
				}
			}))(index);
		}
	}
}
