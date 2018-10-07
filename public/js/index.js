'use strict';

const socket = io();

socket.on('connect',()=>{
    console.log('connect to server');
})

socket.on('disconnect', ()=>{
    console.log('disconnected from server');
})

// receive a new message from server
socket.on('newMessage', msg=>{
    console.log('new Message', msg);
    const li = $('<li></li>');
    li.text(`${msg.from}: ${msg.text}`);
    $('#messages').append(li);
})

// receive a new location message from server
socket.on('newLocationMessage', msg=>{
    const li = $('<li></li>');
    const a = $('<a target="_blank">My current location</a>');
    li.text(`${msg.from}: `);
    a.attr('href', msg.url);
    li.append(a);
    $('#messages').append(li);
});

// send a message to server
$('#message-form').on('submit', function(e){
    e.preventDefault();
    socket.emit('createMessage',{
        from: 'User',
        text: $('[name=message]').val()
    }, function(){ // a callback function, can be called by server

    })
})

// send a location message to server
const locationBtn = $('#send-location');
locationBtn.on('click',()=>{

    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser.');
    }

    navigator.geolocation.getCurrentPosition(position=>{
        socket.emit('createLocationMessage',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    },err=>{
        alert('Unable to fetch location');
    })
})