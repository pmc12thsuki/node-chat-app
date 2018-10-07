'use strict';

const path = require('path'); // build in module of nodejs
const http = require('http'); // build in modeule of nodejs
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utlis/message');
const {isRealString} = require('./utlis/validation');
const {Users} = require('./utlis/users');

const publicPath = path.join(__dirname, '../public'); // spicify the path of public index.html
const PORT = process.env.PORT || '3000';
const app = express();
const server = http.createServer(app); // instead of create server by express, create a server using http (express use this too behind the scence)
const io = socketIO(server); // return a socketIO server
const users = new Users();


// reutrn the html file
app.use(express.static(publicPath));

//io.on let us register an event listener we can listen for a specific event and do something when that event happened
io.on('connection', (socket)=>{ // connection and disconnect are both build-in events

    socket.on('join', (params, callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback('Name and room are required.');
        }

        // join a specific room in by socketIO
        socket.join(params.room);
        users.removeUser(socket.id); // first remove user from other room
        users.addUser(socket.id, params.name, params.room); // then join him into a new one
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        // send message to room
            // io.emit -> io.to(room_name).emit 
            // socket.broadcast.emit -> socket.broadcast.to(room_name).emit
            // socket.emit
        
        // welcome the specific user
        socket.emit('newMessage',generateMessage('Admin', 'Welcome to the chat app')); // will send to the specific user

        // tell other people somebody joined the app
        socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin', `${params.name} has joined`)); // will send to everybody but this socket itself

        callback();
    })
    
    socket.on('createMessage', (msg, callback)=>{ // once we receive an createMessage events from client
        const user = users.getUser(socket.id);
        if(user && isRealString(msg.text)){
            io.to(user.room).emit('newMessage', generateMessage(user.name, msg.text));
        }
        callback();
    })

    socket.on('createLocationMessage', (coords)=>{
        const user = users.getUser(socket.id);
        if(user){
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude ));
        }
    })

    socket.on('disconnect', ()=>{
        const user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));

        }
      });

    // socket.emit emits an event to single connection (single client)
    // socket.broadcast.emit will send the event to everybody but this socket itself
    // io.emit emits an event to every single connection (every client)
})


server.listen(PORT, ()=>{ 
    // when we use app.listen, it is calling http.createServer(app) too. because we called this function already, so we use server.listen instead
    console.log(`server listen on port ${PORT}`);
})