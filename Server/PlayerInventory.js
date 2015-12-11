var util = require('util')

var server = require('./server');


// Player has requested information on inventory item
function onPlayerInventorySelect (data) {
    // Find player in array
    var selectingPlayer = server.playerById(this.id);
    
    // Player not found
    if (!selectingPlayer) {
    console.log('Looking Player not found: ', this.id)
    return
    }
    
    var selectedItem = server.itemByItemID(data.itemId);

    console.log('Player: ' + selectingPlayer.PC.name+' Selecting: ' + data.itemId + ' in '+data.slotType+' in slot '+data.invIndex);

    if(selectedItem.stats != undefined){
        var health = selectedItem.stats['health'];
        var energy = selectedItem.stats['energy'];
        var magic = selectedItem.stats['magic'];

        var strength = selectedItem.stats['strength'];
        var agility = selectedItem.stats['agility'];
        var intellect = selectedItem.stats['intellect'];

        var meleepower = selectedItem.stats['meleepower'];
        var speed = selectedItem.stats['speed'];
        var spellpower = selectedItem.stats['spellpower'];  

        var hitchance = selectedItem.stats['hitchance'];
        var stealth = selectedItem.stats['stealth'];
        var critchance = selectedItem.stats['critchance'];        

        var defence = selectedItem.stats['defence'];
        var attack = selectedItem.stats['attack'];
    }
    
    server.socket.to(this.id).emit('player inventory select', {invIndex: data.invIndex, name: selectedItem.name, description: selectedItem.description, health: health, energy: energy, magic: magic, strength: strength, agility: agility, intellect: intellect, meleepower: meleepower, speed: speed, spellpower: spellpower, hitchance: hitchance, stealth: stealth, critchance: critchance, defence: defence, attack: attack, slotType: data.slotType});    

}

module.exports.onPlayerInventorySelect = onPlayerInventorySelect;

// Player is listing inventory
function onPlayerInventory (data) {
  // Find player in array
  var inventoryPlayer = server.playerById(this.id)
  console.log('Player Name: ' + inventoryPlayer.PC.name + ' checking inventory');
    
  // Player not found
  if (!inventoryPlayer) {
    console.log('Inventory Player not found: ', this.id)
    return
  }

  //server.socket.to(this.id).emit('message', {message: "Your inventory includes:\n", color: '#ffffff', weight: 'Bold'});  
    
  var inventoryListing = "";
  inventoryItemIDs = Object.keys(inventoryPlayer.PC.inventory);
  equippedSlots = Object.keys(inventoryPlayer.PC.equipment);
    
  var completeMessage = '';
  var styleArray = [];
    
  if(equippedSlots.length > 0){
    inventoryListing += "Equipped Items:\n";
  }    
    
  for(var i=0; i<equippedSlots.length; i++){
      var equippedItem = server.itemByItemID(inventoryPlayer.PC.equipment[equippedSlots[i]]);
      inventoryListing += " - "+equippedItem.name+" (worn)\n";
  }
    
  if(equippedSlots.length > 0){
    inventoryListing += "\n";
  }
  if(inventoryItemIDs.length > 0){
    inventoryListing += "Carried Items:\n";
  }    
    
  for(var i=0; i<inventoryItemIDs.length; i++){
      var inventoryItem = server.itemByItemID(inventoryItemIDs[i]);
      inventoryListing += " - "+inventoryItem.name+"\n";
  }
    
  styleArray.push( {color: '#eeeeee', weight: 'Bold', position: completeMessage.length})
  completeMessage += inventoryListing;

  //server.socket.to(this.id).emit('message', {message: inventoryListing, color: '#eeeeee', weight: 'Bold'});
    
  var moneyArray = server.currencyExchange(inventoryPlayer.PC['money']);

  styleArray.push( {color: '#fbff00', weight: 'Bold', position: completeMessage.length})
  completeMessage += moneyArray[0] + " Crown, ";    

  styleArray.push( {color: '#999999', weight: 'Bold', position: completeMessage.length})
  completeMessage += moneyArray[1] + " Shilling, ";   
    
  styleArray.push( {color: '#ff9f0f', weight: 'Bold', position: completeMessage.length})
  completeMessage += moneyArray[2] + " Pence";   
    
  //server.socket.to(this.id).emit('message', {message: moneyArray[0] + " Crown, ", color: '#fbff00', weight: 'Bold'});
  //server.socket.to(this.id).emit('message', {message: moneyArray[1] + " Shilling, ", color: '#999999', weight: 'Bold'});    
  //server.socket.to(this.id).emit('message', {message: moneyArray[2] + " Pence\n", color: '#ff9f0f', weight: 'Bold'});   
    
    server.socket.to(this.id).emit('message', {message: completeMessage, styles: styleArray});  

}

