'use strict';

const path = require('path'); // build in module of nodejs
const http = require('http'); // build in modeule of nodejs
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utlis/message');

const publicPath = path.join(__dirname, '../public'); // spicify the path of public index.html
const PORT = process.env.PORT || '3000';
const app = express();
const server = http.createServer(app); // instead of create server by express, create a server using http (express use this too behind the scence)
const io = socketIO(server); // return a socketIO server


// reutrn the html file
app.use(express.static(publicPath));

//io.on let us register an event listener we can listen for a specific event and do something when that event happened
io.on('connection', (socket)=>{ // connection and disconnect are both build-in events
    console.log(`new user connected`);

    // welcome the specific user
    socket.emit('newMessage',generateMessage('Admin', 'Welcome to the chat app')); // will send to the specific user

    // tell other people somebody joined the app
    socket.broadcast.emit('newMessage',generateMessage('Admin', 'New use joined')); // will send to everybody but this socket itself

    
    socket.on('createMessage', (msg, callback)=>{ // once we receive an createMessage events from client
        io.emit('newMessage', generateMessage(msg.from, msg.text));
        callback();
    })

    socket.on('createLocationMessage', (coords)=>{
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude ));
    })

    socket.on('disconnect', ()=>{
        console.log(`user disconnect`);
      });

    // socket.emit emits an event to single connection (single client)
    // socket.broadcast.emit will send the event to everybody but this socket itself
    // io.emit emits an event to every single connection (every client)
})


server.listen(PORT, ()=>{ 
    // when we use app.listen, it is calling http.createServer(app) too. because we called this function already, so we use server.listen instead
    console.log(`server listen on port ${PORT}`);
})