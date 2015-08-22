'use strict';

var videoElement = document.querySelector('video');
var videoList = [];
var videoPointer = 0;

navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

function gotSources(sourceInfos) {
  for (var i = 0; i !== sourceInfos.length; ++i) {
    var sourceInfo = sourceInfos[i];
    if (sourceInfo.kind === 'video') {
      videoList.push(sourceInfo.id);
    } else {
      console.log('Some other kind of source: ', sourceInfo);
    }
  }
}

if (typeof MediaStreamTrack === 'undefined'){
  alert('This browser does not support MediaStreamTrack.\n\nTry Chrome Canary.');
} else {
  MediaStreamTrack.getSources(gotSources);
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
  var constraints = {
    video: {
      optional: [{sourceId: videoSource}]
    }
  };
  navigator.getUserMedia(constraints, successCallback, errorCallback);
}

document.getElementById("switchVideo").addEventListener('click', function() {
  videoPointer = videoPointer + 1;
  start();
});

start();