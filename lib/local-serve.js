// More info at: https://expressjs.com/en/starter/static-files.html

import express, { static } from 'express';
import { resolve } from 'path';
const port = process.env.PORT || 8081;
const app = express();

// serve static assets normally
app.use(static(__dirname + '/src'));
app.use('/images', static(__dirname + '/images'));

// Handle every other route with index.html, which will contain
// a script tag to the application's JavaScript file(s):
app.get('*', function (request, response) {
    response.sendFile(resolve(__dirname, 'src/index.html'));
});

app.listen(port, () => console.log(`Static server active on http://localhost:${port}`));