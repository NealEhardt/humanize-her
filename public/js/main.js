'use strict';

var levels = {
  '1': [
    {'Lesser': 'transparent.png'},
    {'Venture': 'suit.png'},
    {'Andy': 'hoodie.png'},
    {'Rx': 'doctor.png'},
    {'Tot': 'kid.png'}
  ],
  '2': [
    {'Lesser': 'transparent.png'},
    {'Invictus': 'clint_1.png'},
    {'Rugged': 'clint_2.png'},
    {'Drifter': 'clint_3.png'}
  ],
  '3':[
    {'Me': 'chris_2.png'},
    {'More Me': 'chris_1.png'}
  ],
  'bonus':[
    {'Lesser': 'transparent.png'},
    {'Presidential': 'clinton.png'}
  ]
};

var videoElement = document.querySelector('video');
var videoSources = [];
var videoSourceIdx = -1;

var winHeight = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

function gotSources(sourceInfos) {
  for (var i = 0; i !== sourceInfos.length; ++i) {
    var sourceInfo = sourceInfos[i];
    if (sourceInfo.kind === 'video') {
      videoSources.push({type: "live", src: sourceInfo.id});
    }
  }
  videoSources.push({type: "play", src: "video/hillary.mp4"});
}

function successCallback(stream) {
  window.stream = stream; // make stream available to console
  videoElement.src = window.URL.createObjectURL(stream);
  videoElement.play();
}

function errorCallback(error){
  console.log('navigator.getUserMedia error: ', error);
}

function start(){
  if (!!window.stream) {
    videoElement.src = null;
    window.stream.stop();
  }

  var videoSource = videoSources[videoSourceIdx];

  if (videoSource) {
    if (videoSource.type == "live") {
      var constraints = {
        video: {
          optional: [{sourceId: videoSource.src}]
        }
      };

      navigator.getUserMedia(constraints, successCallback, errorCallback);
    } else {
      videoElement.src = videoSource.src;
      videoElement.play();
    }
  } else {
    setTimeout(start, 1000);
  }
}

var preloadedImages;

function setLevel(lvl, sourceIdx) {
  var level = levels[lvl];

  if (videoSourceIdx != sourceIdx) {
    videoSourceIdx = sourceIdx;
    start();
  }

  var videoElt = document.querySelector("video");
  if (sourceIdx == 0) {
    videoElt.style.marginTop = "-50vh";
  } else {
    videoElt.style.marginTop = "0vh";
  }

  document.querySelector("#rightContent").style.marginLeft = "0vw";
  document.querySelector("#backButton").style.opacity = 1;

  var imgElt = document.querySelector('#overlayImg');
  preloadedImages = [];

  var barTab = document.querySelector(".bar-tab");
  while (barTab.firstChild) {
    barTab.removeChild(barTab.firstChild);
  }
  var tabs = barTab.children;
  for (var i = 0; i < level.length; i++) {
    var tab = document.createElement("a");
    tab.classList.add('tab-item');
    (function () {
      var key = Object.keys(level[i])[0];
      var value = level[i][key];
      tab.innerHTML = key;
      tab.addEventListener('click', function() {
        for (var j = 0; j < tabs.length; j++) {
          tabs[j].classList.remove('active');
        }
        this.classList.add('active');
        imgElt.src = 'overlays/' + value;
      });
      preloadedImages[i] = new Image();
      preloadedImages[i].src = 'overlays/' + value;
    })();
    barTab.appendChild(tab);
  }
  barTab.firstChild.click();
}

document.querySelector("#level1button").addEventListener('click', function() {
  setLevel('1', 1);
});
document.querySelector("#level2button").addEventListener('click', function() {
  setLevel('2', 1);
});
document.querySelector("#level3button").addEventListener('click', function() {
  setLevel('3', 0);
});
document.querySelector("#bonusButton").addEventListener('click', function() {
  setLevel('bonus', 2);
});

document.querySelector("#backButton").addEventListener('click', function() {
  document.querySelector("#rightContent").style.marginLeft = "100vw";
  document.querySelector("#backButton").style.opacity = 0;
});

// Quick hack to give Chris an easier click.
document.querySelector("#overlayImg").addEventListener('click', function() {
  var tab2 = document.querySelector(".tab-item:nth-child(2)");
  if(tab2.innerHTML == 'More Me') {
    tab2.click();
  }
});

// Main

if (typeof MediaStreamTrack === 'undefined'){
  alert('This browser does not support MediaStreamTrack.');
} else {
  MediaStreamTrack.getSources(gotSources);
}

start();