module.exports.onPlayerInventory = onPlayerInventory;

//Re-Evaluate Player Stats Based on Inventory
function playerCrunch(playerId){
    var crunchingPlayer = server.playerById(playerId);
    var level = crunchingPlayer.PC.level;
    var strength = crunchingPlayer.PC.strength;
    var agility = crunchingPlayer.PC.agility;
    var intellect = crunchingPlayer.PC.intellect;
    
    crunchingPlayer.PC.maxhealth = Math.floor(parseInt(strength)*3)+Math.ceil(0.5*level);
    crunchingPlayer.PC.maxenergy = Math.floor(parseInt(agility)+Math.ceil(0.5*level));
    crunchingPlayer.PC.maxmagic = Math.floor(parseInt(intellect)+Math.ceil(0.5*level));
    
    crunchingPlayer.PC.defence = Math.floor((parseInt(agility)/2)+Math.ceil(0.5*level));
    crunchingPlayer.PC.attack = Math.floor((parseInt(strength)/2)+Math.ceil(0.5*level));
    
    crunchingPlayer.PC.meleepower = Math.floor((parseInt(strength)/2));
    crunchingPlayer.PC.speed = Math.floor(parseInt(agility)*5);
    crunchingPlayer.PC.spellpower = Math.floor((parseInt(intellect)/2));
    
    crunchingPlayer.PC.hitchance = Math.floor((parseInt(strength)+(parseInt(agility)))+Math.ceil(0.5*level));
    crunchingPlayer.PC.stealth = Math.floor((parseInt(agility)+(parseInt(intellect)))/3);
    crunchingPlayer.PC.criticalchance = Math.floor((parseInt(intellect)+(parseInt(strength)))+Math.ceil(0.5*level));

    if(crunchingPlayer.PC.equipment == undefined){
        crunchingPlayer.PC.equipment = {};
    }
    
    for(var i=0; i<Object.keys(crunchingPlayer.PC.equipment).length; i++){
        var item = server.itemByItemID(crunchingPlayer.PC.equipment[Object.keys(crunchingPlayer.PC.equipment)[i]])
        if(item.stats != undefined){
            if(item.type == "2hweapon" && Object.keys(crunchingPlayer.PC.equipment)[i] == 'LHand'){
                
            } else {
                if(item.stats.maxhealth != undefined){ crunchingPlayer.PC.maxhealth +=  item.stats.maxhealth}
                if(item.stats.maxenergy != undefined){ crunchingPlayer.PC.maxenergy +=  item.stats.maxenergy}
                if(item.stats.maxmagic != undefined){ crunchingPlayer.PC.maxmagic +=  item.stats.maxmagic}

                if(item.stats.meleepower != undefined){ crunchingPlayer.PC.meleepower +=  item.stats.meleepower}
                if(item.stats.speed != undefined){ crunchingPlayer.PC.speed +=  item.stats.speed}
                if(item.stats.spellpower != undefined){ crunchingPlayer.PC.spellpower +=  item.stats.spellpower}

                if(item.stats.hitchance != undefined){ crunchingPlayer.PC.hitchance +=  item.stats.hitchance}
                if(item.stats.stealth != undefined){ crunchingPlayer.PC.stealth +=  item.stats.stealth}
                if(item.stats.criticalchance != undefined){ crunchingPlayer.PC.criticalchance +=  item.stats.criticalchance}

                if(item.stats.defence != undefined){ crunchingPlayer.PC.defence +=  item.stats.defence}
                if(item.stats.attack != undefined){ crunchingPlayer.PC.attack +=  item.stats.attack}
            }
            
        }
    }
    
    if(crunchingPlayer.PC.health > crunchingPlayer.PC.maxhealth){
        crunchingPlayer.PC.health = crunchingPlayer.PC.maxhealth;
    }
    if(crunchingPlayer.PC.energy > crunchingPlayer.PC.maxenergy){
        crunchingPlayer.PC.energy = crunchingPlayer.PC.maxenergy;
    }
    if(crunchingPlayer.PC.magic > crunchingPlayer.PC.maxmagic){
        crunchingPlayer.PC.magic = crunchingPlayer.PC.maxmagic;
    }    
}

