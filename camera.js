let videoStream = null; // Global variable to store the video stream
let videoElement = null; // Global variable to store the video element
let animationFrameId = null; // To store the animation frame request ID

function captureFromCamera() {
    // Access the user's camera and start streaming
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            videoStream = stream; // Store the stream globally
            videoElement = document.createElement('video');
            videoElement.srcObject = stream;
            videoElement.autoplay = true;
            videoElement.style.display = 'none'; // Hide the video element
            videoElement.setAttribute('id', 'cameraFeed'); // Set ID for easier access if needed
            
            // Ensure video stream is loaded
            videoElement.onloadedmetadata = function(e) {
                let canvas = document.getElementById('doodleCanvas');
                let context = canvas.getContext('2d');
                
                // Set canvas dimensions to match video feed
                canvas.width = videoElement.videoWidth;
                canvas.height = videoElement.videoHeight;

                // Draw the video frame onto the canvas
                drawVideoFrame();
            };

            // Append the video element to the document body (for display purposes)
            document.body.appendChild(videoElement);
        })
        .catch(function(err) {
            console.error('Error accessing camera:', err);
        });
}

function drawVideoFrame() {
    let canvas = document.getElementById('doodleCanvas');
    let context = canvas.getContext('2d');
    
    if (videoElement) {
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        // Request the next frame
        animationFrameId = requestAnimationFrame(drawVideoFrame);
    }
}

function takePicture() {
    if (!videoElement || !document.body.contains(videoElement)) {
        console.error('Video element not found or removed from DOM.');
        return;
    }

    // Cancel the animation frame request to stop updating the canvas with the video feed
    cancelAnimationFrame(animationFrameId);

    let canvas = document.getElementById('doodleCanvas');
    let context = canvas.getContext('2d');
    
    // Ensure canvas dimensions match video feed
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    
    // Draw the current video frame onto the canvas
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    // Stop the video stream
    videoStream.getTracks().forEach(function(track) {
        track.stop();
    });
    
    // Remove the video element from the DOM
    videoElement.remove();
    videoElement = null; // Reset videoElement to null
}

function clearCanvas() {
    let canvas = document.getElementById('doodleCanvas');
    let context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function saveDoodle() {
    // Example function to save the canvas image
    let canvas = document.getElementById('doodleCanvas');
    let dataURL = canvas.toDataURL(); // Get the image data URL
    console.log(dataURL);
    // Send dataURL to server for saving or further processing
}
