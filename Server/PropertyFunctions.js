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
    
    if(propertyData.value > propertyCharacter.money){
        server.socket.to(data.id).emit('message', {message: "You cannot afford this property.", styles: [{color: '#ffffff', weight: 'Bold'}]});            
        return;        
    }

    util.log('CHARACTER '+propertyCharacter.name+' PURCHASING '+propertyRoom.name+' WITH ID '+propertyData.propertyID);    
    
    for(var i=0; i < properties.length; i++){
        if(properties[i].propertyID == propertyData.propertyID){
            properties[i].owner = propertyCharacter.id;
            properties[i].status = "owned";
            properties[i].datePurchased = Date();
            break;
        }
    }
    
    server.socket.to(data.id).emit('player buy property success', {propertyName: propertyRoom.name}); 

   
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
    
    var availableEmployees = server.availableEmployeesByCity(propertyData.city);
    
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

function onPlayerViewAddAmenities(data) {
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
    
    util.log('PLAYER '+propertyPlayer.PC.name+' VIEWING AMENITIES FOR '+propertyRoomId);

    var propertyCity = server.cityById(propertyData.city);
    var returnedAmenities = [];
    
    for(var i=0; i<amenities.length; i++){
        if(amenities[i].amenityID != "cooking" && amenities[i].amenityID != "brewing" && amenities[i].amenityID != "weapon smithing" && amenities[i].amenityID != "armor smithing" && amenities[i].amenityID != "enchanting" && amenities[i].amenityID != "refinery") {
            amenities[i].localSupply = propertyCity.market[amenities[i].amenityID].supply;
            amenities[i].localDemand = propertyCity.market[amenities[i].amenityID].demand;
        } else {
            amenities[i].localSupply = "N/A";
            amenities[i].localDemand = "N/A";
        }
        
        returnedAmenities.push(amenities[i]);
    }

    server.socket.to(data.id).emit('add amenities info', {amenities: returnedAmenities});            
    
}

module.exports.onPlayerViewAddAmenities = onPlayerViewAddAmenities;

function onPlayerBuyAmenity(data){
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

    if(propertyData.amenities[data.amenityID] != undefined){
        util.log('AMENITY '+data.amenityID+' ALREADY AVAILABLE AT '+propertyRoomId);
        return;        
    }
    
    util.log('PLAYER '+propertyPlayer.PC.name+' PURCHASING '+data.amenityID+' AMENITY FOR '+propertyRoomId);
    
    server.addAmenityToProperty(propertyData.propertyID, data.amenityID);
    
    server.socket.to(data.id).emit('player buy amenity success', {propertyName: propertyRoom.name, amenityName: server.getAmenityById(data.amenityID).name}); //SUCCESS MESSAGE - RELOAD UI
    
}
module.exports.onPlayerBuyAmenity = onPlayerBuyAmenity;

function onPlayerHireEmployee(data){
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
    
    var employeeToHire = server.getEmployeeById(data.employeeID);
    
    if(!employeeToHire){
        util.log('NO EMPLOYEE DATA FOUND FOR EMPLOYEE: '+data.employeeID);
        return;
    }      
    
    if(employeeToHire.status != "available"){
        util.log('EMPLOYEE '+data.employeeID+' UNAVAILABLE');
        return;        
    }
    
    if(propertyCharacter.money < (employeeToHire.upkeep*2)){
        server.socket.to(data.id).emit('message', {message: "You cannot afford to hire "+employeeToHire.name+".", styles: [{color: '#ffffff', weight: 'Bold'}]});                   
        return;
    }
    
    util.log('PLAYER '+propertyPlayer.PC.name+' HIRING '+data.employeeID+' '+employeeToHire.name+' EMPLOYEE FOR '+propertyRoomId);

    propertyCharacter.money = propertyCharacter.money - (employeeToHire.upkeep*2);
    
    employeeToHire.status = 'working';
    employeeToHire.employer = propertyRoomId;
    
    server.addEmployeeToProperty(propertyData.propertyID, data.employeeID);
    
    server.socket.to(data.id).emit('player hire employee success', {propertyName: propertyRoom.name, employeeName: server.getEmployeeById(data.employeeID).name}); //SUCCESS MESSAGE - RELOAD UI
    
}
module.exports.onPlayerHireEmployee = onPlayerHireEmployee;