module.exports.playerCrunch = playerCrunch;

// Player Is Equipping Item
function onPlayerEquip (data) {
    // Find player in array
    var equippingPlayer = server.playerById(this.id);
    
    // Player not found
    if (!equippingPlayer) {
    console.log('Equipping Player not found: ', this.id)
    return
    }
    
    if(!equippingPlayer.PC.inventory){
        server.socket.to(this.id).emit('message', {message: "You have nothing to equip.", styles: [{color: '#ffffff', weight: 'Bold'}]});            
        return;
    }
    
    playerInventoryItems = Object.keys(equippingPlayer.PC.inventory);
    for(var i = 0; i<playerInventoryItems.length; i++){
        
        var itemToEquip = server.itemByItemID(playerInventoryItems[i]);

        if(itemToEquip.name.toLowerCase().search(data.item.toLowerCase()) != -1){
            
            var slot;
            if(itemToEquip.type == "headarmor"){slot = "Head"}
            if(itemToEquip.type == "bodyarmor"){slot = "Body"}
            if(itemToEquip.type == "shield" || itemToEquip.type == "weapon" || itemToEquip.type == "2hweapon" ){slot = "RHand"}
            if(itemToEquip.type == "legarmor"){slot = "Legs"}
            if(itemToEquip.type == "feetarmor"){slot = "Feet"}


            if(slot == undefined){
                server.socket.to(this.id).emit('message', {message: "You can't equip a "+itemToEquip.name+".", styles: [{color: '#ffffff', weight: 'Bold'}]});   
                return;
            }
            
            var equipReponse;
            equipResponse = server.equipItemOnCharacter(itemToEquip.itemID, equippingPlayer.id, slot);
            if(equipResponse == "slot full"){
                server.socket.to(this.id).emit('message', {message: "You already have something equipped where the "+itemToEquip.name+" goes.", styles: [{color: '#ffffff', weight: 'Bold'}]})   
                return;
            }
            

            this.broadcast.to('room'+equippingPlayer.PC.roomid).emit('message', {message: equippingPlayer.PC.name + " equips a "+itemToEquip.name+".", styles: [{color: '#ffffff', weight: 'Bold'}]});    

            server.socket.to(this.id).emit('message', {message: "You equip the "+itemToEquip.name+".", styles: [{color: '#ffffff', weight: 'Bold'}]})            
            return;
        }
        
    }
    
    server.socket.to(this.id).emit('message', {message: "You don't have a "+data.item+" to equip.", styles: [{color: '#ffffff', weight: 'Bold'}]});            
    return;     

}

module.exports.onPlayerEquip = onPlayerEquip;

// Player Is Removing Item
function onPlayerRemove (data) {
    // Find player in array
    var removingPlayer = server.playerById(this.id);
    
    // Player not found
    if (!removingPlayer) {
    console.log('Removing Player not found: ', this.id)
    return
    }
    
    if(!removingPlayer.PC.equipment){
        server.socket.to(this.id).emit('message', {message: "You have nothing equipped to remove.", styles: [{color: '#ffffff', weight: 'Bold'}]});            
        return;
    }
    
    playerEquipment = removingPlayer.PC.equipment;
    playerSlots = Object.keys(removingPlayer.PC.equipment);
    for(var i = 0; i<playerSlots.length; i++){

        var itemToRemove = server.itemByItemID(playerEquipment[playerSlots[i]]);

        if(itemToRemove.name.toLowerCase().search(data.item.toLowerCase()) != -1){
            
            server.removeItemOnCharacter(itemToRemove.itemID, removingPlayer.id, playerSlots[i]);

            this.broadcast.to('room'+removingPlayer.PC.roomid).emit('message', {message: removingPlayer.PC.name + " removes their "+itemToRemove.name+".", styles: [{color: '#ffffff', weight: 'Bold'}]});    

            server.socket.to(this.id).emit('message', {message: "You remove your "+itemToRemove.name+".", styles: [{color: '#ffffff', weight: 'Bold'}]})            
            return;
        }
        
    }
    
    server.socket.to(this.id).emit('message', {message: "You don't have a "+data.item+" to remove.", styles: [{color: '#ffffff', weight: 'Bold'}]});            
    return;     

}

module.exports.onPlayerRemove = onPlayerRemove;