var util = require('util')

var server = require('./server');

// Property Functions
function onPlayerManageProperty(data) {
    var propertyPlayer = server.playerById(data.id);
    
    if(!propertyPlayer){
        util.log('NO PROPERTY PLAYER FOUND: '+data.id);
        return;
    }
    
    var propertyCharacter = propertyPlayer.PC;

    if(!propertyCharacter){
        util.log('NO PROPERTY CHARACTER FOUND: '+propertyPlayer.PC);
        return;
    }
    
    var propertyRoomId = propertyCharacter.roomid;
    
    var propertyRoom = server.roomById(propertyRoomId);

    if(!propertyRoom){
        util.log('NO PROPERTY ROOM FOUND: '+propertyRoomId);
        return;
    }  
    
    var propertyData = server.propertyById(propertyRoomId);

    if(!propertyData){
        util.log('NO PROPERTY DATA FOUND FOR: '+propertyRoomId);
        return;
    }     
    
    var propertyOwnerCheck = false;
    
    if(propertyData.owner == propertyCharacter.id){
        propertyOwnerCheck = true;
    }
    
    server.socket.to(data.id).emit('player manage property response', {propertyID: propertyData.propertyID, propertyOwnerCheck: propertyOwnerCheck, propertyName: propertyRoom.name, propertyType: propertyData.type, propertyIncome: propertyData.income, propertyValue: propertyData.value, propertyUpkeep: propertyData.upkeep, propertyAmenities: propertyData.amenities, propertyEmployees: propertyData.employees});            
   
}

module.exports.onPlayerManageProperty = onPlayerManageProperty;


function onPlayerBuyProperty(data) {
    var propertyPlayer = server.playerById(data.id);
    
    if(!propertyPlayer){
        util.log('NO PROPERTY PLAYER FOUND: '+data.id);
        return;
    }
    
    var propertyCharacter = propertyPlayer.PC;

    if(!propertyCharacter){
        util.log('NO PROPERTY CHARACTER FOUND: '+propertyPlayer.PC);
        return;
    }
    
    var propertyRoomId = propertyCharacter.roomid;
    
    var propertyRoom = server.roomById(propertyRoomId);

    if(!propertyRoom){
        util.log('NO PROPERTY ROOM FOUND: '+propertyRoomId);
        return;
    }  
    
    var propertyData = server.propertyById(propertyRoomId);

    if(!propertyData){
        util.log('NO PROPERTY DATA FOUND FOR: '+propertyRoomId);
        return;
    }     
    
    var propertyOwnerCheck = false;
    
    if(propertyData.owner == propertyCharacter.id){
        propertyOwnerCheck = true;
    }
    
    if(propertyOwnerCheck == true){
        util.log('PROPERTY ALREADY OWNED BY PLAYER');
    }
    
    if(propertyData.status != 'sale'){
        server.socket.to(data.id).emit('message', {message: "This property is not currently for sale.", styles: [{color: '#ffffff', weight: 'Bold'}]});            
        return;
    }
    
    util.log('CHARACTER '+propertyCharacter.name+' PURCHASING '+propertyRoom.name+' WITH ID '+propertyData.propertyID);
    
    if(propertyData.value > propertyCharacter.money){
        server.socket.to(data.id).emit('message', {message: "You cannot afford this property.", styles: [{color: '#ffffff', weight: 'Bold'}]});            
        return;        
    }
    
    for(var i=0; i < properties.length; i++){
        if(properties[i].propertyID == propertyData.propertyID){
            properties[i].owner = propertyCharacter.id;
            break;
        }
    }
    
    //server.socket.to(data.id).emit('player manage property response', {propertyID: propertyData.id, propertyOwnerCheck: propertyOwnerCheck, propertyName: propertyRoom.name, propertyType: propertyData.type, propertyValue: propertyData.value, propertyUpkeep: propertyData.upkeep, propertyAmenities: propertyData.amenities, propertyEmployees: propertyData.employees});            
   
}

module.exports.onPlayerBuyProperty = onPlayerBuyProperty;


