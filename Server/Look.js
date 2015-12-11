var util = require('util')

var server = require('./server');


// Player has looked
function onPlayerLook (data) {
    // Find player in array
    var lookingPlayer = server.playerById(data.id);
    
    // Player not found
    if (!lookingPlayer) {
    console.log('Looking Player not found: ', data.id)
    return
    }
    
    console.log('Player Looking: ' + data.id + ' Name: ' + lookingPlayer.PC.name + ' at room ' + server.roomById(lookingPlayer.PC.roomid).name);

    // ROom not found
    if (!server.roomById(lookingPlayer.PC.roomid)) {
    console.log('Player Room not found: ', lookingPlayer.PC.roomid)
    return
    }
    
    var roomExits = "";

    if(server.roomById(lookingPlayer.PC.roomid).roomExits["North"] != undefined){
        roomExits += "North | ";
    }
    if(server.roomById(lookingPlayer.PC.roomid).roomExits["East"] != undefined){
        roomExits += "East | ";
    }    
    if(server.roomById(lookingPlayer.PC.roomid).roomExits["South"] != undefined){
        roomExits += "South | ";
    }    
    if(server.roomById(lookingPlayer.PC.roomid).roomExits["West"] != undefined){
        roomExits += "West | ";
    }
    if(server.roomById(lookingPlayer.PC.roomid).roomExits["Northwest"] != undefined){
        roomExits += "Northwest | ";
    }
    if(server.roomById(lookingPlayer.PC.roomid).roomExits["Northeast"] != undefined){
        roomExits += "Northeast | ";
    }    
    if(server.roomById(lookingPlayer.PC.roomid).roomExits["Southwest"] != undefined){
        roomExits += "Southwest | ";
    }    
    if(server.roomById(lookingPlayer.PC.roomid).roomExits["Southeast"] != undefined){
        roomExits += "Southeast | ";
    }    
    if(server.roomById(lookingPlayer.PC.roomid).roomExits["Up"] != undefined){
        roomExits += "Up | ";
    }    
    if(server.roomById(lookingPlayer.PC.roomid).roomExits["Down"] != undefined){
        roomExits += "Down";
    }      
    if(roomExits.charAt(roomExits.length-2) === '|'){
        roomExits = roomExits.substring(0, roomExits.length-3);
    }
    //roomExits += "\n";
    
    var stylesArray = [];
    var completeMessage = '';
    
    //this.emit('message part', {message: server.roomById(lookingPlayer.PC.roomid).getRoomName()+"\n", color: '#19de65', weight: 'bold'});  
    stylesArray.push( {color: '#19de65', weight: 'bold', position: completeMessage.length})
    completeMessage += server.roomById(lookingPlayer.PC.roomid).getRoomName()+"\n";
    
    stylesArray.push( {weight: 'normal', position: completeMessage.length})
    completeMessage += server.roomById(lookingPlayer.PC.roomid).getRoomDescription();
    //this.emit('message part', {message: server.roomById(lookingPlayer.PC.roomid).getRoomDescription(), weight: 'normal'}); 
    
    var roomInteractiveObjects = server.interactiveObjectsInRoom(lookingPlayer.PC.roomid);
    
    if(roomInteractiveObjects.length > 0){
        stylesArray.push( {color: '#ffffff', weight: 'bold', position: completeMessage.length})
        completeMessage += "\n";
        
        for(var i=0; i<roomInteractiveObjects.length; i++){
            stylesArray.push( {color: '#aaaaaa', weight: 'bold', position: completeMessage.length})
            completeMessage += roomInteractiveObjects[i].roomDescription;
              
            if(i != roomInteractiveObjects.length-1){
                stylesArray.push( {color: '#ffffff',weight: 'bold', position: completeMessage.length})
                completeMessage += ", ";

            }

        }
    }
    
    // BEGIN EXITS DESCRIPTION *****************************************************************
    stylesArray.push( {color: '#19de65', weight: 'bold', position: completeMessage.length})
    completeMessage += "\nExits: ";
    //this.emit('message part', {message: "\nExits: ", color: '#19de65', weight: 'bold'});
  

    var roomExitsSplit = roomExits.split(" ");

    for(var i=0;i < roomExitsSplit.length; i++){
      if(roomExitsSplit[i] === '|'){
        stylesArray.push( {color: '#ffffff',weight: 'bold', position: completeMessage.length})
        completeMessage += " " + roomExitsSplit[i] + " ";
        //this.emit('message part', {message: " " + roomExitsSplit[i] + " ", color: '#ffffff',weight: 'bold'});            
      } else {
        stylesArray.push( {color: '#ba00ab', weight: 'normal', position: completeMessage.length})
        completeMessage += roomExitsSplit[i];
        //this.emit('message part', {message: roomExitsSplit[i], color: '#ba00ab',weight: 'normal'});            
      }
    }

    //var roomPlayers = playersByRoom(lookingPlayer.PC.roomid);
    var roomPCs = server.pcsByRoom(lookingPlayer.PC.roomid);
    
    if(roomPCs.length > 1){
        
        stylesArray.push( {color: '#ffffff', weight: 'bold', position: completeMessage.length})
        completeMessage += "\n";
        
        stylesArray.push( {color: '#19de65', weight: 'bold', position: completeMessage.length})
        completeMessage += "Players: ";
        //this.emit('message part', {message: "Players: ", color: '#19de65', weight: 'bold'});  

        for(var i=0; i<roomPCs.length; i++){
            if(roomPCs[i].id != lookingPlayer.PC.id){
                stylesArray.push( {color: '#5959ff',weight: 'normal', position: completeMessage.length})
                completeMessage += roomPCs[i].name;
                //this.emit('message part', {message: roomPCs[i].name, color: '#5959ff',weight: 'normal'});
                
                if(i != roomPCs.length-1){
                    stylesArray.push( {color: '#ffffff',weight: 'bold', position: completeMessage.length})
                    completeMessage += ", ";
                    //this.emit('message part', {message: ", ", color: '#ffffff',weight: 'bold'});
                }
            }

        }

    }
    
    var roomNPCs = server.npcInRoom(lookingPlayer.PC.roomid);

    if(roomNPCs.length > 0){
        for(var i=0; i<roomNPCs.length; i++){ // ARE THERE ANY VISIBLE NPCS IN THE ROOM?
            if(roomNPCs[i].visibility != 'none'){
                stylesArray.push( {color: '#ffffff', weight: 'bold', position: completeMessage.length})
                completeMessage += "\n";
                //this.emit('message part', {message: "\n", color: '#ffffff',weight: 'bold'});

                stylesArray.push( {color: '#19de65', weight: 'bold', position: completeMessage.length})
                completeMessage += "Characters: ";
                //this.emit('message part', {message: "Characters: ", color: '#19de65', weight: 'bold'});                             
                break;
            }
        }
        
        for(var i=0; i<roomNPCs.length; i++){
            
            if(roomNPCs[i].visibility != 'none'){
            
                stylesArray.push( {color: server.colorByAllegiance(lookingPlayer.PC.allegiances[roomNPCs[i].allegiance]), weight: 'normal', position: completeMessage.length})
                completeMessage += roomNPCs[i].roomDescription;
                //this.emit('message part', {message: roomNPCs[i].roomDescription, color: server.colorByAllegiance(lookingPlayer.PC.allegiances[roomNPCs[i].allegiance]),weight: 'normal'});            

                if(i != roomNPCs.length-1){
                    stylesArray.push( {color: '#ffffff',weight: 'bold', position: completeMessage.length})
                    completeMessage += ", ";
                    //this.emit('message part', {message: ", ", color: '#ffffff',weight: 'bold'});
                }
            }

        }
    }
    
    // NEW - SHOW CORPSES
    var roomCorpses = server.corpseInRoom(lookingPlayer.PC.roomid);

    if(roomCorpses.length > 0){
        stylesArray.push( {color: '#ffffff',weight: 'bold', position: completeMessage.length})
        completeMessage += "\n";
        //this.emit('message part', {message: "\n", color: '#ffffff',weight: 'bold'});
        
        stylesArray.push( {color: '#19de65', weight: 'bold', position: completeMessage.length})
        completeMessage += "Corpses: ";
        //this.emit('message part', {message: "Corpses: ", color: '#19de65', weight: 'bold'});  

        for(var i=0; i<roomCorpses.length; i++){
            stylesArray.push( {color: '#aa0000' ,weight: 'normal', position: completeMessage.length})
            completeMessage += roomCorpses[i].name;
            //this.emit('message part', {message: roomCorpses[i].name, color: '#aa0000' ,weight: 'normal'});            
            
            if(i != roomCorpses.length-1){
                stylesArray.push( {color: '#ffffff', weight: 'bold', position: completeMessage.length})
                completeMessage += ", ";
                //this.emit('message part', {message: ", ", color: '#ffffff',weight: 'bold'});
            }

        }
    }
        
    
    var lookingRoomItems = server.itemsInRoom(lookingPlayer.PC.roomid);

    if(lookingRoomItems.length > 0){
        stylesArray.push( {color: '#ffffff',weight: 'bold', position: completeMessage.length})
        completeMessage += "\n";
        //this.emit('message part', {message: "\n", color: '#ffffff',weight: 'bold'});
        
        stylesArray.push( {color: '#19de65', weight: 'bold', position: completeMessage.length})
        completeMessage += "Items: ";
        //this.emit('message part', {message: "Items: ", color: '#19de65', weight: 'bold'});  

        for(var i=0; i<lookingRoomItems.length; i++){
            stylesArray.push( {color: '#bbbbbb',weight: 'bold', position: completeMessage.length})
            completeMessage += lookingRoomItems[i].name;
            //this.emit('message part', {message: lookingRoomItems[i].name, color: '#bbbbbb',weight: 'bold'});            
            
            if(i != lookingRoomItems.length-1){
                stylesArray.push( {color: '#ffffff',weight: 'bold', position: completeMessage.length})
                completeMessage += ", ";
                //this.emit('message part', {message: ", ", color: '#ffffff',weight: 'bold'});
            }

        }

        

    }
    
    var lookingRoomMoney
    
    if(server.roomById(lookingPlayer.PC.roomid).money != undefined){
        lookingRoomMoney = server.currencyExchange(server.roomById(lookingPlayer.PC.roomid).money);
    }

    if(lookingRoomMoney != undefined && server.roomById(lookingPlayer.PC.roomid).money != 0){
        stylesArray.push( {color: '#ffffff',weight: 'bold', position: completeMessage.length})
        completeMessage += "\n";

        if(lookingRoomMoney[0] != 0){
            stylesArray.push( {color: '#fbff00', weight: 'Bold', position: completeMessage.length})
            completeMessage += lookingRoomMoney[0] + ' Crown,';
                    
            if(lookingRoomMoney[1] != 0 || lookingRoomMoney[2] != 0){
                completeMessage += ', ';
            }
        }
        
        if(lookingRoomMoney[1] != 0){        
            stylesArray.push( {color: '#999999', weight: 'Bold', position: completeMessage.length})
            completeMessage += lookingRoomMoney[1] + ' Shilling';

            if(lookingRoomMoney[2] != 0){
                completeMessage += ', ';
            }                    
        }
        
        
        if(lookingRoomMoney[2] != 0){
            stylesArray.push( {color: '#ff9f0f', weight: 'Bold', position: completeMessage.length})
            completeMessage += lookingRoomMoney[2] + ' Pence';        
        }
    }
    
    stylesArray.push( {color: '#ffffff',weight: 'bold', position: completeMessage.length})

    //this.emit('message', {message: completeMessage, styles: stylesArray});
    server.socket.to(lookingPlayer.id).emit('message', {message: completeMessage, styles: stylesArray});
}

