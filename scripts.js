// class of player
const video = document.querySelector('.player');
// contains video/photos
const canvas = document.querySelector('.photo');
// where the work happens
const ctx = canvas.getContext('2d');
// put all of our images
const strip = document.querySelector('.strip');
// audio - makes the "taking a photo" sound
const snap = document.querySelector('.snap');

// typed npm install in terminal
// then npm start
// for this lesson and b/c of the webcam, we need to run this through a local server, not just a file (like index.html)
// control + c to quit the server

function getVideo() {
    // get a user's media
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    // returns a promise
        .then(localMediaStream => {
            // console.log(localMediaStream);
            // video has to be converted into a url
            // original version of this was depreciated - need to update now
            // couldn't figure this out for now, but refer to here for more guidance: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject
            const video = document.createElement('video')
            video.src = localMediaStream;
            video.play();
        })
        // in case you don't have access to someone's webcam, display an error message
        .catch(err => {
            console.error('OH NO!', err);
        })
}

function paintToCanvas() {
    const width = video.videoWidth
    const height = video.videoHeight
    canvas.width = width;
    canvas.height = height;
    // console.log(width, height);

    // every 16 miliseconds, take image from webcam and paint to canvas
    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        // take the pixels out
        let pixels = ctx.getImageData(0, 0, width, height);
        // mess with them
        // pixels = redEffect(pixels);
    
        pixels = rgbSplit(pixels);
        // ctx.globalAlpha = 0.8;
    
        // pixels = greenScreen(pixels);
        // put them back
        ctx.putImageData(pixels, 0, 0);
      }, 16);
}
 
function takePhoto() {
    // played the sound
    snap.currentTime = 0;
    snap.play();

    // take data out of the canvas
    const data = canvas.toDataURL('image/jpeg')
    // console.log(data);
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    // to allow user to download the image
    link.innerHTML = `<img src="${data} alt="Handsome Woman" />`;
    strip.insertBefore(link, strip.firstChild);
}

// filters
// get the pixels out of the canvas, mess with 'em, put them back in
function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
      pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
      pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
      pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
    }
    return pixels;
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
      pixels.data[i - 150] = pixels.data[i + 0]; // RED
      pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
      pixels.data[i - 550] = pixels.data[i + 2]; // Blue
    }
    return pixels;
}

function greenScreen(pixels) {
    const levels = {};
  
    document.querySelectorAll('.rgb input').forEach((input) => {
      levels[input.name] = input.value;
    });
  
    for (i = 0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];
  
      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // take it out!
        pixels.data[i + 3] = 0;
      }
    }
  
    return pixels;
}

// call the function
getVideo();

// listen for a video being played and then paint to canvas
video.addEventListener('canplay', paintToCanvas);
