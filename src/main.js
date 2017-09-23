import { init as initStage } from './stage';
import { initBall } from './ball';
import { initLoading } from './loading';
import { initRain } from './rain';
import { getState } from './state';
import './style/main.less';

if (process.env.NODE_ENV != 'development') {
	window.location.hash = '';
}
const pathname = window.location.pathname;

$(window).on('stage_show', function () {
	getState().current = 3;
	initStage();
});
$(window).on('ball_show', function () {
	getState().current = 2;
	initBall();
});
$(window).on('loading_show', function () {
	window.location.hash = '#1';
	getState().current = 1;
	initLoading();
});
$(window).on('index_show', function () {
	getState().current = 0;
	window.location.hash = '#0';
	initRain();
});
$(window).on('rain_show', function () {
	getState().current = 0;
	window.location.hash = '#0';
	initRain();
});

if (process.env.NODE_ENV == 'development') {
	function match(str) {
		if (window.location.href.indexOf(str + '_test') > -1) {
			$(window).trigger(`${str}_show`);
		}
	}

	//initRain();
	match('loading');
	match('ball');
	match('stage');
	match('index');
	if (window.location.pathname.indexOf('index') > -1) {
		initRain();
	}
} else {
	const { hash } = window.location;
	if (hash == '#1') {
		initLoading();
	} else {
		initRain();
	}
}
var old_href = window.location.href + '';
setInterval(function () {
	if (window.location.href != old_href) {
		old_href = window.location.href + '';
	}
}, 1000);

window.onhashchange = function () {
	const [foo, hash = '0'] = window.location.hash.split('#');
	const current = getState().current;
	if (hash == current) return;
	if (current != 3) return;
	if (hash == 0) {
		initRain();
	} else if (hash == 1) {
		initLoading();
	} else if (hash == 2) {
		initBall();
	} else if (hash == 3) {
		initStage();
	}
};