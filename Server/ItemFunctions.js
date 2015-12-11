var util = require('util')

var server = require('./server');

var interactionTimeOuts = [];

var OSHOLDSTEELDOORKnocks = 0;

// Use Objects
function useItem (clientId, item) {
    usingPlayer = server.playerById(clientId);
    if(item == "itemCousinsLetter"){

        server.socket.to(clientId).emit('pop image', {image: "cousinLetterPop"});
        return;
    }
    if(item == "itemCousinsLetter2Envelope"){
        server.socket.to(usingPlayer.id).emit('message', {message: "You open the envelope to find another letter from your cousin inside.", styles: [{color: '#ffffff', weight: 'Normal'}]});
        server.socket.to(clientId).emit('pop image', {image: "cousinLetter2Pop"});
        
        server.removeItemFromCharacter('itemCousinsLetter2Envelope', usingPlayer.id, 1);
        server.addItemToCharacter('itemCousinsLetter2', usingPlayer.id, 1);
        return;
    }
    if(item == "itemCousinsLetter2"){

        server.socket.to(clientId).emit('pop image', {image: "cousinLetter2Pop"});
        return;
    }
    
    if(item == "itemOldSilvermereInnNote"){

        server.socket.to(clientId).emit('pop image', {image: "OldSilvermereInnNotePop"});
        return;
    }    
}

module.exports.useItem = useItem;

function interactItem( clientId, item){
    interactingPlayer = server.playerById(clientId);
    
    if(item == "BLANORTHBRICK"){ // 2/10 BRICK IN BRICKLEAVERS ALLEY LEADING TO SECRET HIDE OUT *************

        server.socket.to(interactingPlayer.id).emit('message', {message: "You push the brick with 2/10 written on it. A pile of disused brick against the west wall slides backward to reveal a secret exit.", styles: [{color: '#ffffff', weight: 'Bold'}]});
       interactingPlayer.Socket.broadcast.to('room'+interactingPlayer.PC.roomid).emit('message', {message: interactingPlayer.PC.name + " pushes on a brick in the wall. A pile of bricks in the west wall slides backward to reveal a secret exit.", styles: [{color: '#ffffff', weight: 'Bold'}]});    
        
        server.socket.to('roomBLASECRET').emit('message', {message: "Without warning, a panel in the eastern wall slides aside to reveal a secret exit.", styles: [{color: '#ffffff', weight: 'Bold'}]});    
        
        for(var i = 0; i<rooms.length; i++){
            if (rooms[i].roomid == "BLANORTH"){
                rooms[i].roomExits['West'] = "BLASECRET";
                rooms[i].description = "    You stand in the northern end of Brickleavers Alley. You note the excess piles of brick, the namesake of the alley, littering the sides and making the space claustrophobic. Raucous echoes float down the alley from the South and an opening between two towers of brick to the Northwest may be your only reprieve. A pile of bricks in the western wall has been shifted back, revealing a secret exit."
            }
            if (rooms[i].roomid == "BLASECRET"){
                rooms[i].roomExits['East'] = "BLANORTH";
            }               
        }
        
        interactionTimeOuts.push( setTimeout(closeBLANORTHDoor, 10000, this) );
        
        return;
    }
    
    if(item == "BLASECRETLEVER"){// LEVER IN BRICKLEAVERS ALLEY SECRET HIDE OUT TO ESCAPE *************

        server.socket.to(interactingPlayer.id).emit('message', {message: "You pull the lever. A panel on the eastern wall slides away to reveal a secret exit.", styles: [{color: '#ffffff', weight: 'Bold'}]});
        interactingPlayer.Socket.broadcast.to('room'+interactingPlayer.PC.roomid).emit('message', {message: interactingPlayer.PC.name + " pulls a lever on the wall. A panel on the eastern wall slides away to reveal a secret exit.", styles: [{color: '#ffffff', weight: 'Bold'}]});    
        
        for(var i = 0; i<rooms.length; i++){
            if (rooms[i].roomid == "BLANORTH"){
                rooms[i].roomExits['West'] = "BLASECRET";
                rooms[i].description = "    You stand in the northern end of Brickleavers Alley. You note the excess piles of brick, the namesake of the alley, littering the sides and making the space claustrophobic. Raucous echoes float down the alley from the South and an opening between two towers of brick to the Northwest may be your only reprieve. A pile of bricks in the western wall has been shifted back, revealing a secret exit."
            }
            
            if (rooms[i].roomid == "BLASECRET"){
                rooms[i].roomExits['East'] = "BLANORTH";
            }            
        }
        
        interactionTimeOuts.push( setTimeout(closeBLANORTHDoor, 10000, this) );
        
        return;
    }
    
    
    if(item == "OSHSTEELDOOR"){// STEEL DOOR IN OLD SILVER HOLLOW *************
        OSHOLDSTEELDOORKnocks++;
        if(OSHOLDSTEELDOORKnocks == 1){

            server.socket.to(interactingPlayer.id).emit('message', {message: "You knock on the steel door. A deep hollow pounding is the only response.", styles: [{color: '#ffffff', weight: 'Bold'}]});
            interactingPlayer.Socket.broadcast.to('room'+interactingPlayer.PC.roomid).emit('message', {message: interactingPlayer.PC.name + " knocks on the old steel door.", styles: [{color: '#ffffff', weight: 'Bold'}]});             
            
        } else if(OSHOLDSTEELDOORKnocks == 2){

            server.socket.to(interactingPlayer.id).emit('message', {message: "The panel in the steel door slides open and two dark, beady eyes appear. A tiny voice pipes out 'WAT?'", styles: [{color: '#ffffff', weight: 'Bold'}]});
            interactingPlayer.Socket.broadcast.to('room'+interactingPlayer.PC.roomid).emit('message', {message: interactingPlayer.PC.name + " knocks on the old steel door. A panel in the door slides open and a tiny voice on the other side pipes out 'WAT?'", styles: [{color: '#ffffff', weight: 'Bold'}]});            
            
            for(var i=0; i<npcs.length; i++){
                if(npcs[i].name == "A Pair of Beady Eyeballs"){
                    npcs[i].roomid = "OLDSILVERHOLLOW7";
                }
            }
            
        } else {
        
            server.socket.to(interactingPlayer.id).emit('message', {message: "The person behind the door is visibly agitated by your continued knocks.", styles: [{color: '#ffffff', weight: 'Bold'}]});
            interactingPlayer.Socket.broadcast.to('room'+interactingPlayer.PC.roomid).emit('message', {message: interactingPlayer.PC.name + " knocks on the old steel door.", styles: [{color: '#ffffff', weight: 'Bold'}]});
            
        }        
        
        interactionTimeOuts.push( setTimeout(resetOSHSTEELDOORKnocks, 60000, this) );
        return;
    }
    
    if(item == "RREASTUMBEREASTMANHOLE"){// MANHOLE COVER IN RUTHER'S ROAD EAST UMBERTON *************

        server.socket.to(interactingPlayer.id).emit('message', {message: "You open the manhole and decend into the sewer.", styles: [{color: '#ffffff', weight: 'Bold'}]});
        
        interactingPlayer.Socket.broadcast.to('room'+interactingPlayer.PC.roomid).emit('message', {message: interactingPlayer.PC.name + " opens the manhole and climbs down.", styles: [{color: '#ffffff', weight: 'Normal'}]});
        
        interactingPlayer.Socket.to(interactingPlayer.id).leave('room'+interactingPlayer.PC.roomid);
        interactingPlayer.Socket.to(interactingPlayer.id).join('roomTHERUSSEWERMAIN1');        
      
        interactingPlayer.PC.roomid = "THERUSSEWERMAIN1";

        interactingPlayer.Socket.broadcast.to('roomTHERUSSEWERMAIN1').emit('message', {message: interactingPlayer.PC.name + " climbs down from above.", styles: [{color: '#ffffff', weight: 'Normal'}]});        
        
        server.socket.to(interactingPlayer.id).emit('move player', {id: interactingPlayer.id, roomName: server.roomById("THERUSSEWERMAIN1").name, mapx: server.roomById("THERUSSEWERMAIN1").mapX, mapy: server.roomById("THERUSSEWERMAIN1").mapY, mapImage: server.roomById("THERUSSEWERMAIN1").region['map']});        
        
        return;
    }     
    
}
module.exports.interactItem = interactItem;



