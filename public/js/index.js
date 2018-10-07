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
    const formattedTime = moment(msg.createdAt).format('h:mm a');
    const li = $('<li></li>');
    li.text(`${msg.from} ${formattedTime}: ${msg.text}`);
    $('#messages').append(li);
})

// receive a new location message from server
socket.on('newLocationMessage', msg=>{
    const formattedTime = moment(msg.createdAt).format('h:mm a');
    const li = $('<li></li>');
    const a = $('<a target="_blank">My current location</a>');
    li.text(`${msg.from} ${formattedTime}: `);
    a.attr('href', msg.url);
    li.append(a);
    $('#messages').append(li);
});

// send a message to server
$('#message-form').on('submit', function(e){
    e.preventDefault();
    const messageTextBox = $('[name=message]');
    socket.emit('createMessage',{
        from: 'User',
        text: messageTextBox.val()
    }, function(){ // a callback function, called if success
        // clear out textbox
        messageTextBox.val('');
    })
})

// send a location message to server
const locationBtn = $('#send-location');
locationBtn.on('click',()=>{

    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser.');
    }

    locationBtn.attr('disabled', 'disabled').text('Sending Location ....');

    navigator.geolocation.getCurrentPosition(position=>{
        locationBtn.removeAttr('disabled').text('Send Location');
        socket.emit('createLocationMessage',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    },err=>{
        locationBtn.removeAttr('disabled').text('Send Location');
        alert('Unable to fetch location');
    })
})