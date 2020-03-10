const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const port = 2000;

app.use(cookieParser());
app.listen(port, ()=> {
    console.log(`Listening on port: ${port}`)
});

