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
    setInterval(() => {
        // pass in an image, and it'll paint it
        ctx.drawImage(video, 0, 0, width, height)
    }, 16);
}
 
function takePhoto() {
    // played the sound
    snap.currentTime = 0;
    snap.play();

    // take data out of the canvas
    const data = canvas.toDataURL('image/jpeg')
    console.log(data);
}

// call the function
getVideo();

// listen for a video being played and then paint to canvas
video.addEventListener('canplay', paintToCanvas);
