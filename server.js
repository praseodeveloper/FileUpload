const express = require("express");
const path = require('path');
const app = express();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require('fs');
var http = require('http');

const port = 8989;

["/", "/index.html"].forEach(function (entryPoint) {
    app.get(entryPoint, (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
    });
});

app.get('^/:js(*.js)', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', req.params.js));
});

app.get('^/:css(*.css)', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', req.params.css));
});

app.post('/upload', upload.single('file'), (req, res) => {
    if (req.file) {
        fs.readFile(req.file.path, 'utf8', (err, contents) => {
            if (err) {
                res.status(500).send(err);
                return;
            }
            const wordCount = contents.split(" ").length;
            res.json({ "wordCount": wordCount });
        });
    } else {
        res.status(500).send("No file uploaded to server");
    }
});

// app.post('/validateAml', upload.single('file'), (req, res) => {
//     if (req.file) {
//         const filePath = req.file.path;
//         fs.readFile(req.file.path, 'utf8', (err, contents) => {
//             if (err) {
//                 res.status(500).send({ error: err });
//                 return;
//             }

//             const urlparams = {
//                 host: '18.159.149.25', //No need to include 'http://' or 'www.'
//                 port: 10281,
//                 timeout: 180000,
//                 path: '/api/AmlValidation',
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json; charset=UTF-8', //Specifying to the server that we are sending JSON 
//                 }
//             };

//             function onResponse(response) {
//                 let data = '';

//                 response.on('data', function (chunk) {
//                     data += chunk; //Append each chunk of data received to this variable.
//                 });
//                 response.on('end', function () {
//                     res.json({ "result": data });
//                     console.log(data); //Display the server's response, if any.
//                 });
//                 response.on('error', function (err) {
//                     res.status(500).send({ "error": err });
//                     console.error(err);
//                 });
//             }

//             try {
//                 var request = http.request(urlparams, onResponse); //Create a request object.
//                 request.write(JSON.stringify({
//                     "AmlContent": contents
//                 })); //Send off the request.
//                 request.end(); //End the request.
//             }
//             catch (error) {
//                 console.error(error);
//             }
//         });
//     } else {
//         res.status(500).send({ error: "No file uploaded to server" });
//     }
// });

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});