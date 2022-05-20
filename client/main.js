

(function () {
	// The width and height of the captured photo. We will set the
	// width to the value defined here, but the height will be
	// calculated based on the aspect ratio of the input stream.

	var width = 320;    // We will scale the photo width to this
	var height = 0;     // This will be computed based on the input stream

	// |streaming| indicates whether or not we're currently streaming
	// video from the camera. Obviously, we start at false.

	var streaming = false;

	// The various HTML elements we need to configure or control. These
	// will be set by the startup() function.

	var video = null;
	var canvas = null;
	var photo = null;
	var startbutton = null;
	var buffer = [], mediaRecorder;
	let recordedChunks;
	var options;
	//	video = document.querySelector("video");

	function startup() {
		video = document.getElementById('video');
		canvas = document.getElementById('canvas');
		photo = document.getElementById('photo');
		startbutton = document.getElementById('startbutton');

		startbutton.addEventListener('click', function (ev) {
			downloadButton.disabled = true;

			navigator.mediaDevices.getUserMedia({ video: true, audio: true })
				.then(function (stream) {

					video.srcObject = stream;
					video.play();

					if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
						options = { mimeType: 'video/webm; codecs=vp9' };
					} else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
						options = { mimeType: 'video/webm; codecs=vp8' };
					}
					recordedChunks = [];
					mediaRecorder = new MediaRecorder(stream, options);
					console.log('Created MediaRecorder', mediaRecorder, 'with options', options);

					mediaRecorder.ondataavailable = handleDataAvailable;
					mediaRecorder.start(10);
					playButton.disabled = true;

					console.log('MediaRecorder started', mediaRecorder);


				})
				.catch(function (err) {
					console.log("An error occurred: " + err);
				});
		}, false);

		//This switches off the camera including the light
		stopbutton.addEventListener('click', function (ev) {

			downloadButton.disabled = false;
			playButton.disabled = false;

			mediaRecorder.stop();
			stream = video.srcObject;
			// now get all tracks
			tracks = stream.getTracks();
			// now close each track by having forEach loop
			tracks.forEach(function (track) {
				// stopping every track
				track.stop();
			});
			// var audio = document.createElement('audio');
			// audio.controls = true;
			// var blob = new Blob(recordedChunks, { 'type': 'audio/ogg; codecs=opus' });
			// var audioURL = window.URL.createObjectURL(blob);
			// audio.src = audioURL;
			console.log("recorder stopped");

			//	play();
			//	download();

		}, false)


		const playButton = document.querySelector('button#play');
		playButton.addEventListener('click', () => {
			const superBuffer = new Blob(recordedChunks, { type: 'video/webm' });
			video.src = null;
			video.srcObject = null;
			video.src = window.URL.createObjectURL(superBuffer);
			video.controls = true;
			video.play();
		});

		const downloadButton = document.querySelector('button#download');
		downloadButton.addEventListener('click', () => {
			const blob = new Blob(recordedChunks, { type: 'video/webm' });
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			playButton.disabled = false;

			a.style.display = 'none';
			a.href = url;


			var today = new Date();
			var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
			var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
			var dateTime = date + ' ' + time;


			a.download = dateTime + '.webm';
			document.body.appendChild(a);
			a.click();
			setTimeout(() => {
				document.body.removeChild(a);
				window.URL.revokeObjectURL(url);
			}, 100);
		});
	}




	function handleDataAvailable(event) {
		console.log('in handleDataAvailable .....')
		if (event.data && event.data.size > 0) {
			//	console.log('inside ..' + event.data);
			recordedChunks.push(event.data);
		}
	}




	// function download() {
	// 	console.log('in download ...');
	// 	var blob = new Blob(recordedChunks, {
	// 		type: 'video/webm'
	// 	});
	// 	var url = URL.createObjectURL(blob);
	// 	var a = document.createElement('a');
	// 	document.body.appendChild(a);
	// 	a.style = 'display: none';
	// 	var randomNum = Math.floor(Date.now() / 1000);
	// 	a.href = url;
	// 	//	console.log('href url is  ' + a.href);
	// 	a.download = randomNum + '.webm';
	// 	a.click();
	// 	window.URL.revokeObjectURL(url);
	// }

	// Set up our event listener to run the startup process
	// once loading is complete.




	window.addEventListener('load', startup, false);
})();
function invokeUploadFunction(data) {

	$.ajax({
		type: "POST",
		enctype: 'multipart/form-data',
		url: "/server/video_selfies/loadFile",
		data: data,
		processData: false,
		contentType: false,
		cache: false,
		timeout: 60000,
		success: function (data) {
			$("#uploadStatus").text("Success");
			$("#btnSubmit").prop("disabled", false);
		},
		error: function (e) {
			$("#uploadStatus").text("Failure in File Upload");
			$("#btnSubmit").prop("disabled", false);
		}
	});
}

function hideInfo() {
	$("#mylink").hide();
	$("#Audio_File").hide();
}