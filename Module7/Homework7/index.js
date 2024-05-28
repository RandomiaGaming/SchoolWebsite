'use strict';

const express = require('express');
const app = express();
const PORT = 3000;

const htmlTop = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="src/main.css">
    <script src="src/program.js"></script>
    <title>Finlay Christ</title>
</head>

<body>
    <header>
        <h1>Finlay Christ</h1>

        <nav>
            <div id="nav-container">
                <div class="nav-button" onclick="(window.location.href = 'index.html')">
                    <p class="nav-link">Home</p>
                </div>
                <div class="nav-button" onclick="(window.location.href = 'contact.html')">
                    <p class="nav-link">Contact</p>
                </div>
                <div class="nav-button" onclick="(window.location.href = 'intrests.html')">
                    <p class="nav-link">About Me</p>
                </div>
                <div class="nav-button" onclick="(window.location.href = 'style.html')">
                    <p class="nav-link">Style</p>
                </div>
            </div>
        </nav>
    </header>
`

const htmlBottom = `
    <footer>
        <p>
            This website was made by Finlay Christ for CS290 at Oregon State University in Spring of 2024.<br>
            <span id="copy-symbole">&copy;</span> 2024 Finlay Christ - All rights reserved
        </p>
    </footer>
</body>

</html>
`

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/results", (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let message = req.body.message;
    let department = req.body.department;
    let priority = req.body.priority;
    let date = `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`;

    let html = htmlTop + `
    <main>
        <p>
            To: The ${department} department<br>
            From: ${name} (${email})<br>
            On: ${date}<br>
            Priority: ${priority}<br>
            <br>
            ${message}
        </p>
    </main>
    <br>
    <main>
        <p>
            To: ${name} (${email})<br>
            From: Sad minimum wage employee<br>
            On: ${date}<br>
            Priority: ${priority}<br>
            <br>
            It is with great sadness that I inform you that we do not care about your problems. 😊
        </p>
        <audio src="audio/WeDoNotCare.mp3" controls></audio>
    </main>
` + htmlBottom;
    res.send(html);
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});