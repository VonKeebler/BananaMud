var util = require('util')

var server = require('./server');
var ItemFunctions = require('./ItemFunctions')

// Player is using something
function onPlayerUse (data) {
    var objectFound = 0;
    var useObject = data.item;
    var itemInRoomResponse, itemInInventoryResponse;

    var usingPlayer = server.playerById(this.id);
    console.log('Player Using: ' + this.id + ' Name: ' + usingPlayer.PC.name + ' using ' + useObject);
    
    itemInInventory = server.useItemInInventory(usingPlayer.PC, useObject);

    if(itemInInventory != undefined){
        //this.emit('message', {message: itemInInventoryResponse+"\n", color: '#ffffff', weight: 'normal'});
        ItemFunctions.useItem(this.id, itemInInventory)
        objectFound = 1;
    }
    
    itemInRoom = server.useItemInRoom(usingPlayer.PC.roomid, useObject);

    if(itemInRoom != undefined){
        //this.emit('message', {message: itemInRoomResponse+"\n", color: '#ffffff', weight: 'normal'});
        ItemFunctions.useItem(this.id, itemInRoom)
        objectFound = 1;
    }
    
    if(objectFound == 0){
        this.emit('message', {message: "You can't see any " + useObject + " to use here.", styles: [{color: '#ffffff', weight: 'bold'}]});    
    }
}

module.exports.onPlayerUse = onPlayerUse;

// Player is using something
function onPlayerInteract (data) {
    var objectFound = 0;
    
    var interactionCommand = data.command.substring(0, data.command.search(" "));
    var interactionSubject = data.command.substring(data.command.search(" ")+1, data.command.length)

    var interactingPlayer = server.playerById(this.id);
    console.log('Player Interacting: ' + this.id + ' Name: ' + interactingPlayer.PC.name + ' Command: '+interactionCommand);
        
    var itemInRoomResponse = server.interactItemInRoom(interactingPlayer.id, interactingPlayer.PC.roomid, interactionCommand.toLowerCase(), interactionSubject);    

    if(itemInRoomResponse != undefined){
        
        objectFound = 1;
    }
    
    if(objectFound == 0){
        this.emit('message', {message: "You can't see any " + interactionSubject + " to "+interactionCommand+" here.", styles: [{color: '#ffffff', weight: 'bold'}]});    
    }
}

module.exports.onPlayerInteract = onPlayerInteract;
