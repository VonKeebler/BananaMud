var util = require('util')

var server = require('./server');

var Player = require('./Player')
var Room = require('./Room')
var Item = require('./Item')
var NPC = require('./NPC')
var PC = require('./PC')

var Fileloader = require('./Fileloader.js');

// Player is trying to chat
function onPlayerTake (data) {
    var takingPlayer = server.playerById(this.id);
    util.log(takingPlayer.PC.name + ' taking ' + data.item);
    var roomItems = server.itemsInRoom(takingPlayer.PC.roomid);
    
    if(data.item.toLowerCase().search("money") != -1 || data.item.toLowerCase().search("pence") != -1 || data.item.toLowerCase() == "shilling" || data.item.toLowerCase().search("crown") != -1){
        
        var moneyRoom = server.roomById(takingPlayer.PC.roomid);
        
        if(moneyRoom.money != undefined){
            server.addMoneyToCharacter(takingPlayer.id, moneyRoom.money)
            server.removeMoneyFromRoom(moneyRoom.roomid, moneyRoom.money)
            
            server.socket.to(this.id).emit('message', {message: "You take the money.", styles: [{color: '#ffffff', weight: 'Bold'}]});
            this.broadcast.to('room'+takingPlayer.PC.roomid).emit('message', {message: takingPlayer.PC.name + " picks up some money laying around here.", styles: [{color: '#ffffff', weight: 'Bold'}]}); 
            
            return;
        } 
    }
    
    for(var i = 0; i<roomItems.length; i++){

        if(roomItems[i].name.toLowerCase().search(data.item.toLowerCase()) != -1){

            server.addItemToCharacter(roomItems[i].itemID, takingPlayer.id, 1);
            
            server.removeItemFromRoom(roomItems[i].itemID, takingPlayer.PC.roomid, 1);
            
            this.broadcast.to('room'+takingPlayer.PC.roomid).emit('message', {message: takingPlayer.PC.name + " takes the "+roomItems[i].name+".", styles: [{color: '#ffffff', weight: 'Bold'}]});    

            server.socket.to(this.id).emit('message', {message: "You take the "+roomItems[i].name+".", styles: [{color: '#ffffff', weight: 'Bold'}]})            
            return;
        }
    }
    server.socket.to(this.id).emit('message', {message: "You don't see any "+data.item+" to take.", styles: [{color: '#ffffff', weight: 'Bold'}]})            
}

module.exports.onPlayerTake = onPlayerTake;

// Player is trying to drop
function onPlayerDrop (data) {
    var droppingPlayer = server.playerById(this.id);
    var room = server.roomById(droppingPlayer.PC.roomid);
    util.log(droppingPlayer.PC.name + ' dropping ' + data.item + ' in ' + droppingPlayer.PC.roomid);
    
    if(!droppingPlayer.PC.inventory){
        server.socket.to(this.id).emit('message', {message: "You have nothing to drop.", styles: [{ color: '#ffffff', weight: 'Bold'}]});            
        return;
    }

    playerInventoryItems = Object.keys(droppingPlayer.PC.inventory);
    for(var i = 0; i<playerInventoryItems.length; i++){
        
        var itemToDrop = server.itemByItemID(playerInventoryItems[i]);

        if(itemToDrop.name.toLowerCase().search(data.item.toLowerCase()) != -1){

            server.addItemToRoom(itemToDrop.itemID, droppingPlayer.PC.roomid, 1);

            server.removeItemFromCharacter(itemToDrop.itemID, droppingPlayer.id, 1);

            this.broadcast.to('room'+droppingPlayer.PC.roomid).emit('message', {message: droppingPlayer.PC.name + " drops a "+itemToDrop.name+".", styles: [{ color: '#ffffff', weight: 'Bold'}]});    

            server.socket.to(this.id).emit('message', {message: "You drop the "+itemToDrop.name+".", styles: [{color: '#ffffff', weight: 'Bold'}]})            
            return;
        }
        
    }
    
    server.socket.to(this.id).emit('message', {message: "You don't have a "+data.item+" to drop.", styles: [{color: '#ffffff', weight: 'Bold'}]});            
    return;            
    
}

module.exports.onPlayerDrop = onPlayerDrop;
