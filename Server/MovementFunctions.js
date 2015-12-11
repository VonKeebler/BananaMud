var util = require('util')

var server = require('./server');


// Functions Triggered by Movement
function movementFunction (clientId, functionId) {
    var movingPlayer = server.playerById(clientId);

    if(functionId == "OLDSILVERMEREINNFIRSTVISIT"){
        var roomid = "RRSILVERMERE3";
        
        for(var i=0; i<rooms.length; i++){
            if(rooms[i].roomid == roomid){
                
                
                
                if(movingPlayer.movementFunctions == undefined){
                   movingPlayer.movementFunctions = {};
                }
                if(movingPlayer.movementFunctions['OLDSILVERMEREINNFIRSTVISIT'] == "true"){ return;}
                
                server.socket.to(movingPlayer.id).emit('message', {message: "On your way into the inn, a strange man bumps into you.", styles: [{color: '#ffffff', weight: 'Bold'}]});
                
                server.addItemToCharacter('itemOldSilvermereInnNote', movingPlayer.id, 1);
                
                movingPlayer.movementFunctions['OLDSILVERMEREINNFIRSTVISIT'] = "true";
                return;
            }
            
        }

        

        
        
    }    
}

module.exports.movementFunction = movementFunction;
