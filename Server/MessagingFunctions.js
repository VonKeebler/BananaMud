var util = require('util')

var server = require('./server');

// Messaging Functions
function onPlayerViewMessages(data) {
    var messagingPlayer = server.playerById(data.id);
    
    if(!messagingPlayer){
        util.log('NO MESSAGING PLAYER FOUND: '+data.id);
        return;
    }
    
    var messagingCharacter = messagingPlayer.PC;

    if(!messagingCharacter){
        util.log('NO MESSAGING CHARACTER FOUND: '+messagingPlayer.PC);
        return;
    }
    
    var pagedMessageArray = [];
    
    if((data.messagesPage*5) > messagingCharacter.messages.length){
        data.messagesPage = Math.floor(messagingCharacter.messages.length/5);
    }
    
    for(var i=data.messagesPage*5; i<(data.messagesPage*5)+5; i++){
        pagedMessageArray.push(messagingCharacter.messages[i]);
    }
    
    server.socket.to(data.id).emit('player view messages response', {messages: pagedMessageArray});            
   
}

module.exports.onPlayerViewMessages = onPlayerViewMessages;

function onPlayerSendMessage(data) {
    var messagingPlayer = server.playerById(data.id);
    
    if(!messagingPlayer){
        util.log('NO MESSAGING PLAYER FOUND: '+data.id);
        return;
    }
    
    var messagingCharacter = messagingPlayer.PC;

    if(!messagingCharacter){
        util.log('NO MESSAGING CHARACTER FOUND: '+messagingPlayer.PC);
        return;
    }
    
    if(data.recipient == undefined || data.recipient == ''){
        server.socket.to(data.id).emit('message', {message: "You need to include a name to send mail to.", styles: [{color: '#ffffff', weight: 'Bold'}]});            
        return;
    }
    if(data.subject == undefined || data.subject == ''){
        server.socket.to(data.id).emit('message', {message: "You need to include a subject for your mail.", styles: [{color: '#ffffff', weight: 'Bold'}]});                    
        return;
    }  
    if(data.body == undefined || data.body == ''){
        server.socket.to(data.id).emit('message', {message: "You need to include content in your mail.", styles: [{color: '#ffffff', weight: 'Bold'}]});                            
        return;
    } 
    
    var recipientCharacter = server.pcByCharacterName(data.recipient);
    if(recipientCharacter == false){
        server.socket.to(data.id).emit('message', {message: "Cannot find '"+data.recipient+"' to send mail to.", styles: [{color: '#ffffff', weight: 'Bold'}]});            
        return;
    }
    
    recipientCharacter.messageMe({from: messagingCharacter.name, date: server.getFormattedDate(), subject: data.subject, body: data.body});
    
    server.socket.to(data.id).emit('player sent message');            
    
   
}

module.exports.onPlayerSendMessage = onPlayerSendMessage;

function onPlayerDeleteMessage(data) {
    var messagingPlayer = server.playerById(data.id);
    
    if(!messagingPlayer){
        util.log('NO MESSAGING PLAYER FOUND: '+data.id);
        return;
    }
    
    var messagingCharacter = messagingPlayer.PC;

    if(!messagingCharacter){
        util.log('NO MESSAGING CHARACTER FOUND: '+messagingPlayer.PC);
        return;
    }
    
    for(var i=0; i<messagingCharacter.messages.length; i++){
        if(messagingCharacter.messages[i].id == data.messageId){
            //delete messagingCharacter.messages[i];
            messagingCharacter.messages.splice(i, 1);
        }
    }
    
    server.socket.to(data.id).emit('player deleted message'); 
    
    //server.socket.to(data.id).emit('player view messages response', {messages: messagingCharacter.messages});            
   
}

module.exports.onPlayerDeleteMessage = onPlayerDeleteMessage;
