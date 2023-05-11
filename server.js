const express = require("express");
const path = require('path');
const app = express();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require('fs');
const http = require('http');
const pd = require('pretty-data').pd;

const port = 8989;

//const opennessHost = '18.159.149.25'; // Public subnet server IP
const opennessHost = '10.46.24.114';  // Private subnet server IP
const opennessPort = 10281;

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

app.get('^/:gif(*.gif)', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', req.params.gif));
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

app.post('/api/AmlValidation', upload.single('file'), (req, res) => {
    if (req.file) {
        fs.readFile(req.file.path, 'utf8', (err, contents) => {
            if (err) {
                res.status(500).send({ error: err });
                return;
            }

            const urlparams = {
                host: opennessHost, //No need to include 'http://' or 'www.'
                port: opennessPort,
                timeout: 180000,
                path: '/api/AmlValidation',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8', //Specifying to the server that we are sending JSON 
                }
            };

            function onResponse(response) {
                let data = '';

                response.on('data', function (chunk) {
                    data += chunk; //Append each chunk of data received to this variable.
                });
                response.on('end', function () {
                    res.json({ "result": data });
                    console.log(data); //Display the server's response, if any.
                });
                response.on('error', function (err) {
                    res.status(500).send({ "error": err });
                    console.error(err);
                });
            }

            try {
                var request = http.request(urlparams, onResponse); //Create a request object.`
                // contents = contents.replace(/\r\n/g, '');
                contents = pd.xmlmin(contents, true);
                var requestBody = JSON.stringify({ "AmlContent": contents });
                console.log(`Request body : ${requestBody}`);
                request.write(requestBody); //Send off the request.
                request.end(); //End the request.
            }
            catch (error) {
                console.error(error);
            }
        });
    } else {
        res.status(500).send({ error: "No file uploaded to server" });
    }
});

["/api/Values", "/api/Values/5"].forEach(function (endpoint) {
    app.get(endpoint, (req, res) => {

        const urlparams = {
            host: opennessHost, 
            port: opennessPort,
            timeout: 180000,
            path: endpoint,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        };

        function onResponse(response) {
            let data = '';

            response.on('data', function (chunk) {
                data += chunk; //Append each chunk of data received to this variable.
            });
            response.on('end', function () {
                res.json({ "result": data });
                console.log(data); //Display the server's response, if any.
            });
            response.on('error', function (err) {
                res.status(500).send({ "error": err });
                console.error(err);
            });
        }

        try {
            var request = http.request(urlparams, onResponse); //Create a request object.
            request.end(); //End the request.
        }
        catch (error) {
            console.error(error);
        }
    });
});

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});