//*********************************************************************************************
// ROOM ITEM INTERACTION TIMEOUTS
//*********************************************************************************************

function closeBLANORTHDoor(){

    for(var i = 0; i<rooms.length; i++){
        if (rooms[i].roomid == "BLANORTH"){
            server.socket.to('roomBLANORTH').emit('message', {message: "With a slow grinding, the bricks forming the revealed exit in the west wall slide close.", styles: [{color: '#ffffff', weight: 'Bold'}]});
            
            server.socket.to('roomBLASECRET').emit('message', {message: "With a slow grinding, the panel in the eastern wall slides back into place, closing the exit.", styles: [{color: '#ffffff', weight: 'Bold'}]});            
            
            delete rooms[i].roomExits['West'];
            rooms[i].description = "    You stand in the northern end of Brickleavers Alley. You note the excess piles of brick, the namesake of the alley, littering the sides and making the space claustrophobic. Raucous echoes float down the alley from the South and an opening between two towers of brick to the Northwest may be your only reprieve."
        }
        if (rooms[i].roomid == "BLASECRET"){
            delete rooms[i].roomExits['East'];
        }          
    }
    
    return;
}

function resetOSHSTEELDOORKnocks(){
    
    for(var i = 0; i<rooms.length; i++){
        if (rooms[i].roomid == "OLDSILVERHOLLOW7" && rooms[i].roomExits['South'] != undefined){
            OSHOLDSTEELDOORKnocks = 0;
            return;
        }

    }
    
    if(OSHOLDSTEELDOORKnocks > 1){
        server.socket.to('room'+interactingPlayer.PC.roomid).emit('message', {message: "The panel in the steel door slides shut sharply.", styles: [{color: '#ffffff', weight: 'Bold'}]});    
    }
    
    OSHOLDSTEELDOORKnocks = 0;

    for(var i=0; i<npcs.length; i++){
        if(npcs[i].name == "A Pair of Beady Eyeballs"){
            npcs[i].roomid = "";
        }
    }
    
    return;
}