var util = require('util')

var server = require('./server');
var Combat = require('./Combat');
var MovementFunctions = require('./MovementFunctions');


// Player has moved THIS MAY BE DEPRECATED
/*
function onMovePlayer (data) {
  // Find player in array
  var movePlayer = playerById(this.id)
    
  // Player not found
  if (!movePlayer) {
    console.log('Player not found: ', this.id)
    return
  }

  // Room number not found
  if (!rooms[data.roomid]){
    console.log('Room not found: ', data.roomid);
    return      
  }
    
  if(movePlayer.PC.currentBattle != null){
      socket.to(movePlayer.id).emit('message', {message: "You are in battle!"});      
      return;
  }


  this.broadcast.to('room'+movePlayer.PC.roomid).emit('message', {message: movePlayer.PC.name + " leaves the room."});
    
  this.to(this.id).leave('room'+movePlayer.PC.roomid);
  this.to(this.id).join('room'+data.roomid);    

    
  console.log('Moving Player ' + movePlayer.id + ' from room '+ movePlayer.PC.roomid +' to room ' + data.roomid);
  // Update player position
  movePlayer.PC.roomid = data.roomid;

  socket.to(movePlayer.id).emit('message', {message: "You move to "+roomById(data.roomid).getRoomName()});
  this.broadcast.to('room'+movePlayer.PC.roomid).emit('message', {message: movePlayer.PC.name + " walks into the room."});    
    
  socket.to(movePlayer.id).emit('move player', {id: movePlayer.id, roomName: roomById(movePlayer.PC.roomid).name, mapx: roomById(data.roomid).mapX, mapy: roomById(data.roomid).mapY, mapImage: roomById(data.roomid).region['map']});
    
} 
// PROBABLY DELETE

module.exports.onMovePlayer = onMovePlayer;
*/


// Player is moving about the cabin
function onPlayerGo (data) {
  // Find player in array
  var goingPlayer = server.playerById(this.id)
  var newRoomID = server.roomById(goingPlayer.PC.roomid).roomExits[data.exit];
  console.log('Player Name: ' + goingPlayer.PC.name + ' Going ' + data.exit + ' ' + newRoomID);
    
  // Player not found
  if (!goingPlayer) {
    console.log('Going Player not found: ', this.id)
    return
  }

  if(goingPlayer.PC.currentBattle != null){
      server.socket.to(goingPlayer.id).emit('message', {message: "You are in battle!", styles: [{color: '#ffffff', weight: 'bold'}]});      
      return;
  }   
    
  // Room number not found
  if (!server.roomById(newRoomID)){
    console.log('Room not found: ', newRoomID);
    server.socket.to(goingPlayer.id).emit('message', {message: "You can't go "+data.exit+" from here!", styles: [{color: '#ffffff', weight: 'bold'}]});
    return      
  }
    
  if(server.roomById(goingPlayer.PC.roomid).roomExitFunctions != undefined){

    if (server.roomById(goingPlayer.PC.roomid).roomExitFunctions[data.exit] != undefined ){

        MovementFunctions.movementFunction(goingPlayer.id, server.roomById(goingPlayer.PC.roomid).roomExitFunctions[data.exit].function)
    }
  }
    
  this.broadcast.to('room'+goingPlayer.PC.roomid).emit('message', {message: goingPlayer.PC.name + " walks " + data.exit, styles: [{color: '#ffffff', weight: 'bold'}]});
    
  this.to(this.id).leave('room'+goingPlayer.PC.roomid);
  this.to(this.id).join('room'+newRoomID);    
    
  // Update player position
  goingPlayer.PC.roomid = newRoomID;

  server.socket.to(goingPlayer.id).emit('message', {message: "You walk "+data.exit, styles: [{color: '#ffffff', weight: 'bold'}]});
  this.broadcast.to('room'+goingPlayer.PC.roomid).emit('message', {message: goingPlayer.PC.name + " walks into the room.", styles: [{color: '#ffffff', weight: 'bold'}]}); 

  var shopCheck;
    
  var newRoomShop = server.roomById(goingPlayer.PC.roomid)['shop'];
  if(newRoomShop == undefined){
      shopCheck = false;
  } else {
      shopCheck = true;
  }

  var propertyCheck; 
    
  var newRoomProperty = server.propertyById(goingPlayer.PC.roomid);
  if(newRoomProperty == undefined){
      propertyCheck = false;
  } else {
      if(newRoomProperty.owner == goingPlayer.PC.id){
        propertyCheck = 'You';          
      } else {
        propertyCheck = true;
      }
  }    
    
  server.socket.to(goingPlayer.id).emit('move player', {id: goingPlayer.id, roomName: server.roomById(goingPlayer.PC.roomid).name, mapx: server.roomById(goingPlayer.PC.roomid).mapX, mapy: server.roomById(goingPlayer.PC.roomid).mapY, transitionx: server.roomById(goingPlayer.PC.roomid).transitionX, transitiony: server.roomById(goingPlayer.PC.roomid).transitionY, shop: shopCheck, property: propertyCheck, mapImage: server.roomById(goingPlayer.PC.roomid).region['map']});
    
    Combat.checkCombat(goingPlayer.id, goingPlayer.PC.roomid);

}

module.exports.onPlayerGo = onPlayerGo;

// NPC Roaming
function roamNPC (npcId) {
    var roamingNPC = server.npcById(npcId);
    
    if(roamingNPC == undefined){
        util.log('UNABLE TO FIND ROAMING NPC: '+npcId)
        return;
    }
    
    if(roamingNPC.currentBattle != null){
        util.log('UNABLE TO ROAM NPC IN BATTLE: '+npcId)
        roamingNPC.roamingTimeOut = null;
        return;
    }
    
    var npcRoom = server.roomById(roamingNPC.roomid);
    var roomExits = npcRoom.roomExits;
    var npcRoamArea = roamingNPC.roaming['area'];
    var potentialExits = server.roomExitsByArea(roamingNPC.roomid, npcRoamArea);

    if(!potentialExits){
        util.log('ROAMING NPC HAS NO VALID EXITS: '+roamingNPC.name);
        return;
    }
    
    if(potentialExits.length < 1){
        roamingNPC.roamingTimeOut = null;
        return;
        
    }
    var randomExitIndex;
    if(potentialExits.length == 1){
        randomExitIndex = 0;
    }
    randomExitIndex = server.getRandomInt(0, potentialExits.length-1);
    var newRoomId = npcRoom.roomExits[potentialExits[randomExitIndex]];
    
    server.socket.to('room'+roamingNPC.roomid).emit('message', {message: roamingNPC.name + " walks out of the area heading "+potentialExits[randomExitIndex]+".", styles: [{color: '#ffffff', weight: 'bold'}]}); 
    
    roamingNPC.roomid = newRoomId;
    util.log('Roaming NPC '+roamingNPC.name+' moves to room '+ newRoomId);
    
    exitTaken = server.roomExitsByRoomId(npcRoom.roomid, roamingNPC.roomid);

    server.socket.to('room'+roamingNPC.roomid).emit('message', {message: roamingNPC.name + " walks into the area from the "+exitTaken+".", styles: [{color: '#ffffff', weight: 'bold'}]}); 
    
    roamingNPC.roamingTimeOut = null;
    
    var playersInRoom = server.playersByRoom(newRoomId);

    for(var i=0; i<playersInRoom.length; i++){ //CHECK FOR COMBAT
        Combat.checkCombat(playersInRoom[i].id, playersInRoom[i].PC.roomid);        
    }

    
}
module.exports.roamNPC = roamNPC;
