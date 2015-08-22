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
    {'Lesser': 'transparent.png'},
    {'Me': 'chris_2.png'},
    {'More Me': 'chris_1.png'}
  ],
  'bonus':[
    {'Lesser': 'transparent.png'},
    {'Presidential': 'clinton.png'}
  ]
};
var level = null;

var videoElement = document.querySelector('video');
var videoList = [];
var videoPointer = 0;
var isHillaryPlaying = false;

var winHeight = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

function gotSources(sourceInfos) {
  for (var i = 0; i !== sourceInfos.length; ++i) {
    var sourceInfo = sourceInfos[i];
    if (sourceInfo.kind === 'video') {
      videoList.push({type: "live", src: sourceInfo.id});
    } else {
      // console.log('Some other kind of source: ', sourceInfo);
    }
  }
  videoList.reverse();
  videoList.push({type: "play", src: "video/hillary2.mp4"});
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

  var videoSource = videoList[videoPointer];

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

function setLevel(lvl) {
  level = levels[lvl];

  if (isHillaryPlaying) {
    isHillaryPlaying = false;
    start();
  }

  document.querySelector("#rightContent").style.marginLeft = "0vw";
  document.querySelector("#backButton").style.opacity = 1;

  var img = document.querySelector('#overlayImg');
  img.src = '';

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
        img.src = 'overlays/' + value;
      });
    })();
    barTab.appendChild(tab);
  }
  barTab.firstChild.classList.add('active');
}

document.querySelector("#level1button").addEventListener('click', function() {
  setLevel('1');
});
document.querySelector("#level2button").addEventListener('click', function() {
  setLevel('2');
});
document.querySelector("#level3button").addEventListener('click', function() {
  setLevel('3');
});
document.querySelector("#bonusButton").addEventListener('click', function() {
  setLevel('bonus');

  videoElement.src = 'video/hillary.mp4';
  videoElement.play();
  isHillaryPlaying = true;
});

document.querySelector("#backButton").addEventListener('click', function() {
  level = null;
  document.querySelector("#rightContent").style.marginLeft = "100vw";
  document.querySelector("#backButton").style.opacity = 0;
});


// Main

if (typeof MediaStreamTrack === 'undefined'){
  alert('This browser does not support MediaStreamTrack.');
} else {
  MediaStreamTrack.getSources(gotSources);
}

start();
