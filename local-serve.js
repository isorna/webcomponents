// More info at: https://expressjs.com/en/starter/static-files.html

const express = require('express');
const path = require('path');
const port = process.env.PORT || 8081;
const app = express();

// serve static assets normally
app.use(express.static(__dirname + '/src'));
app.use('/images', express.static(__dirname + '/images'));

// handle every other route with index.html, which will contain
// a script tag to the application's JavaScript file(s).
app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, 'src/index.html'));
});

app.listen(port, () => console.log(`Static server active on http://localhost:${port}`));