function onPlayerAddEmployee(data) {
    var propertyPlayer = server.playerById(data.id);
    
    if(!propertyPlayer){
        util.log('NO PROPERTY PLAYER FOUND: '+data.id);
        return;
    }
    
    var propertyCharacter = propertyPlayer.PC;

    if(!propertyCharacter){
        util.log('NO PROPERTY CHARACTER FOUND: '+propertyPlayer.PC);
        return;
    }
    
    var propertyRoomId = propertyCharacter.roomid;
    
    var propertyRoom = server.roomById(propertyRoomId);

    if(!propertyRoom){
        util.log('NO PROPERTY ROOM FOUND: '+propertyRoomId);
        return;
    }  
    
    var propertyData = server.propertyById(propertyRoomId);

    if(!propertyData){
        util.log('NO PROPERTY DATA FOUND FOR: '+propertyRoomId);
        return;
    }     
    
    if(propertyData.owner != propertyCharacter.id){
        util.log('CHARACTER '+propertyCharacter.id+' NOT OWNER OF PROPERTY '+propertyRoomId);
        return;
    }
    
    var availableEmployees = server.employeesByCity(propertyData.city);
    
    for(var i=0; i<availableEmployees.length; i++){
        availableEmployees[i].cost = availableEmployees[i].upkeep*2;
    }
    
    server.socket.to(data.id).emit('player employees available', {availableEmployees: availableEmployees});            
   
}

module.exports.onPlayerAddEmployee = onPlayerAddEmployee;

function onPlayerEditProperty(data) {
    var propertyPlayer = server.playerById(data.id);
    
    if(!propertyPlayer){
        util.log('NO PROPERTY PLAYER FOUND: '+data.id);
        return;
    }
    
    var propertyCharacter = propertyPlayer.PC;

    if(!propertyCharacter){
        util.log('NO PROPERTY CHARACTER FOUND: '+propertyPlayer.PC);
        return;
    }
    
    var propertyRoomId = propertyCharacter.roomid;
    
    var propertyRoom = server.roomById(propertyRoomId);

    if(!propertyRoom){
        util.log('NO PROPERTY ROOM FOUND: '+propertyRoomId);
        return;
    }  
    
    var propertyData = server.propertyById(propertyRoomId);

    if(!propertyData){
        util.log('NO PROPERTY DATA FOUND FOR: '+propertyRoomId);
        return;
    }     
    
    if(propertyData.owner != propertyCharacter.id){
        util.log('CHARACTER '+propertyCharacter.id+' NOT OWNER OF PROPERTY '+propertyRoomId);
        return;
    }
    
    util.log('PLAYER '+propertyPlayer.PC.name+' EDITING PROPERTY INFO FOR '+propertyRoomId);
    
    var propertyName = propertyRoom.name;
    var propertyDescription = propertyRoom.description;

    server.socket.to(data.id).emit('player edit property data', {propertyName: propertyName, propertyDescription: propertyDescription});            
   
}

module.exports.onPlayerEditProperty = onPlayerEditProperty;

function onPlayerChangeProperty(data) {
    var propertyPlayer = server.playerById(data.id);
    
    if(!propertyPlayer){
        util.log('NO PROPERTY PLAYER FOUND: '+data.id);
        return;
    }
    
    var propertyCharacter = propertyPlayer.PC;

    if(!propertyCharacter){
        util.log('NO PROPERTY CHARACTER FOUND: '+propertyPlayer.PC);
        return;
    }
    
    var propertyRoomId = propertyCharacter.roomid;
    
    var propertyRoom = server.roomById(propertyRoomId);

    if(!propertyRoom){
        util.log('NO PROPERTY ROOM FOUND: '+propertyRoomId);
        return;
    }  
    
    var propertyData = server.propertyById(propertyRoomId);

    if(!propertyData){
        util.log('NO PROPERTY DATA FOUND FOR: '+propertyRoomId);
        return;
    }     
    
    if(propertyData.owner != propertyCharacter.id){
        util.log('CHARACTER '+propertyCharacter.id+' NOT OWNER OF PROPERTY '+propertyRoomId);
        return;
    }
    
    util.log('PLAYER '+propertyPlayer.PC.name+' EDITING PROPERTY INFO FOR '+propertyRoomId);
    
    propertyRoom.name = data.propertyName;
    propertyRoom.description = data.propertyDescription;

}

module.exports.onPlayerChangeProperty = onPlayerChangeProperty;
