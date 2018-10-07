'use strict';

const socket = io();

socket.on('connect',()=>{
    console.log('connect to server');
})

socket.on('newMessage', msg=>{
    console.log('new Message', msg);
})

socket.on('disconnect', ()=>{
    console.log('disconnected from server');
})



