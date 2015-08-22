document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;
var yDown = null;

function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
};

function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            alert("Swipe left!");
        } else {
            alert("Swipe right!");
        }
    } else {
        if ( yDiff > 0 ) {
            // Swipe up
        } else {
            // Swipe down
        }
    }
    /* reset values */
    xDown = null;
    yDown = null;
};

var overlayPointer = -1;
var overlays = ["1.png", "2.png", "3.png"];


function changeOverlay() {
    var newPointer = overlayPointer + 1;
    if (overlays.length - 1 < newPointer) {
        overlayPointer = 0;
    } else {
        overlayPointer = newPointer;
    }

    document.querySelector("#overlay").className = "";
    document.querySelector("#overlay img").src = "overlays/" + overlays[overlayPointer];
}

function animateLeft(obj, from, to){
    if(from >= to){
       obj.style.visibility = 'hidden';
       return;
    }
    else {
       var box = obj;
       box.style.marginLeft = from + "px";
       setTimeout(function(){
           animateLeft(obj, from + 1, to);
       }, 25)
    }
}

