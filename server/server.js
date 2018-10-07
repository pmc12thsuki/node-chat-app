'use strict';

const path = require('path'); // build in module of nodejs
const http = require('http'); // build in modeule of nodejs
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public'); // spicify the path of public index.html
const PORT = process.env.PORT || '3000';

const app = express();
const server = http.createServer(app); // instead of create server by express, create a server using http (express use this too behind the scence)
const io = socketIO(server); // return a socketIO server
const generateMessage = require('./utlis/message');

// reutrn the html file
app.use(express.static(publicPath));

//io.on let us register an event listener we can listen for a specific event and do something when that event happened
io.on('connection', (socket)=>{
    console.log(`new user connected`);

    // welcome the user
    socket.emit('newMessage',generateMessage('Admin', 'Welcome to the chat app')); // will send to the specific user

    // tell other people somebody joined the app
    socket.broadcast.emit('newMessage',generateMessage('Admin', 'New use joined')); // will send to everybody but this socket itself

    
    socket.on('createMessage', msg=>{ // once we receive an createMessage events from server
        console.log('new message', msg);
        // socket.emit emits an event to single connection (single client)

        // io.emit emits an event to every single connection (every client)
        io.emit('newMessage',generateMessage(msg.from, msg.text));

        // broadcast will send the event to everybody but this socket itself
        // socket.broadcast.emit('newMessage',{
        //         from: msg.from,
        //         text: msg.text,
        //         createdAt: new Date().getTime()
        // })
    })

    socket.on('disconnect', ()=>{
        console.log(`user disconnect`);
      });
})


server.listen(PORT, ()=>{ 
    // when we use app.listen, it is calling http.createServer(app) too. because we called this function already, so we use server.listen instead
    console.log(`server listen on port ${PORT}`);
})