module.exports.onPlayerLook = onPlayerLook;

// Player is looking at
function onPlayerLookAt (data) {
    var objectFound = 0;
    var lookObject = data.input;
    var NPCResponse, itemInRoomResponse, itemInInventoryResponse, PCResponse, interactiveItemInRoomResponse;
    if(lookObject.search("at ") == 0){
        lookObject = lookObject.substring(lookObject.search(" ")+1, lookObject.length);
    }
    var lookingPlayer = server.playerById(this.id);
    console.log('Player Looking: ' + this.id + ' Name: ' + lookingPlayer.PC.name + ' at Object ' + lookObject);
    
    flavorResponse = server.flavorInRoom(lookingPlayer.PC.roomid, lookObject);

    if(flavorResponse != undefined){
        this.emit('message', {message: flavorResponse, styles: [{color: '#ffffff', weight: 'normal'}]});
        objectFound = 1;
        return;
    }
    
    NPCResponse = server.npcInRoomByAlias(lookingPlayer.PC.roomid, lookObject);

    if(NPCResponse != undefined){
        this.emit('message', {message: NPCResponse, styles: [{color: '#ffffff', weight: 'normal'}]});
        objectFound = 1;
        return;
    }
    
    itemInRoomResponse = server.itemsInRoomByAlias(lookingPlayer.PC.roomid, lookObject);

    if(itemInRoomResponse != undefined){
        this.emit('message', {message: itemInRoomResponse, styles: [{color: '#ffffff', weight: 'normal'}]});
        objectFound = 1;
        return;
    }

    itemInInventoryResponse = server.itemsInInventoryByAlias(lookingPlayer.PC, lookObject);

    if(itemInInventoryResponse != undefined){
        this.emit('message', {message: itemInInventoryResponse, styles: [{color: '#ffffff', weight: 'normal'}]});
        objectFound = 1;
        return;
    }
    

    PCResponse = server.pcInRoomByAlias(lookingPlayer.PC.roomid, lookObject);

    if(PCResponse != undefined){
        this.emit('message', {message: PCResponse, styles: [{color: '#ffffff', weight: 'normal'}]});
        objectFound = 1;
        return;
    }
    
    interactiveItemInRoomResponse = server.interactiveObjectsInRoomByAlias(lookingPlayer.PC.roomid, lookObject);

    if(interactiveItemInRoomResponse != undefined){
        this.emit('message', {message: interactiveItemInRoomResponse, styles: [{color: '#ffffff', weight: 'normal'}]});
        objectFound = 1;
        return;
    }    
    
    if(objectFound == 0){
        this.emit('message', {message: "You can't see any " + lookObject + " here.", styles: [{color: '#ffffff', weight: 'bold'}]});    
    }    
}

module.exports.onPlayerLookAt = onPlayerLookAt;
