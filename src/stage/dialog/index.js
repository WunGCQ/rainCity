import { templateStr,emptyTemplateStr } from './template';
import { Visualizer } from './Visualizer';
import { getState } from '../../state';
import {load} from './Player/load';
import {iOSLoad,clearContext} from './Player/iOSLoad';
import {rainDrops} from '../scene/drops/dropTypes';
const state = getState();
const isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
//const loadFunc = isiOS ? iOSLoad : load;
const loadFunc = iOSLoad;
const root = $('#root');
function insertDialog(index) {
	const data = rainDrops[index]; //点击水滴的信息
	const domString = _.template(data.last? emptyTemplateStr : templateStr)({
		index: index,
		audio: '',
		position: data.position, //地点
		content: data.content, //文字内容
		user: data.user, //用户名
		time: data.time //时间
	});
	root.append(domString);
}

export function showShare(ev) {
	ev && ev.preventDefault();
	const div = document.createElement('div');

	div.className = 'g-share-tip';
	root.get(0).appendChild(div);

	div.addEventListener('touchstart', function (ev) {
		ev.preventDefault();
	});
	div.addEventListener('touchend', hideShare);
}

function hideShare() {
	const div = document.getElementsByClassName('g-share-tip')[0];
	if (div) {
		div.parentNode.removeChild(div);
	}
}

export const showDialog = (function () {

	return function (i, me) {
		if (getState().haveOpening) {
			return;
		}
		insertDialog(i);

		const el       = $('#dialog_' + i),
		      content  = $('.m-dialog-content-text', el),
		      closeBtn = $('.m-close-btn', el);
        let showQR = false;
        closeBtn.on('touchstart', function (ev) {
            ev && ev.preventDefault();
            if (showQR) {
                showQR = false;
                $('.m-qr-block', el).removeClass('show');
            } else {
                clearContext();
                me && (me.lockMove = false);
	            getState().haveOpening= false;
                el.removeClass('show');
                el.remove();
            }
        });
		if(rainDrops[i].last) {
			return;
		}
		const top = content.get(0).offsetTop, maxHeight = 430 - top - 10;
		content.css('height', maxHeight + 'px').css('overflow', 'auto');
		const btn = $('.m-play-btn', el).get(0), qrBtn = $('.m-share-qr-btn', el);
		$('.m-share-tip-btn', el).on('touchstart', showShare);
         showQR =  function () {
                $('.m-qr-block', el).addClass('show');
                showQR = true;
            };

		qrBtn.on('touchstart',showQR );

		if (getState().haveOpening) {
			return;
		}
		//el.on('touchstart',function(ev){
		const content_el = content.get(0);
		content.on('touchstart', function (ev) {
			ev.preventDefault();
			content.lastY = ev.touches[0].pageY;
			//console.log(content.lastY);
		});
		content.on('touchmove', function (ev) {
			ev.stopPropagation();
			const deltaY = ev.touches[0].pageY - content.lastY;
			content.lastY += deltaY;
			content_el.scrollTop -= deltaY;
		});
		content.on('touchend', function (ev) {
			ev.stopPropagation();
		});
		el.addClass('show');
		me && (me.lockMove = true);
		const musicURL = `${process.env.CDN_PREFIX}/media/${rainDrops[i].file}.mp3`;
		loadFunc(btn, musicURL);
		getState().haveOpening = true;
	};
})();

