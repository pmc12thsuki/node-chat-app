'use strict';

const socket = io();


// a autoScrolling function
function scrollToButtom(){
    //selectors
    const messages = $('#messages');
    const newMessage = messages.children('li:last-child');
    //heights
    const clientHeight = messages.prop('clientHeight');
    const scrollTop = messages.prop('scrollTop');
    const scrollHeight = messages.prop('scrollHeight');
    const newMessageHeight = newMessage.innerHeight();
    const lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        // should scroll
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect',()=>{
    const params = jQuery.deparam(window.location.search);
    socket.emit('join', params, function(err){
        if(err){
            alert(err);
            window.location.href = '/';
        }
    })
})

socket.on('disconnect', ()=>{
    console.log('disconnected from server');
})

socket.on('updateUserList', users=>{
    const ol = $('<ol></ol>');
    users.forEach(user=>{
        ol.append($('<li></li>').text(user));
    })
    $('#users').html(ol);
})

// receive a new message from server
socket.on('newMessage', msg=>{
    // use mustache template to render message
    const formattedTime = moment(msg.createdAt).format('h:mm a');
    const template = $('#message-template').html();
    const html = Mustache.render(template, {
        text: msg.text,
        from: msg.from,
        createdAt: formattedTime
    });
    $('#messages').append(html);
    scrollToButtom();
})

// receive a new location message from server
socket.on('newLocationMessage', msg=>{
    const formattedTime = moment(msg.createdAt).format('h:mm a');
    const template = $("#location-message-template").html();
    const html = Mustache.render(template,{
        url: msg.url,
        from: msg.from,
        createdAt: formattedTime
    })
    $('#messages').append(html);
    scrollToButtom();
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