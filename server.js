const express = require("express");
const path = require('path');
const app = express();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require('fs');
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const port = 8989;

["/", "/index.html"].forEach(function (entryPoint) {
    app.get(entryPoint, (req, res) => {
        const result = req.cookies["result"];
        res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
    });
});

app.get('^/:js(*.js)', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', req.params.js));
});

app.get('^/:css(*.css)', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', req.params.css));
});

app.post('/', upload.single('file'), (req, res) => {
    if (req.file) {
        const filePath = req.file.path;
        fs.readFile(req.file.path, 'utf8', (err, contents) => {
            if (err) {
                res.status(500).send({ error: err });
                return;
            }
            const wordCount = contents.split(" ").length;
            // returning result in a cookie
            res.cookie("result", wordCount.toString(), { expires: new Date(Date.now() + 60000), sameSite: 'strict' });
            res.redirect('/');
        });
    } else {
        res.status(500).send({ error: "No file uploaded to server" });
    }
});

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});