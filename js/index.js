var $ = function (selector) {
    return document.querySelector(selector);
}

var $$ = function (selector) {
    return document.querySelectorAll(selector);
}

//全局变量和元素获取
var musicObj = null;
var audio = new Audio();
var songName = $('.name');
var avatar = $('.avatar');
var lastBtn = $('.btn-back');
var playBtn = $('.btn-play');
var nextBtn = $('.btn-next');
var listBtn = $('.btn-list');
var progress = $('.progress');
var pCur = $('.current');
var volBtn = $('.vol')
var volSlid = $('.volume')
var vol = $('.vol-control');
var volCur = $('.vol-current')
var cursor = $('.cursor');
var listWrap = $('.list-wrap')
var listEl = $('.song-list');
var disEl = $('.disabled');
var isContinue = false;
var allLi = null;
var playEl = null;
var playNum = 0;
var duration = 0;
var dontPlayYet = true;

//播放器初始化
function resetPlayer(obj) {
    audio.volume = 0.3;
    setList(obj);
    allLi = $$('.song');
    play(true);
}

//生成歌曲列表
function setList(obj) {
    for (var i = 0; i < obj.length; i++) {
        var li = document.createElement('li');
        var songStr = obj[i].name + `-` + obj[i].artist;
        li.innerText = songStr;
        li.setAttribute('data-name', songStr);
        li.setAttribute('data-img', obj[i].image);
        li.setAttribute('data-src', obj[i].src);
        li.setAttribute('data-num', i);
        li.className = 'song'

        var hear = document.createElement('i');
        hear.className = 'fa fa-headphones';

        li.appendChild(hear);
        listEl.appendChild(li);
    }
}


//请求歌曲列表并初始化播放器
function getMusicList(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://www.clloz.com/study/musicPlayer/music.json', true);
    xhr.send();
    xhr.onload = function () {
        musicObj = JSON.parse(xhr.responseText)
        callback(musicObj)
    }
}
getMusicList(resetPlayer);

//点击播放按钮
playBtn.addEventListener('click', function () {
    dontPlayYet = false;
    if (this.classList.contains('pause')) {
        audio.play();
        this.classList.remove('pause')
        this.classList.add('play');
        allLi[playNum].classList.add('play');
    } else {
        audio.pause();
	isContinue = false;
        this.classList.remove('play')
        this.classList.add('pause');
    }
})

//点击上一首
lastBtn.addEventListener('click', function () {
    allLi[playNum].classList.remove('play');
    !!playNum ? playNum -= 1 : playNum = musicObj.length - 1;
    allLi[playNum].classList.add('play');
    play(false);
})

//点击下一首
nextBtn.addEventListener('click', function () {
    allLi[playNum].classList.remove('play');
    playNum === (musicObj.length - 1) ? playNum = 0 : playNum += 1;
    allLi[playNum].classList.add('play');
    play(false);
})

//点击歌曲列表按钮
listBtn.addEventListener('click', function () {
    listWrap.classList.contains('hide') ? listWrap.classList.remove('hide') : listWrap.classList.add('hide');
})

//点击歌曲
listEl.addEventListener('click', function (e) {
    if (e.target.tagName.toLowerCase() === 'li' && parseInt(e.target.getAttribute('data-num')) !== playNum) {
        allLi[playNum].classList.remove('play');
        playNum = parseInt(e.target.getAttribute('data-num'));
        allLi[playNum].classList.add('play');
        play(false);
    } else if (playNum === 0 && dontPlayYet === true) {
	allLi[playNum].classList.add('play');
        play(false);
    }
})

//点击进度条
progress.addEventListener('click', function (e) {
    audio.currentTime = e.offsetX / 200 * duration;
    if (playBtn.classList.contains('pause')) {
        playBtn.classList.remove('pause')
        playBtn.classList.add('play');
    }
    audio.play();
})

pCur.addEventListener('click', function (e) {
    audio.currentTime = e.offsetX / 200 * duration;
    if (playBtn.classList.contains('pause')) {
        playBtn.classList.remove('pause')
        playBtn.classList.add('play');
    }
    audio.play();
})

//点击音量按钮
volBtn.addEventListener('click', function () {
    volSlid.classList.contains('show') ? volSlid.classList.remove('show') : volSlid.classList.add('show');
})

//拖动音量
// cursor.addEventListener('mousedown', function (e) {
//     var pointY = e.pageY;
//     function fnMove(e) {
//         var pointY1 = e.pageY;
//         if(pointY1 < pointY && pointY1 >= pointY - 40) {
//             volCur.style.height = (pointY - pointY1) + `px`;
//             volCur.style.top = (pointY1 - pointY) + `px`;
//             cursor.style.top = (-7 - pointY + pointY1) + `px`;
//         }
//     }
//     function fnEnd() {
//         document.removeEventListener('mousemove', fnMove, false);
//         document.removeEventListener('mouseup', fnEnd, false);
//     }
//     document.addEventListener('mousemove', fnMove, false);
//     document.addEventListener('mouseup', fnEnd, false);
// })

//点击切换音量
vol.addEventListener('click', function (e) {
    audio.volume = parseFloat((35 - e.offsetY) / 35);
    volCur.style.height = (35 - e.offsetY) + `px`;
    volCur.style.top = (e.offsetY - 35) + `px`;
})
volCur.addEventListener('click', function (e) {
    var h = parseInt(window.getComputedStyle(volCur).getPropertyValue('height').substr(0, 2));
    volCur.style.height = (h - e.offsetY) + `px`;
    volCur.style.top = (e.offsetY - h) + `px`;
    audio.volume = parseFloat((h - e.offsetY) / 35);
})

//点击上一首下一首或歌曲列表
function play(isReset) {
    songName.innerText = musicObj[playNum].name + `-` + musicObj[playNum].artist;
    audio.src = musicObj[playNum].src;
    avatar.src = musicObj[playNum].image;

    if (!isReset) {
	dontPlayYet = false;
        pCur.style.width = 0;
        if (playBtn.classList.contains('pause')) {
            playBtn.classList.remove('pause')
            playBtn.classList.add('play');
        }
        audio.play();
    }
}

// audio.load();
audio.oncanplay = function () {
    console.log('reset');
    duration = audio.duration;
    var minute = parseInt(audio.duration / 60);
    var second = parseInt(audio.duration % 60);
    if (audio.currentTime === 0) {
	progress.setAttribute('data-time', `00:00/` + minute + `:` + second);
    }
}

audio.ontimeupdate = function () {
    var minute_d = parseInt(audio.duration / 60);
    var second_d = parseInt(audio.duration % 60);
    var minute = parseInt(audio.currentTime / 60);
    var second = parseInt(audio.currentTime % 60);
    minute = minute < 10 ? `0` + minute : minute;
    second = second < 10 ? `0` + second : second;
    if (audio.currentTime >= 1) {
        progress.setAttribute('data-time', minute + `:` + second + `/` + minute_d + `:` + second_d);
        pCur.style.width = parseInt(audio.currentTime / audio.duration * 200) + `px`;
    }
}

audio.onended = function () {
    var event = new Event('click');
    nextBtn.dispatchEvent(event);
}

//online offline
window.onoffline = function () {
    console.log("offline")
    disEl.classList.add('show');
    var event = new Event('click');
    listBtn.dispatchEvent(event);
    if (!audio.paused) {
	playBtn.dispatchEvent(event);
	isContinue = true;
    }
}

window.ononline = function () {
    console.log("online");
    disEl.classList.remove('show');
    var event = new Event('click');
    listBtn.dispatchEvent(event);
    if (isContinue) {
	playBtn.dispatchEvent(event);
    }
}
