var util = require('util')

var server = require('./server');

var Player = require('./Player')
var Room = require('./Room')
var Item = require('./Item')
var NPC = require('./NPC')
var PC = require('./PC')

var DialogFunctions = require('./DialogFunctions')

var Fileloader = require('./Fileloader.js');

// Player is trying to chat
function onPlayerChat (data) {

  var chattingPlayer = server.playerById(this.id);

  // Player not found
  if (!chattingPlayer) {
    util.log('Player not found: ' + this.id)
    return
  } 
    
    util.log('Player '+chattingPlayer.PC.name+' is chatting.');
    
    var roomNPCs = server.npcInRoom(chattingPlayer.PC.roomid);
    var chattingNPCNames = [];
    var chattingNPCIDs = [];

    for(var i=0; i<roomNPCs.length; i++){
        var thisNPC = roomNPCs[i];
        if(roomNPCs[i].dialog != undefined){
            chattingNPCIDs.push(roomNPCs[i].id);
            chattingNPCNames.push(roomNPCs[i].name);
        
        }
    }
    
    if(chattingNPCNames.length > 0){
        
        this.broadcast.to('room'+chattingPlayer.PC.roomid).emit('message', {message: chattingPlayer.PC.name + " starts chatting up the locals.", styles: [{color: '#ffffff', weight: 'Bold'}]});    
        
        server.socket.to(this.id).emit('player chat', {id: this.id, chattingNPCIDs: chattingNPCIDs, chattingNPCNames: chattingNPCNames})
    } else {
        server.socket.to(this.id).emit('message', {message: "There isn't anyone around willing to talk to you.", styles: [{color: '#ffffff', weight: 'Bold'}]});   
    }

}

module.exports.onPlayerChat = onPlayerChat;

// Player is fetching chat subjects
function onPlayerChatSubjects (data) {

  var chattingPlayer = server.playerById(this.id);

  // Player not found
  if (!chattingPlayer) {
    util.log('Player not found: ' + this.id)
    return
  } 
    //util.log('Player '+chattingPlayer.PC.name+' is finding subjects for '+this.npc.name+ ' WHAT DOES THIS CONTAIN '+this.npc);
    var speakingNPC = server.npcById(data.npcID);
    
  if (!speakingNPC) {
    util.log('Speaking NPC not found: ' + data.npcID)
    return
  }     
    
    server.socket.to(this.id).emit('player chat subjects', {id: this.id, dialog: speakingNPC['dialog']})

}

module.exports.onPlayerChatSubjects = onPlayerChatSubjects;

// Player is asking a question
function onPlayerChatAsk (data) {

  var chattingPlayer = server.playerById(this.id);

  // Player not found
  if (!chattingPlayer) {
    util.log('Player not found: ' + this.id)
    return
  } 

  var speakingNPC = server.npcById(data.npcID);
    
  if (!speakingNPC) {
    util.log('Speaking NPC not found: ' + data.npcID)
    return
  }     

  if(speakingNPC.secretdialog == undefined){
      server.socket.to(this.id).emit('player chat response', {id: this.id, response: "This person doesn't seem to know what you are talking about."})
      return;
  } else {

      var topicArray = data.question.split(' ');
      var secretTopics = Object.keys(speakingNPC.secretdialog);
      for(var i=0; i<secretTopics.length; i++){
          for(var j=0; j<speakingNPC.secretdialog[secretTopics[i]].alias.length; j++){
              for(var k=0; k<topicArray.length; k++){
//WOO DOG - Go through each secret dialog, check each alias in the alias array to the array of whever the user entered. If the alias turns up positive, return the response and eval any kind of function there might be. Also, make everything lower case so that this is an even longer evaluation
                if(speakingNPC.secretdialog[secretTopics[i]].alias[j].toLowerCase().search(topicArray[k].toLowerCase()) != -1){

                    if(speakingNPC.secretdialog[secretTopics[i]].response != undefined){
                        server.socket.to(this.id).emit('player chat response', {id: this.id, response: speakingNPC.secretdialog[secretTopics[i]].response})
                    }
                    
                    if(speakingNPC.secretdialog[secretTopics[i]].function != undefined){
                        DialogFunctions.dialogFunction(this.id, speakingNPC.secretdialog[secretTopics[i]].function, speakingNPC, secretTopics[i]);
                    }
                    
                    return;
                }
                              
              }
          }
      }
      
      server.socket.to(this.id).emit('player chat response', {id: this.id, response: "This person doesn't seem to know what you are talking about."})
      return;
  }
    

}

module.exports.onPlayerChatAsk = onPlayerChatAsk;