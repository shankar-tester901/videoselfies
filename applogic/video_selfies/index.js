const express = require("express");
const catalyst = require("zcatalyst-sdk-node");
const formidable = require('formidable');
const fs = require('fs');
util = require('util');
const path = require('path');

const app = express();

function moveFile(fromFile, toFile) {
	return new Promise((resolve, reject) => {
		console.log('about to writeFile ');
		const tempFile = fs.readFileSync(fromFile);

		fs.writeFileSync(toFile, tempFile);
		resolve();
	});
}

app.post('/loadFile', (req, res) => {
	console.log(' in loadFile ');

	var fileDir = '';
	var incomingFileName = '';
	var filePath = '';

	const catalystApp = catalyst.initialize(req);
	const filestore = catalystApp.filestore();

	var form = new formidable.IncomingForm();

	form.parse(req, function (err, fields, files) {
		if (err) next(err);


		this.filePath = files.upload_me.path;
		this.fileDir = __dirname + '/' + files.upload_me.name;
		this.incomingFileName = files.upload_me.name;

		console.log(' filename is    ' + this.incomingFileName + '   fileDir is   ' + this.fileDir + '    path ' + this.filePath);

		return moveFile(this.filePath, this.fileDir)
			.then(() => {
				return filestore
					.folder('343000000119294')
					.uploadFile({
						code: fs.createReadStream(this.fileDir),
						name: this.incomingFileName
					});
			})
			.then((uploadedFile) => {
				//This is the text file which was uploaded

				console.log('Mailing the video file now ...' + JSON.stringify(uploadedFile));

				var id_to_send = uploadedFile.id;

				console.log('Successfully uploaded ' + id_to_send);
				var mailContents = "https://videoselfies-696722811.development.zohocatalyst.com/server/video_selfies/video/download?fileId=" + id_to_send + "&filename=" + uploadedFile.created_by.email_id;

				let config = {
					from_email: uploadedFile.created_by.email_id,
					to_email: uploadedFile.created_by.email_id,
					subject: 'Your video file link',
					content: "Hello! \nThe link for your video file has been generated. \n\n" +
						"Pls  download at -\n " + mailContents
				};
				//Send the mail by passing the config object to the method which in turn returns a promise
				let email = catalystApp.email();
				let mailPromise = email.sendMail(config);
				mailPromise.then((mailObject) => {
					console.log("Mail Sent to the user " + mailObject);
					context.closeWithSuccess();
				});

				res.send("/baas/v1/project/343000000118192/folder/343000000119294/file/" + uploadedFile.id + "/download");
			})
			.catch((err) => {
				console.log("Error here " + err);
				res.send("Failure in File Upload  " + JSON.stringify(err));
			});


	});
})

app.get('/video/download', (req, res) => {
	console.log('invoked the download from the email recipient');
	let fileId = req.query.fileId;
	const filename = req.query.filename;

	const catalystApp = catalyst.initialize(req);

	const filestore = catalystApp.filestore();

	//To make the browser download the file instead of displaying it, you need to set a "Content-Disposition: attachment" header.

	filestore.folder('343000000119294').downloadFile(fileId).then((videoFileObject) => {
		res.setHeader('Content-Disposition', 'attachment; filename=' + filename + ".mpeg");
		res.setHeader('Content-Type', 'video/mpeg');
		//	res.attatchment();
		res.send(videoFileObject);
	}).catch(err => {
		res.send("Error occurred during download of video file ......" + err);
	})
});

module.exports = app;
