'use strict';

const path = require('path'); // build in module of nodejs
const express = require('express');
const app = express();

const publicPath = path.join(__dirname, '../public'); // spicify the path of public index.html
const PORT = process.env.PORT || '3000';

// reutrn the html file
app.use(express.static(publicPath));

app.listen(PORT, ()=>{
    console.log(`server listen on port ${PORT}`);
})