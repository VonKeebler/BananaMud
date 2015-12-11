var util = require('util')

var server = require('./server');

var dialogTimeOuts = [];

// Dialog Functions
function dialogFunction (clientId, trigger, speakingNPC, secretTopic) {
    var askingPlayer = server.playerById(clientId);
    if(trigger == "AskHerodAboutCousin"){
        if(askingPlayer.PC.secretDialog == undefined){
           askingPlayer.PC.secretDialog = {};
        }
        
        if(askingPlayer.PC.secretDialog[secretTopic] == true){
            server.socket.to(clientId).emit('player chat response', {id: this.id, response: "'I already gave you that letter. I don't know anything more about him.'"}); 
            return;
            
        }
        
        server.socket.to(clientId).emit('player chat response', {id: this.id, response: "'Hmm, Treadlightly? I think thats the one with the one eye? Uhh... I haven't seen him around recently. Now that you mention it, he did leave something here. He said it was for anyone who asks for him. I guess thats you.' Herod hands you a letter."});
        
        server.addItemToCharacter('itemCousinsLetter2Envelope', askingPlayer.id, 1);
        
        server.socket.to(askingPlayer.id).emit('message', {message: "Herod slips you an envelope.", styles: [{color: '#ffffff', weight: 'Bold'}]});
        
        askingPlayer.Socket.broadcast.to('room'+askingPlayer.PC.roomid).emit('message', {message: "Herod slips "+ askingPlayer.PC.name + " an envelope.", styles: [{color: '#ffffff', weight: 'Bold'}]});
        
        askingPlayer.PC.secretDialog[secretTopic] = true;
        return;
    }
    
    if(trigger == "AskIrolynnAboutCousin"){
        server.socket.to(clientId).emit('player chat response', {id: this.id, response: "'That'll cost you...'"});    
        
        server.socket.to(clientId).emit('pop dialog', {id: this.id, dialog: "Irolynn wants 1 shilling to give you that information.'", dialogResponseFunction: "AskIrolynnAboutCousinResponse"});
    }
    if(trigger == "AskIrolynnAboutWetNoose"){
        server.socket.to(clientId).emit('player chat response', {id: this.id, response: "'That'll cost you...'"});    
        
        server.socket.to(clientId).emit('pop dialog', {id: this.id, dialog: "Irolynn wants 1 shilling to give you that information.'", dialogResponseFunction: "AskIrolynnAboutWetNooseResponse"});
    }
    
    if(trigger == "GiveFairlightPassword"){
        server.socket.to(clientId).emit('player chat response', {id: this.id, response: ""});    
        
        server.socket.to('roomOLDSILVERHOLLOW7').emit('message', {message: "The panel snaps shut and there is an audible crank. The steel door in the southern wall swings open.", styles: [{color: '#ffffff', weight: 'Bold'}]}); 
        
        for(var i = 0; i<rooms.length; i++){
            if (rooms[i].roomid == "OLDSILVERHOLLOW7"){
                rooms[i].roomExits['South'] = "THERUSTHIEVES1";
                rooms[i].description = "  Red bricks line the floors, ceiling and walls here, causing an uncomfortable amount of claustrophobia. A small hole in the ceiling provides dim light, but some corners remain impenetrably dark. An old steel door in the southern wall is open, emitting a dim light.The alleyway continues running east to west here."
                rooms[i].interactiveObjects["Old Steel Door"].roomDescription = "An old steel door in the southern wall hangs open.";
            }
            
        }
        
        for(var i=0; i<npcs.length; i++){
            if(npcs[i].name == "A Pair of Beady Eyeballs"){
                npcs[i].roomid = "";
            }
        }

        dialogTimeOuts.push( setTimeout(closeOSHSTEELDOOR, 30000, this) );
        
    }    
}

module.exports.dialogFunction = dialogFunction;

function onPlayerDialogAnswer (data){
    var answeringPlayer = server.playerById(this.id);
    util.log('PLAYER '+answeringPlayer.id+' ANSWERING DIALOG '+data.dialogResponseFunction+' WITH '+data.answer)
    if(data.dialogResponseFunction == "AskIrolynnAboutCousinResponse"){
        if(data.answer == 'Yes'){
            if(answeringPlayer.PC.money < 12){
                server.socket.to(answeringPlayer.id).emit('player chat response', {id: data.id, response: "'Come back when you have the cash.'"}); 
            } else {
                answeringPlayer.PC.money -= 12;
                server.updateCharacterInventory(answeringPlayer.id);
                server.socket.to(answeringPlayer.id).emit('player chat response', {id: data.id, response: "'Old boy had to go under a new name. He's not dead, but soon he'd rather be. You're on the right track to find him, but you're on the wrong track for keeping your head.'"});    
            }
        }
        if(data.answer == 'No'){
            server.socket.to(answeringPlayer.id).emit('player chat response', {id: data.id, response: "'Suit yourself.'"});    
        }
    }
    
    if(data.dialogResponseFunction == "AskIrolynnAboutWetNooseResponse"){
        if(data.answer == 'Yes'){
            if(answeringPlayer.PC.money < 12){
                server.socket.to(answeringPlayer.id).emit('player chat response', {id: data.id, response: "'Come back when you have the cash.'"}); 
            } else {
                answeringPlayer.PC.money -= 12;
                server.updateCharacterInventory(answeringPlayer.id);
                server.socket.to(answeringPlayer.id).emit('player chat response', {id: data.id, response: "'There is a door in the alley just behind the inn. Knock twice. Talk to Fairlight. You'll need a password. It's nothing anyone will tell you.'"}); 
            }
        }
        if(data.answer == 'No'){
            server.socket.to(answeringPlayer.id).emit('player chat response', {id: data.id, response: "'Suit yourself.'"});    
        }
    }
}

module.exports.onPlayerDialogAnswer = onPlayerDialogAnswer;


//*********************************************************************************************
// DIALOG INTERACTION TIMEOUTS
//*********************************************************************************************

function closeOSHSTEELDOOR(){
    
    server.socket.to('room'+interactingPlayer.PC.roomid).emit('message', {message: "The steel door in the southern wall slams abruptly, leaving an echo down the alley.", styles: [{color: '#ffffff', weight: 'Bold'}]});    

    for(var i = 0; i<rooms.length; i++){
        if (rooms[i].roomid == "OLDSILVERHOLLOW7"){
            delete rooms[i].roomExits['South'];
            rooms[i].description = "  Red bricks line the floors, ceiling and walls here, causing an uncomfortable amount of claustrophobia. A small hole in the ceiling provides dim light, but some corners remain impenetrably dark. The alleyway continues running east to west here."
            rooms[i].interactiveObjects["Old Steel Door"].roomDescription = "An old steel door is set into the southern wall.";
        }

    }    
    
    
    return;
}

