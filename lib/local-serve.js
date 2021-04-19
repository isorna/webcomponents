// More info at: https://expressjs.com/en/starter/static-files.html

import express from 'express';
import { resolve } from 'path';
const port = process.env.PORT || 8081;
const app = express();
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

// serve static assets normally
app.use('/', express.static(__dirname + '/src'));
app.use('/images', express.static(__dirname + '/images'));

// Handle every other route with index.html, which will contain
// a script tag to the application's JavaScript file(s):
app.get('*', function (request, response) {
    response.sendFile(resolve(__dirname, '../src/index.html'));
});

app.listen(port, () => console.log(`Static server active on http://localhost:${port}`));