var util = require('util')
var http = require('http')
var path = require('path')
var ecstatic = require('ecstatic')
var io = require('socket.io')

var Player = require('./Player')
var Room = require('./Room')
var Property = require('./Property')
var Amenity = require('./Amenity')
var Employee = require('./Employee')
var City = require('./City')
var Item = require('./Item')
var NPC = require('./NPC')
var PC = require('./PC')
var Battle = require('./Battle')
var Corpse = require('./Corpse')

var Spell = require('./Spell')
var Skill = require('./Skill')

var CreateCharacter = require('./CreateCharacter')
var Look = require('./Look')
var PlayerInventory = require('./PlayerInventory')
var PlayerInteract = require('./PlayerInteract')
var ItemFunctions = require('./ItemFunctions')
var DialogFunctions = require('./DialogFunctions')
var MovementFunctions = require('./MovementFunctions')
var PropertyFunctions = require('./PropertyFunctions')
var MessagingFunctions = require('./MessagingFunctions')

var NPCSpawner = require('./NPCSpawner')

var dialogService = require('./dialogService')
var itemTransfer = require('./itemTransfer')
var Combat = require('./Combat')
var Movement = require('./Movement')

var Definitions = require('./Definitions')

var Fileloader = require('./Fileloader.js');

var port = process.env.PORT || 3000

var saveDataTimeout;

/* ************************************************
** GAME VARIABLES
************************************************ */
var socket	// Socket controller
global.players	// Array of connected players
global.npcs //Array of active npcs
global.rooms; // Array of rooms
global.properties; // Array of properties
global.amenities; // Array of amenities
global.employees; // Array of property employees
global.cities; // Array of cities
global.items // Array of items
global.PCs // Array of player characters
global.Battles // Array of battles
global.corpses // Array of corpses
global.spells // Array of spells
global.combatSkills // Array of combat skills
global.stealthSkills // Array of stealth skills

/* ************************************************
** GAME INITIALISATION
************************************************ */

// Create and start the http server
var server = http.createServer(
  ecstatic({ root: path.resolve(__dirname, '../Client/') })
).listen(port, function (err) {
  if (err) {
    throw err
  }

  init()
})

function init () {
  // Create an empty array to store players
  players = [];
  rooms = [];
  properties = [];
  amenities = [];
  employees = [];    
  cities = [];
  items = [];
  npcs = [];
  Battles = [];
  corpses = [];
  spells = [];
  combatSkills = [];
  stealthSkills = [];
    
  saveDataTimeout = null;

  // Attach Socket.IO to server
  socket = io.listen(server)
  module.exports.socket = socket;

  // Configure Socket.IO
  //socket.configure(function () {
    // Only use WebSockets
    //socket.set('transports', ['websocket']);

    // Restrict log output
    //socket.set('log level', 2)

  //})

  createItems();
  createNPCs();

  // Start listening for events
  setEventHandlers()
}

/* ************************************************
** HEARTBEAT
************************************************ */

var serverHeartbeat = setInterval(
    function()
    {
        //util.log('Heartbeat');
        for(var i=0; i<npcs.length; i++){
            npcs[i].heartbeat();

        }
        for(var i=0; i<PCs.length; i++){
            PCs[i].heartbeat();

        }
        for(var i=0; i<rooms.length; i++){
            rooms[i].heartbeat();

        }

        for(var i=0; i<Battles.length; i++){
            Battles[i].heartbeat();
        }
        
        for(var i=0; i<properties.length; i++){
            properties[i].heartbeat();
        }
        
        for(var i=0; i<cities.length; i++){
            cities[i].heartbeat();
        }
        
        

        if(saveDataTimeout == null){
            saveDataTimeout = setTimeout(saveData, 60000)
        }

    }
, 10000);

/* ************************************************
** GAME EVENT HANDLERS
************************************************ */
var setEventHandlers = function () {
  // Socket.IO
  socket.sockets.on('connection', onSocketConnection)
}

function saveData(){

    util.log('SAVING PLAYER CHARACTERS...')
    Fileloader.savePCs();
    
    util.log('SAVING PROPERTIES...')
    Fileloader.saveProperties();    
    
    util.log('SAVING EMPLOYEES...')
    Fileloader.saveEmployees();        

    clearTimeout(saveDataTimeout);
    saveDataTimeout = null;

}

function createItems(){

}

function createNPCs(){

}

// New socket connection
function onSocketConnection (client) {
  util.log('New player has connected: ' + client.id)

  // Listen for Login Message
  client.on('player login', onPlayerLogin)

  // Listen for Ping
  client.on('ping', onPing)

  // Listen for client disconnected
  client.on('disconnect', onClientDisconnect)

  // Listen for new player message
  client.on('new player', onNewPlayer)

  // Player has started the mud
  client.on('player started', onPlayerStarted)

  // Player is creating a character
  client.on('create new character', CreateCharacter.onCreateCharacter)

  // Player is creating a character and choosing skills
  client.on('new character skill list', CreateCharacter.showNewCharacterSkills)

  // Listen for move player message IS THIS DEPRECATED? ONLY USED IN /ROOM MOVE
  //client.on('move player', Movement.onMovePlayer)

  // Listen for player look message
  client.on('player look', Look.onPlayerLook)

  // Listen for player look message
  client.on('player look at', Look.onPlayerLookAt)

  // Listen for player say
  client.on('player say', onPlayerSay)
  
  // Listen for player local say
  client.on('player local say', onPlayerLocalSay)  

  // Listen for player inventory
  client.on('player inventory', PlayerInventory.onPlayerInventory)

  // Listen for player inventory select
  client.on('player inventory select', PlayerInventory.onPlayerInventorySelect)

  // Listen for player go
  client.on('player go', Movement.onPlayerGo)

  // Listen for login creation
  client.on('create login', onCreateLogin)

  // Listen for who request
  client.on('player who', onWho)

  // Listen for shop
  client.on('player shop', onPlayerShop)

  // Listen for shop transaction
  client.on('player shop transaction', onPlayerShopTransaction)

  // Listen for character sheet
  client.on('player character sheet', onPlayerCharacterSheet)
  
  // Listen for player viewing messages
  client.on('player view messages', MessagingFunctions.onPlayerViewMessages)
  
  // Listen for player sending message
  client.on('player send message', MessagingFunctions.onPlayerSendMessage)  
  
  // Listen for player delete message
  client.on('player delete message', MessagingFunctions.onPlayerDeleteMessage)    

  // Listen for character chat
  client.on('player chat', dialogService.onPlayerChat)

  // Listen for character chat subject request
  client.on('player chat subjects', dialogService.onPlayerChatSubjects)

  // Listen for character chat ask request
  client.on('player chat ask', dialogService.onPlayerChatAsk)

  // Listen for character taking things
  client.on('player take', itemTransfer.onPlayerTake)

  // Listen for character dropping things
  client.on('player drop', itemTransfer.onPlayerDrop)

  // Listen for character equipping things
  client.on('player equip', PlayerInventory.onPlayerEquip)

  // Listen for character removing things
  client.on('player remove', PlayerInventory.onPlayerRemove)

  // Listen for character using things
  client.on('player use', PlayerInteract.onPlayerUse)

  // Listen for character interacting with things
  client.on('player interact', PlayerInteract.onPlayerInteract)

  // Listen for character targeting something in combat
  client.on('player combat target', Combat.onPlayerTarget)

  // Listen for character answering dialog
  client.on('player dialog answer', DialogFunctions.onPlayerDialogAnswer)
  
  // Listen for character managing property
  client.on('player manage property', PropertyFunctions.onPlayerManageProperty)  
  
  // Listen for character editing property info
  client.on('player edit property info', PropertyFunctions.onPlayerEditProperty)    
  
  // Listen for character changing property info
  client.on('player change property info', PropertyFunctions.onPlayerChangeProperty)      
  
  // Listen for character buying property
  client.on('player buy property', PropertyFunctions.onPlayerBuyProperty)    
  
  // Listen for character looking for employee
  client.on('player add employee', PropertyFunctions.onPlayerAddEmployee)      

  // Listen for character hiring employee at property
  client.on('player hire employee', PropertyFunctions.onPlayerHireEmployee)      
  
  // Listen for character looking at property amenities (trying to add)
  client.on('player view amenities', PropertyFunctions.onPlayerViewAddAmenities)      
  
  // Listen for character buying amenity at property
  client.on('player buy amenity', PropertyFunctions.onPlayerBuyAmenity)    

}

// Socket client has logged in
function onPlayerLogin (data) {
    result = Fileloader.checkLogin(data);

    socket.to(this.id).emit('player login', {id: this.id, result: result.result})

}

// Socket client has logged in
function onCreateLogin (data) {
    result = Fileloader.createLogin(data);

    util.log('Player is creating account: ' + this.id + ' LOGIN: ' + data.name + ' PASS: ' + data.pass);
    util.log('Login Attempt Result Message: ' + result.result);
    socket.to(this.id).emit('create login response', {id: this.id, result: result.result})

}


// Socket client has pinged
function onPing () {
  util.log('Player ' + this.id +' has pinged.')
  //this.broadcast.emit('pong');
  socket.sockets.emit('pong');

}

// Socket client has disconnected
function onClientDisconnect () {
  util.log('Player has disconnected: ' + this.id)

  var removePlayer = playerById(this.id)

  // Player not found
  if (!removePlayer || !removePlayer.PC) {
    console.log('Removing Player not found: ', this.id)
    return
  }

  // Room number not found
  if (!roomById(removePlayer.PC.roomid)){
    console.log('Removing Player Room not found: ', removePlayer.PC.roomid);
    return
  }

  this.broadcast.to('room'+removePlayer.PC.roomid).emit('message', {message: removePlayer.PC.name + " goes to sleep.", styles: [{color: '#ffffff', weight: 'Bold', position: 0}]});

  // Remove player from players array
  players.splice(players.indexOf(removePlayer), 1)

  // Broadcast removed player to connected socket clients
  //this.broadcast.emit('remove player', {id: this.id})
}

// New player has joined
function onNewPlayer (data) {

  var newPlayer;
    // Create a new player
  if(playerById(this.id)){
    newPlayer = playerById(this.id);
  } else {
    newPlayer = new Player(this.id)
  }

  if(pcByPlayerName(data.name) == false){
    //newPlayer.PC = pcByPlayerName('TEMPDEFAULT');
    //console.log('USING TEMPDEFAULT USER ' + newPlayer.PC.name);
    console.log('USER ' + this.id + ' NEEDS TO CREATE NEW CHARACTER');

    socket.to(this.id).emit('create new character', {id: newPlayer.id});
    return;
  } else {
    //newPlayer.PC = pcByPlayerName(data.name);
    //players.push(newPlayer)
    //newPlayer.PC = pcByPlayerName(data.name);
    socket.to(this.id).emit('start mud', {id: this.id}); //Goes to onPlayerStarted

  }
return;
}

function onPlayerStarted(data){

  var startPlayer = playerById(this.id)
  // Player not found
  if (!startPlayer) {
      // Add new player to the players array
      util.log('Recording new player');
      startPlayer = new Player(this.id);
      startPlayer.PC = pcByPlayerName(data.name);
      startPlayer.Socket = this;
      players.push(startPlayer)
  }

  startPlayer.id = this.id

  //playerInventoryArray = parseInventory(startPlayer.PC.inventory);

  //socket.to(startPlayer.id).emit('player update inventory', {id: startPlayer.id, inventory: playerInventoryArray});
  updateCharacterInventory(startPlayer.id);

  this.to(startPlayer.id).join('room'+startPlayer.PC.roomid);

  // Broadcast new player to connected socket clients

  //this.broadcast.emit('new player', {id: newPlayer.id, name: newPlayer.PC.name, room: newPlayer.PC.roomid})

  // Send existing players to the new player
  /*var i, existingPlayer
  for (i = 0; i < players.length; i++) {
    existingPlayer = players[i]
    this.emit('new player', {id: existingPlayer.id, name: existingPlayer.name, room: existingPlayer.room})
  }*/

  this.broadcast.to('room'+startPlayer.PC.roomid).emit('message', {message: startPlayer.PC.name + " wakes up.", styles: [{color: '#ffffff', weight: 'Bold'}]});

  var shopCheck;
  var newRoomShop = roomById(startPlayer.PC.roomid)['shop'];
  if(newRoomShop == undefined){
      shopCheck = false;
  } else {
      shopCheck = true;
  }
    
  var propertyCheck; 
    
  var newRoomProperty = propertyById(startPlayer.PC.roomid);
  if(newRoomProperty == undefined){
      propertyCheck = false;
  } else {
      if(newRoomProperty.owner == startPlayer.PC.id){
        propertyCheck = 'You';          
      } else {
        propertyCheck = true;
      }
  }      
    
  socket.to(startPlayer.id).emit('move player', {id: startPlayer.id, PC: startPlayer.PC, roomName: roomById(startPlayer.PC.roomid).name, mapx: roomById(startPlayer.PC.roomid).mapX, mapy: roomById(startPlayer.PC.roomid).mapY, shop: shopCheck, property: propertyCheck, speed: "instant", mapImage: roomById(startPlayer.PC.roomid).region['map']});

}

// Player is talking
function onPlayerSay (data) {
  // Find player in array
  var speakingPlayer = playerById(this.id)

  // Player not found
  if (!speakingPlayer) {
    console.log('Speaking Player not found: ', this.id)
    return
  }

  console.log('Player Speaking: ' + speakingPlayer.id + ' Name: ' + speakingPlayer.PC.name + ' at room ' + speakingPlayer.PC.roomid + ' to chatroom room'+speakingPlayer.PC.roomid + ' saying: ' + data.input);

 var completeMessage = '';
 var styleArray = [];

 styleArray.push ({color: '#ffffff',weight: 'bold', position: completeMessage.length});
 completeMessage += speakingPlayer.PC.name+"> ";

  //socket.to(speakingPlayer.id).emit('message', {message: speakingPlayer.PC.name+"> ", styles: [{color: '#ffffff',weight: 'bold'}]});
  styleArray.push ({color: '#ffffff',weight: 'normal', position: completeMessage.length});
  completeMessage += data.input;

  //socket.to(speakingPlayer.id).emit('message', {message: data.input +"\n", styles: [{color: '#ffffff',weight: 'normal'}]});
    socket.to(speakingPlayer.id).emit('message', {message: completeMessage, styles: styleArray});

    this.broadcast.to('room'+speakingPlayer.PC.roomid).emit('message', {message: completeMessage, styles: styleArray});

//  this.broadcast.to('room'+speakingPlayer.PC.roomid).emit('message', {message: speakingPlayer.PC.name+"> "+data.input, styles: [{ color: '#ffffff',weight: 'bold', position: 0},{color: '#ffffff',weight: 'normal'}]});
  //this.broadcast.to('room'+speakingPlayer.PC.roomid).emit('message', {message: data.input +"\n", styles: [{color: '#ffffff',weight: 'normal'}]});

  //this.emit('message', {message: speakingPlayer.name + "> "+ data.input +"\n"});
  // Broadcast updated position to connected socket clients
  //this.broadcast.emit('move player', {id: movePlayer.id, room: data.roomNum})
}

// Player is chatting
function onPlayerLocalSay (data) {
  // Find player in array
  var sayingPlayer = playerById(data.id)

  // Player not found
  if (!sayingPlayer) {
    console.log('Chatting Player not found: ', data.id)
    return
  }

  console.log('Player Saying to Local Players: ' + sayingPlayer.id + ' Name: ' + sayingPlayer.PC.name + ' Saying: ' + data.input);

 var completeMessage = '';
 var styleArray = [];

 var currentdate = new Date();    
    
    
 styleArray.push ({color: '#ffff00',weight: 'bold', position: completeMessage.length});
 completeMessage += "<CHAT " + currentdate.getHours() + ":" + currentdate.getMinutes() + " " + sayingPlayer.PC.name+"> ";

  styleArray.push ({color: '#ffffff',weight: 'normal', position: completeMessage.length});
  completeMessage += data.input;

    socket.to(sayingPlayer.id).emit('message', {message: completeMessage, styles: styleArray});

    this.broadcast.emit('message', {message: completeMessage, styles: styleArray});

}

// Player is Whoing
function onWho(data) {

  var whoingPlayer = playerById(this.id)

 var completeMessage = '';
 var styleArray = [];

  styleArray.push ({color: '#ffffff',weight: 'bold', position: completeMessage.length});
  completeMessage += "Enjoy this list of everyone playing:\n";

  //socket.to(this.id).emit('message', {message: "Enjoy this list of everyone playing:", styles: [{color: '#ffffff', weight: 'bold'}]});

    for(var i=0;i<players.length;i++){
        completeMessage += "NAME: " + players[i].PC.name;
        if(i<players.length-1){
            completeMessage += "\n";
        }
        //socket.to(this.id).emit('message', {message: "NAME: " + players[i].PC.name + "\n", styles: [{color: '#ffffff', weight: 'bold'}]});
    }

    socket.to(whoingPlayer.id).emit('message', {message: completeMessage, styles: styleArray});

}

// Player Is Shopping
function onPlayerShop (data) {
  var shoppingPlayer = playerById(this.id);
  var shoppingRoom = roomById(shoppingPlayer.PC.roomid);
  util.log('Player ' + shoppingPlayer.PC.name + ' is shopping at ' + shoppingPlayer.PC.roomid)

  // Player not found
  if (!shoppingPlayer) {
    util.log('Player not found: ' + this.id)
    return
  }
  // Player not found
  if (!shoppingRoom) {
    util.log('Room not found: ' + shoppingPlayer.PC.roomid)
    return
  }

  this.broadcast.to('room'+shoppingPlayer.PC.roomid).emit('message', {message: shoppingPlayer.PC.name + " engages in high-stakes bargaining with the local merchant.", styles: [{color: '#ffffff', weight: 'Bold'}]});

    var shopItems = shoppingRoom['shop'];

    var shopItemsArray = [];
    var itemID = Object.keys(shopItems);

    for(var i=0; i<itemID.length; i++){
        shopItemsArray[i] = itemByItemID(itemID[i]);
        shopItemsArray[i].count = shoppingRoom['shop'][itemID[i]].count; // HOW MUCH STOCK THE STORE HAS
        if(shoppingPlayer.PC.inventory){ // IF THE PLAYER HAS ANYTHING IN THEIR INVENTORY
            shopItemsArray[i].playerCount = shoppingPlayer.PC.inventory[itemID[i]]; // THE PLAYERS STOCK OF THE ITEM
        } else {
            shopItemsArray[i].playerCount = 0; // OTHERWISE NONE
        }
        if(shopItemsArray[i].playerCount == undefined){
            shopItemsArray[i].playerCount = 0;
        }

        shopItemsArray[i].shopValue = parseInt(shopItemsArray[i].baseValue) + parseInt(shoppingRoom['shop'][itemID[i]].basePriceDif);
    }
    socket.to(this.id).emit('shop inventory', {shop: shoppingRoom['shop'], shopItems: Object.keys(shoppingRoom['shop']) , shopItemsArray: shopItemsArray} );

}

// Player Is Buying Something
function onPlayerShopTransaction (data) {
  var shoppingPlayer = playerById(this.id);
  var shoppingRoom = roomById(shoppingPlayer.PC.roomid);

  // Player not found
  if (!shoppingPlayer) {
    util.log('Player not found: ' + this.id)
    return
  }
  // Player not found
  if (!shoppingRoom) {
    util.log('Room not found: ' + shoppingPlayer.PC.roomid)
    return
  }

  var shopItems = shoppingRoom['shop'];
  if(shopItems[data.itemID] == undefined){
    util.log('Shop Item Not Found: ' + data.itemID)
    return
  }

  if(data.count > 0){ //PLAYER IS BUYING ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    util.log('Player ' + shoppingPlayer.PC.name + ' is buying '+data.count+' '+ data.itemID +' at ' + shoppingPlayer.PC.roomid)

    if(shopItems[data.itemID].count < data.count){
        socket.to(shoppingPlayer.id).emit('message', {message: "This shop no longer has that many items.\n", styles: [{color: '#ffffff',weight: 'bold'}]});
        return
    }

    var totalTransValue = Math.abs((parseInt(itemByItemID(data.itemID).baseValue) + parseInt(shopItems[data.itemID].basePriceDif)) * data.count);

    if(parseInt(totalTransValue) > parseInt(shoppingPlayer.PC.money)){
        socket.to(shoppingPlayer.id).emit('message', {message: "You don't have enough money to purchase that many.", styles: [{color: '#ffffff',weight: 'bold'}]});
        util.log('PLAYER ' + shoppingPlayer.PC.name + ' CANNOT AFFORD '+data.count+' '+ data.itemID +' AT ' + shoppingPlayer.PC.roomid)
        return
    }

    shoppingPlayer.PC.money = parseInt(shoppingPlayer.PC.money) - totalTransValue;

    addItemToCharacter(data.itemID, this.id, data.count);
    removeItemFromShop(data.itemID, shoppingPlayer.PC.roomid, data.count);

    socket.to(shoppingPlayer.id).emit('message', {message: "You purchase "+ data.count+" "+itemByItemID(data.itemID).name+".", styles: [{color: '#ffffff',weight: 'bold'}]});
    this.broadcast.to('room'+shoppingPlayer.PC.roomid).emit('message', {message: shoppingPlayer.PC.name + " makes a purchase.", styles: [{color: '#ffffff', weight: 'Bold'}]});

  } else if (data.count < 0 ) { //PLAYER IS SELLING ++++++++++++++++++++++++++++++++++++++++++++++++++++++
    util.log('Player ' + shoppingPlayer.PC.name + ' is selling '+Math.abs(data.count)+' '+ data.itemID +' at ' + shoppingPlayer.PC.roomid)

    if(shoppingPlayer.PC.inventory[data.itemID] < Math.abs(data.count) || shoppingPlayer.PC.inventory[data.itemID] == undefined){
        socket.to(shoppingPlayer.id).emit('message', {message: "You no longer have that many items.", styles: [{color: '#ffffff',weight: 'bold'}]});
        return
    }

    var totalTransValue = Math.abs((parseInt(itemByItemID(data.itemID).baseValue) + parseInt(shopItems[data.itemID].basePriceDif)) * data.count);

    shoppingPlayer.PC.money = parseInt(shoppingPlayer.PC.money) + totalTransValue;

    removeItemFromCharacter(data.itemID, this.id, Math.abs(data.count));

    addItemToShop(data.itemID, shoppingPlayer.PC.roomid, Math.abs(data.count));

    socket.to(shoppingPlayer.id).emit('message', {message: "You sell "+ Math.abs(data.count)+" "+itemByItemID(data.itemID).name+".", styles: [{color: '#ffffff',weight: 'bold'}]});
    this.broadcast.to('room'+shoppingPlayer.PC.roomid).emit('message', {message: shoppingPlayer.PC.name + " makes a sale.", styles: [{color: '#ffffff', weight: 'Bold'}]});

  }



}

// Player is looking at character sheet
function onPlayerCharacterSheet (data) {
    var characterPlayer = playerById(this.id);

      // Player not found
      if (!characterPlayer) {
        util.log('Player not found: ' + this.id)
        return
      }

    var character = characterPlayer.PC;
    util.log('Player '+character.name+' is checking character sheet.');

    var characterName = character.name;
    var characterGender = character.gender;
    var characterRace = character.race;
    var characterDescription = character.description;

    var characterHealth = character.health;
    var characterMaxHealth = character.maxhealth;
    var characterEnergy = character.energy;
    var characterMaxEnergy = character.maxenergy;
    var charactermagic = character.magic;
    var characterMaxMagic = character.maxmagic;

    var characterStrength = character.strength;
    var characterAgility = character.agility;
    var characterIntellect = character.intellect;

    var characterMeleePower = character.meleepower;
    var characterSpeed = character.speed;
    var characterSpellPower = character.spellpower;
    var characterHitChance = character.hitchance;
    var characterStealth = character.stealth;
    var characterCriticalChance = character.criticalchance;

    var characterDefence = character.defence;
    var characterAttack = character.attack;

    characterData = {name: characterName, gender: characterGender, race: characterRace, description: characterDescription, health: characterHealth, maxhealth: characterMaxHealth, energy: characterEnergy, maxenergy: characterMaxEnergy, magic: charactermagic, maxmagic: characterMaxMagic, strength: characterStrength, agility: characterAgility, intellect: characterIntellect, meleepower: characterMeleePower, speed: characterSpeed, spellpower: characterSpellPower, hitchance: characterHitChance, stealth: characterStealth, criticalchance: characterCriticalChance, defence: characterDefence, attack: characterAttack }

    socket.to(this.id).emit('player character sheet', characterData)

}

/*// Player is trying to chat
function onPlayerChat (data) {

  var chattingPlayer = playerById(this.id);

  // Player not found
  if (!chattingPlayer) {
    util.log('Player not found: ' + this.id)
    return
  }

    util.log('Player '+chattingPlayer.PC.name+' is chatting.');


    socket.to(this.id).emit('player chat', {id: this.id})

}*/

/* ************************************************
** GAME HELPER FUNCTIONS
************************************************ */
// Find player by ID
function playerById (id) {
  var i
  for (i = 0; i < players.length; i++) {
    if (players[i].id === id) {
      return players[i]
    }
  }

  return false
}
module.exports.playerById = playerById;

// Find room by ID
function roomById (id) {
  var i;
  for (i = 0; i < rooms.length; i++) {
    if (rooms[i].roomid === id) {
      return rooms[i]
    }
  }

  return false
}
module.exports.roomById = roomById;

// Find item by ID
function itemByItemID (id) {
  var i;
  for (i = 0; i < items.length; i++) {
    if (items[i].itemID === id) {
      return items[i]
    }
  }

  return false
}
module.exports.itemByItemID = itemByItemID;

// Find players in room
function playersByRoom (id) {
  var roomPlayers = [];
  for (var i = 0; i < players.length; i++) {
    if (players[i].PC.roomid === id) {
      roomPlayers.push(players[i]);
    }
  }

  return roomPlayers;
}
module.exports.playersByRoom = playersByRoom;

// Find property by ID
function propertyById (id) {
  var i;
  for (i = 0; i < properties.length; i++) {
    if (properties[i].propertyID === id) {
      return properties[i]
    }
  }

  return undefined
}
module.exports.propertyById = propertyById;

// Find employees by city
function employeesByCity (id) {
  var i;
  var employeesInCity = [];
  for (i = 0; i < employees.length; i++) {

    if (employees[i].city === id) {
      employeesInCity.push(employees[i])
    }
  }

  return employeesInCity;
}
module.exports.employeesByCity = employeesByCity;

// Find available employees by city
function availableEmployeesByCity (id) {
  var i;
  var availableEmployeesInCity = [];
  for (i = 0; i < employees.length; i++) {

    if (employees[i].city === id && employees[i].status === 'available') {
      availableEmployeesInCity.push(employees[i])
    }
  }

  return availableEmployeesInCity;
}
module.exports.availableEmployeesByCity = availableEmployeesByCity;

// Find the total number of times an amenity can be upgraded
function getAmenityRankCount (id) {
  var i;
  for (i = 0; i < amenities.length; i++) {
    if (amenities[i].amenityID === id) {
      return Object.keys(amenities[i].upgrades).length;
    }
  }

  return undefined
}
module.exports.getAmenityRankCount = getAmenityRankCount;

// Find amenity information by Amenity ID
function getAmenityById (id) {
  var i;
  for (i = 0; i < amenities.length; i++) {
    if (amenities[i].amenityID === id) {
      return amenities[i];
    }
  }

  return undefined
}
module.exports.getAmenityById = getAmenityById;

// Add amenity to property
function addAmenityToProperty (propertyID, amenityID) {
  var property = propertyById(propertyID);
  var amenity = getAmenityById(amenityID);
  
  property.amenities[amenity.amenityID] = {rank: 1, marketing: 0};
    
}
module.exports.addAmenityToProperty = addAmenityToProperty;

// Find employee information by Employee ID
function getEmployeeById (id) {
  var i;
  for (i = 0; i < employees.length; i++) {
    if (employees[i].id === id) {
      return employees[i];
    }
  }

  return undefined
}
module.exports.getEmployeeById = getEmployeeById;

// Add employee to property
function addEmployeeToProperty (propertyID, employeeID) {
  var property = propertyById(propertyID);
  var employee = getEmployeeById(employeeID);
          
  var employeeObject = {id: employee.id, race: employee.race, gender: employee.gender, upkeep: employee.upkeep, skills: employee.skills}
  
  property.employees[employee.name] = employeeObject;
    
}
module.exports.addEmployeeToProperty = addEmployeeToProperty;

// Find city by ID
function cityById (id) {
  var i;
  for (i = 0; i < cities.length; i++) {
    if (cities[i].cityID === id) {
      return cities[i]
    }
  }

  return undefined
}
module.exports.cityById = cityById;

// Find PCs in room
function pcsByRoom (id) {
  var roomPCs = [];
  for (var i = 0; i < PCs.length; i++) {
    if (PCs[i].roomid === id) {
      roomPCs.push(PCs[i]);
    }
  }

  return roomPCs;
}
module.exports.pcsByRoom = pcsByRoom;

// Find flavor object in room
function flavorInRoom (id, flavor) {
    var room;
    flavor = flavor.toLowerCase();
    room = roomById(id);

    flavorObjects = room.flavorObjects;

    return flavorObjects[flavor];

}
module.exports.flavorInRoom = flavorInRoom;

// Find interactive objects in room
function interactiveObjectsInRoom (roomid) {
  var roomItems = [];
  var room = roomById(roomid);

  if(room.interactiveObjects != undefined){
      for (var i = 0; i < Object.keys(room.interactiveObjects).length; i++) {
        var roomItem = room.interactiveObjects[Object.keys(room.interactiveObjects)[i]];

            if(roomItem.roomDescription != undefined){
                roomItems.push( roomItem );
            }

      }
  }

  return roomItems;

}
module.exports.interactiveObjectsInRoom = interactiveObjectsInRoom;

// Find Items visible to player in room
function interactiveObjectsInRoomByAlias (id, alias) {
  var returnDescription;
  var interactiveObjectsInRoom = [];
  var roomToSearch = roomById(id);
  alias = alias.toLowerCase();
  if(roomToSearch['interactiveObjects']){
    objectsInRoom = Object.keys(roomToSearch['interactiveObjects']);
  } else {
      return returnDescription;
  }
  interactiveObjectsInRoom = [];

  for(var i=0; i< objectsInRoom.length;i++){

      interactiveObjectsInRoom.push(roomToSearch['interactiveObjects'][objectsInRoom[i]]);

  }

  for (var i = 0; i < interactiveObjectsInRoom.length; i++) {
    for(var j=0; j<interactiveObjectsInRoom[i].alias.length; j++){

        if (interactiveObjectsInRoom[i].alias[j].toLowerCase().search(alias) != -1) {
            returnDescription = interactiveObjectsInRoom[i].description;
        }
    }
  }

  return returnDescription;

}
module.exports.interactiveObjectsInRoomByAlias = interactiveObjectsInRoomByAlias;

// Find NPCs in room
function npcInRoom (id) {
  var roomNPCs = [];
  for (var i = 0; i < npcs.length; i++) {
    if (npcs[i].roomid === id) {
      roomNPCs.push(npcs[i]);
    }
  }

  return roomNPCs;

}
module.exports.npcInRoom = npcInRoom;

// Find Corpses in room
function corpseInRoom (id) {
  var roomCorpses = [];
  for (var i = 0; i < corpses.length; i++) {
    if (corpses[i].roomid === id) {
      roomCorpses.push(corpses[i]);
    }
  }

  return roomCorpses;

}
module.exports.corpseInRoom = corpseInRoom;

// Find Items in room
function itemsInRoom (id) {
  var roomItems = [];
  var room = roomById(id);

  for (var i = 0; i < Object.keys(room.inventory).length; i++) {
    var roomItem = itemByItemID(Object.keys(room.inventory)[i]);
    var itemCount = room.inventory[Object.keys(room.inventory)[i]];
    for (var j=0; j < itemCount; j++){
        roomItems.push( roomItem );
    }
  }

  return roomItems;

}
module.exports.itemsInRoom = itemsInRoom;

// Find NPCs by ID
function npcById (id) {
  for (var i = 0; i < npcs.length; i++) {
    if (npcs[i].id === id) {
      return npcs[i];
    }
  }

  return undefined;

}
module.exports.npcById = npcById;

// Find PCs by ID
function pcByID (id) {
  for (var i = 0; i < PCs.length; i++) {
    if (PCs[i].id === id) {
      return PCs[i];
    }
  }

  return;

}
module.exports.pcByID = pcByID;

// Find Items visible to player in room
function itemsInRoomByAlias (id, alias) {
  var returnDescription;
  var itemsInRoom = [];
  var roomToSearch = roomById(id);
  alias = alias.toLowerCase();
  if(roomToSearch['inventory']){
    itemIDsInRoom = Object.keys(roomToSearch['inventory']);
  } else {
      return returnDescription;
  }
  itemsInRoom = [];

  for(var i=0; i< itemIDsInRoom.length;i++){
      itemsInRoom.push(itemByItemID(itemIDsInRoom[i]));
  }

  for (var i = 0; i < itemsInRoom.length; i++) {
    if (itemsInRoom[i].name.toLowerCase() == alias) {
        returnDescription = itemsInRoom[i].description;
    }
    if (itemsInRoom[i].name.toLowerCase().search(alias) != -1) {
        returnDescription = itemsInRoom[i].description;
    }
  }

  return returnDescription;

}
module.exports.itemsInRoomByAlias = itemsInRoomByAlias;

// Find player's Item descriptions in inventory
function itemsInInventoryByAlias (playerPC, alias) {
  var returnDescription;
  alias = alias.toLowerCase();
  if(playerPC['inventory']){
    itemIDsInInventory = Object.keys(playerPC['inventory']);
  } else {
      return returnDescription;
  }
  itemsInInventory = [];

  for(var i=0; i< itemIDsInInventory.length;i++){
      itemsInInventory.push(itemByItemID(itemIDsInInventory[i]));
  }

  for (var i = 0; i < itemsInInventory.length; i++) {
    if (itemsInInventory[i].name.toLowerCase() == alias || itemsInInventory[i].name.toLowerCase().search(alias) != -1) {
        returnDescription = itemsInInventory[i].description;
    }
  }

  return returnDescription;

}
module.exports.itemsInInventoryByAlias = itemsInInventoryByAlias;

// Find NPCs in room
function npcInRoomByAlias (id, alias) {
  var returnDescription;
  alias = alias.toLowerCase();
  for (var i = 0; i < npcs.length; i++) {
    if (npcs[i].roomid === id) {
        if(npcs[i]['name'].search(alias) != -1){
            returnDescription = npcs[i].description;
        }
        if(npcs[i]['alias'] == undefined){
                   break;
        }
        if(npcs[i]['alias'][alias]){
            returnDescription = npcs[i].description;
        }
    }
  }

  return returnDescription;

}
module.exports.npcInRoomByAlias = npcInRoomByAlias;

// Find PCs in room by Name/Alias
function pcInRoomByAlias (id, alias) {

  var returnDescription;
  alias = alias.toLowerCase();
  for (var i = 0; i < PCs.length; i++) {
    if (PCs[i].roomid === id && (PCs[i].name.toLowerCase() == alias || PCs[i].name.toLowerCase().search(alias) != -1)) {
        returnDescription = PCs[i].name+"\n";
        returnDescription += PCs[i].description+"\n";
        returnDescription += PCs[i].name+" is wearing:\n";
        if(PCs[i].equipment != undefined && Object.keys(PCs[i].equipment).length != 0){
            for(var j=0; j<Object.keys(PCs[i].equipment).length; j++){
                returnDescription += itemByItemID(PCs[i].equipment[Object.keys(PCs[i].equipment)[j]]).name;
                if(j != Object.keys(PCs[i].equipment).length - 1){
                    returnDescription += "\n";
                }
            }
        } else {
            returnDescription += "NOTHING\n";
        }
        
        
        break;
    }
  }

  return returnDescription;

}
module.exports.pcInRoomByAlias = pcInRoomByAlias;


// Find PC by Player in room
function pcByPlayerName (player) {
  for (var i = 0; i < PCs.length; i++) {
    if (player === PCs[i].playerName) {
        return PCs[i];
    }
  }

  return false;

}
module.exports.pcByPlayerName = pcByPlayerName;

// Find PC by PC Name
function pcByCharacterName (name) {
  for (var i = 0; i < PCs.length; i++) {
    if (name.toLowerCase() === PCs[i].name.toLowerCase()) {
        return PCs[i];
    }
  }

  return false;

}
module.exports.pcByCharacterName = pcByCharacterName;

function currencyExchange(value){
    //12 Pence to a Shilling, 5 Shillings to a Crown
    var moneyArray = [];
    var crowns = Math.floor(value/60);
    var remainder = value - (crowns*60);
    var shillings = Math.floor(remainder/12);
    remainder = remainder - (shillings*12);
    moneyArray[0] = crowns;
    moneyArray[1] = shillings;
    moneyArray[2] = remainder;
    return moneyArray;

}
module.exports.currencyExchange = currencyExchange;

function parseInventory(inventoryObject){
  var inventoryArray = [];
  inventoryItemIDs = Object.keys(inventoryObject);

  for(var i=0; i<inventoryItemIDs.length; i++){
      var inventoryItem = itemByItemID(inventoryItemIDs[i]);
      var inventoryCount = inventoryObject[inventoryItemIDs[i]];
      inventoryItem.count = inventoryCount;
      inventoryArray.push(inventoryItem);
  }

  return inventoryArray;

}
module.exports.parseInventory = parseInventory;

function parseEquipment(inventoryObject){
  var equipmentArray = [];
  if(inventoryObject == undefined){
      inventoryObject = {};
  }
  var inventorySpots = Object.keys(inventoryObject);

  for(var i=0; i<inventorySpots.length; i++){
      var inventoryItem = itemByItemID(inventoryObject[inventorySpots[i]]);
      equipmentArray.push(inventoryItem);

  }

  return {equipmentArray: equipmentArray, equipmentSlots: inventorySpots};

}
module.exports.parseInventory = parseInventory;

function addItemToRoom(itemID, roomid, count){
    var item = itemByItemID(itemID);
    count = parseInt(count);

    if(!roomById(roomid)){
        util.log('Room '+roomid+' not found!');
        return;
    }

    for(var i=0; i<rooms.length; i++){
        if(rooms[i].roomid == roomid){
            if(rooms[i].inventory[itemID] != undefined){

                rooms[i].inventory[itemID] = parseInt(rooms[i].inventory[itemID]) + count;
            } else {

                rooms[i].inventory[itemID] = count;
            }
            return;
        }
    }

}
module.exports.addItemToRoom = addItemToRoom;

function addItemToCharacter(itemID, playerID, count){
    var item = itemByItemID(itemID);
    var inventoryPlayer = playerById(playerID);
    var characterIndex;
    count = parseInt(count);

    if(!pcByID(inventoryPlayer.PC.id)){
        util.log('No PC by ID '+inventoryPlayer.PC.id);
        return;
    }

      for (var i = 0; i < PCs.length; i++) {
        if (PCs[i].id === inventoryPlayer.PC.id) {
            characterIndex = i;
        }
      }

    if(PCs[characterIndex]['inventory'][itemID] != undefined){
        PCs[characterIndex]['inventory'][itemID] = parseInt(PCs[characterIndex]['inventory'][itemID]) + count;

    } else {
        PCs[characterIndex]['inventory'][itemID] = count;
    }


    updateCharacterInventory(playerID);

}
module.exports.addItemToCharacter = addItemToCharacter;

function addItemToBattle(itemID, battleID, count){
    var item = itemByItemID(itemID);
    var battle = battleById(battleID);
    var battleIndex;
    count = parseInt(count);

    if(!battle){
        util.log('No battle by ID '+battleID);
        return;
    }

      for (var i = 0; i < Battles.length; i++) {
        if (Battles[i].id === battleID) {
            battleIndex = i;
        }
      }

    if(Battles[battleIndex]['inventory'][itemID] != undefined){
        Battles[battleIndex]['inventory'][itemID] = parseInt(Battles[battleIndex]['inventory'][itemID]) + count;

    } else {
        Battles[battleIndex]['inventory'][itemID] = count;
    }

}
module.exports.addItemToBattle = addItemToBattle;

function removeItemFromCharacter(itemID, playerID, count){
    var item = itemByItemID(itemID);
    var inventoryPlayer = playerById(playerID);
    var characterIndex;
    count = parseInt(count);

    if(!pcByID(inventoryPlayer.PC.id)){
        util.log('No PC by ID '+inventoryPlayer.PC.id);
        return;
    }

      for (var i = 0; i < PCs.length; i++) {
        if (PCs[i].id === inventoryPlayer.PC.id) {
            characterIndex = i;
        }
      }


    if(PCs[characterIndex]['inventory'][itemID] != undefined){
        if(count <= PCs[characterIndex]['inventory'][itemID]){
            PCs[characterIndex]['inventory'][itemID] = parseInt(PCs[characterIndex]['inventory'][itemID]) - count;
        } else {
            util.log('REMOVE ITEM FROM CHARACTER FAILURE - CHARACTER HAS '+ PCs[characterIndex]['inventory'][itemID] +' '+itemID+' AND CANT REMOVE '+count);
        }
        if(PCs[characterIndex]['inventory'][itemID] == 0){
            delete PCs[characterIndex]['inventory'][itemID];
        }
    } else {
        util.log('REMOVE ITEM FROM CHARACTER FAILURE - NO ITEM '+itemID+' FOUND ON '+inventoryPlayer.PC.name);
    }

    updateCharacterInventory(playerID);

}
module.exports.removeItemFromCharacter = removeItemFromCharacter;

function removeItemFromNPC(itemID, npcID, count){
    var item = itemByItemID(itemID);
    var inventoryNPC = npcById(npcID);
    var npcIndex;
    count = parseInt(count);

    if(!inventoryNPC){
        util.log('No NPC by ID '+npcID);
        return;
    }

      for (var i = 0; i < npcs.length; i++) {
        if (npcs[i].id === npcID) {
            npcIndex = i;
        }
      }


    if(npcs[npcIndex]['inventory'][itemID] != undefined){
        if(count <= npcs[npcIndex]['inventory'][itemID]){
            npcs[npcIndex]['inventory'][itemID] = parseInt(npcs[npcIndex]['inventory'][itemID]) - count;
        } else {
            util.log('REMOVE ITEM FROM NPC FAILURE - NPC HAS '+ npcs[characterIndex]['inventory'][itemID] +' '+itemID+' AND CANT REMOVE '+count);
        }
        if(npcs[npcIndex]['inventory'][itemID] == 0){
            delete npcs[npcIndex]['inventory'][itemID];
        }
    } else {
        util.log('REMOVE ITEM FROM NPC FAILURE - NO ITEM '+itemID+' FOUND ON '+inventoryNPC.name);
    }


}
module.exports.removeItemFromNPC = removeItemFromNPC;



function removeItemFromRoom(itemID, roomid, count){
    var item = itemByItemID(itemID);
    var room = roomById(roomid);
    count = parseInt(count);

    if(!room){
        util.log('Room '+roomid+' not found!');
        return;
    }

    if(room.inventory[itemID] != undefined){
        if(count <= room.inventory[itemID]){
            room.inventory[itemID] = parseInt(room.inventory[itemID]) -  count;
        } else {
            util.log('REMOVE ITEM FROM ROOM FAILURE - ROOM HAS '+ room.inventory[itemID] +' '+itemID+' AND CANT REMOVE '+count);
        }
        if(room.inventory[itemID] == 0){
            delete room.inventory[itemID];
        }
    } else {
        util.log('REMOVE ITEM FROM ROOM FAILURE - NO ITEM '+itemID+' FOUND IN '+room.inventory[itemID]);
    }

}
module.exports.removeItemFromRoom = removeItemFromRoom;

function updateCharacterInventory(playerID){

  var inventoryPlayer = playerById(playerID);

  if(!inventoryPlayer){
      util.log('Player '+playerID+' not found!');
      return;
  }
  var playerInventoryArray = parseInventory(inventoryPlayer.PC.inventory);
  var playerEquipmentArray = parseEquipment(inventoryPlayer.PC.equipment);

  PlayerInventory.playerCrunch(playerID);

  socket.to(inventoryPlayer.id).emit('player update inventory', {id: inventoryPlayer.id, inventory: playerInventoryArray, equipment: playerEquipmentArray.equipmentArray, equipmentSlots: playerEquipmentArray.equipmentSlots, health: inventoryPlayer.PC.health, maxhealth: inventoryPlayer.PC.maxhealth, energy: inventoryPlayer.PC.energy, maxenergy: inventoryPlayer.PC.maxenergy, magic: inventoryPlayer.PC.magic, maxmagic: inventoryPlayer.PC.maxmagic, money: inventoryPlayer.PC.money});

}
module.exports.updateCharacterInventory = updateCharacterInventory;

function colorByAllegiance(allegiance){

    if(allegiance > 60){
        return '#00f200'
    }
    if(allegiance > 20){
        return '#00ffff'
    }
    if(allegiance > -20){
        return '#dae600'
    }
    if(allegiance > -60){
        return '#ff7f00'
    }
    return '#e61700'

}
module.exports.colorByAllegiance = colorByAllegiance;

function battleByRoomId(roomid){

    for(var i=0; i<Battles.length; i++){
        if(Battles[i].roomid == roomid){
            return Battles[i];
        }
    }

    return;
}
module.exports.battleByRoomId = battleByRoomId;

function battleById(battleid){

    for(var i=0; i<Battles.length; i++){
        if(Battles[i].id == battleid){
            return Battles[i];
        }
    }

    return false;
}
module.exports.battleById = battleById;

function roomExitsByArea(roomid, area){
    var potentialExits = [];
    var searchRoom = roomById(roomid);

    if(!searchRoom){
        util.log('No search room found \(npc probably in empty room): '+roomid);
        return;
    }

    var searchRoomExits = Object.keys(searchRoom.roomExits);
    for(var i=0; i<searchRoomExits.length; i++){
        var roomExit = searchRoom.roomExits[searchRoomExits[i]];
        var nextRoom = roomById(roomExit);
        if(nextRoom.region != undefined){
          var nextRoomAreas = nextRoom.region['area'];
          for(var j=0; j<nextRoomAreas.length; j++){
              if(nextRoomAreas[j] == area){
                  potentialExits.push(searchRoomExits[i]);
              }
          }
        }


    }

    return potentialExits;
}
module.exports.roomExitsByArea = roomExitsByArea;

function roomExitsByRoomId(exitroomid, currentroomid){
    var exitRoom = roomById(exitroomid);
    var currentRoom = roomById(currentroomid);

    var currentRoomExits = Object.keys(currentRoom.roomExits);

    for(var i=0; i<currentRoomExits.length; i++){
        var roomExitId = currentRoom.roomExits[currentRoomExits[i]];
        if(exitroomid == roomExitId){
            return currentRoomExits[i];
        }



    }

    return;
}
module.exports.roomExitsByRoomId = roomExitsByRoomId;

//SHOPPING
function removeItemFromShop(itemID, roomid, count){
    var item = itemByItemID(itemID);
    var room = roomById(roomid);
    count = parseInt(count);

    if(!room){
        util.log('Room '+roomid+' not found!');
        return;
    }

    if(room.shop == undefined){
        util.log('Room '+roomid+' does not have a shop!');
        return;
    }

    if(room.shop[itemID] != undefined){
        if(count <= room.shop[itemID].count){
            room.shop[itemID].count = parseInt(room.shop[itemID].count) - count;
        } else {
            util.log('REMOVE ITEM FROM SHOP FAILURE - ROOM HAS '+ room.shop[itemID].count +' '+itemID+' AND CANT REMOVE '+count);
        }
        if(room.shop[itemID].count == 0){
            delete room.shop[itemID];
        }
    } else {
        util.log('REMOVE ITEM FROM ROOM FAILURE - NO ITEM '+itemID+' FOUND IN SHOP '+roomid);
    }

}
module.exports.removeItemFromShop = removeItemFromShop;

function addItemToShop(itemID, roomid, count){
    var item = itemByItemID(itemID);
    var room = roomById(roomid);
    count = parseInt(count);

    if(!room){
        util.log('Room '+roomid+' not found!');
        return;
    }

    if(room.shop == undefined){
        util.log('Room '+roomid+' does not have a shop!');
        return;
    }

    if(room.shop[itemID] != undefined){
        room.shop[itemID].count = parseInt(room.shop[itemID].count) + count;

    } else {
        room.shop[itemID].count = count;
    }

}
module.exports.addItemToShop = addItemToShop;

function battleCombatantIndexById(combatantId, battleId){
    var currentBattle = battleById(battleId);
    for(var i = 0; i<currentBattle.awayCombatants.length; i++){

        if(currentBattle.awayCombatants[i] == combatantId){

            return {index: i, side: "away", status: currentBattle.awayCombatantData[i].status};
        }
    }
    for(var i = 0; i<currentBattle.homeCombatants.length; i++){

        if(currentBattle.homeCombatants[i] == combatantId){

            return {index: i, side: "home", status: currentBattle.homeCombatantData[i].status};
        }
    }

    return false;
}
module.exports.battleCombatantIndexById = battleCombatantIndexById;

function skillById(skillID){

    for(var i = 0; i<combatSkills.length; i++){

        if(combatSkills[i].skillID == skillID){

            return combatSkills[i];
        }
    }

    for(var i = 0; i<stealthSkills.length; i++){

        if(stealthSkills[i].skillID == skillID){

            return stealthSkills[i];
        }
    }
    
    for(var i = 0; i<spells.length; i++){

        if(spells[i].skillID == skillID){

            return spells[i];
        }
    }    

    return false;
}
module.exports.skillById = skillById;

function equipItemOnCharacter(itemID, playerID, slot){
    var item = itemByItemID(itemID);
    var inventoryPlayer = playerById(playerID);
    var characterIndex;

    if(!pcByID(inventoryPlayer.PC.id)){
        util.log('No PC by ID '+inventoryPlayer.PC.id);
        return;
    }

      for (var i = 0; i < PCs.length; i++) {
        if (PCs[i].id === inventoryPlayer.PC.id) {
            characterIndex = i;
        }
      }
    
    if(item.type == "2hweapon"){
        if(PCs[characterIndex]['equipment']["RHand"] != undefined || PCs[characterIndex]['equipment']["LHand"] != undefined){
            return "slot full";
        }
    }

    if(PCs[characterIndex]['equipment'][slot] != undefined){
        if(slot == "RHand"){

            slot = "LHand";
        }
        if(PCs[characterIndex]['equipment'][slot] != undefined){
            return "slot full"
        }
    }

    if(PCs[characterIndex]['inventory'][itemID] != undefined){
        PCs[characterIndex]['inventory'][itemID] = parseInt(PCs[characterIndex]['inventory'][itemID]) - 1;
    } else {
        util.log('EQUIP ITEM FROM CHARACTER FAILURE - NO ITEM '+itemID+' FOUND ON '+inventoryPlayer.PC.name);
        return "no item found"
    }

    if(PCs[characterIndex]['inventory'][itemID] == 0){
        delete PCs[characterIndex]['inventory'][itemID];
    }

    if(item.type != "2hweapon"){
        PCs[characterIndex]['equipment'][slot] = itemID;
    } else {
        PCs[characterIndex]['equipment']['RHand'] = itemID;
        PCs[characterIndex]['equipment']['LHand'] = itemID;
    }

    updateCharacterInventory(playerID);
    return;

}
module.exports.equipItemOnCharacter = equipItemOnCharacter;

function removeItemOnCharacter(itemID, playerID, slot){
    var item = itemByItemID(itemID);
    var inventoryPlayer = playerById(playerID);
    var characterIndex;

    if(!pcByID(inventoryPlayer.PC.id)){
        util.log('No PC by ID '+inventoryPlayer.PC.id);
        return;
    }

      for (var i = 0; i < PCs.length; i++) {
        if (PCs[i].id === inventoryPlayer.PC.id) {
            characterIndex = i;
        }
      }

    if(item.type != "2hweapon"){
        delete PCs[characterIndex]['equipment'][slot];
    } else if(item.type == "2hweapon"){
        if(PCs[characterIndex]['equipment']['RHand'] != item.itemID || PCs[characterIndex]['equipment']['LHand'] != item.itemID){
            util.log('2 HANDED WEAPON ' + item.name + ' NOT IN BOTH SLOTS ON PLAYER '+inventoryPlayer.PC.name);
            return;            
        }
        delete PCs[characterIndex]['equipment']['RHand'];
        delete PCs[characterIndex]['equipment']['LHand'];
    }

    if(PCs[characterIndex]['inventory'][itemID] != undefined){
        PCs[characterIndex]['inventory'][itemID] = parseInt(PCs[characterIndex]['inventory'][itemID]) + 1;
    } else {
        PCs[characterIndex]['inventory'][itemID] = 1;
    }


    updateCharacterInventory(playerID);
    return;

}
module.exports.removeItemOnCharacter = removeItemOnCharacter;


// Try to use things in player's Item
function useItemInInventory (playerPC, alias) {
  alias = alias.toLowerCase();
  if(playerPC['inventory']){
    itemIDsInInventory = Object.keys(playerPC['inventory']);
  } else {
      return;
  }
  itemsInInventory = [];

  for(var i=0; i< itemIDsInInventory.length;i++){
      itemsInInventory.push(itemByItemID(itemIDsInInventory[i]));
  }

  for (var i = 0; i < itemsInInventory.length; i++) {
    if (itemsInInventory[i].name.toLowerCase() == alias || itemsInInventory[i].name.toLowerCase().search(alias) != -1) {
        if(itemsInInventory[i].use != undefined){
            return itemsInInventory[i].itemID;
            //eval(itemsInInventory[i].use);
            //return true;
        }

    }
  }

  return;

}
module.exports.useItemInInventory = useItemInInventory;

// Try to use things in a room
function useItemInRoom (id, alias) {

  var itemsInRoom = [];
  var roomToSearch = roomById(id);
  alias = alias.toLowerCase();

  if(roomToSearch['inventory']){
    itemIDsInRoom = Object.keys(roomToSearch['inventory']);
  } else {
      return;
  }
  itemsInRoom = [];

  for(var i=0; i< itemIDsInRoom.length;i++){
      itemsInRoom.push(itemByItemID(itemIDsInRoom[i]));
  }

  for (var i = 0; i < itemsInRoom.length; i++) {
      if (itemsInRoom[i].name.toLowerCase() == alias || itemsInRoom[i].name.toLowerCase().search(alias) != -1) {
        if(itemsInRoom[i].use != undefined){
            //eval(itemsInRoom[i].use);
            return itemsInRoom[i].itemID;
            return true;
        }
      }
  }

  return;

}
module.exports.useItemInRoom = useItemInRoom;

// Try to use things in a room
function interactItemInRoom (id, roomid, interaction, alias) {

  var interactiveObjects;
  var itemsInRoom = [];
  var roomToSearch = roomById(roomid);
  alias = alias.toLowerCase();

  if(roomToSearch['interactiveObjects']){
    interactiveObjects = Object.keys(roomToSearch['interactiveObjects']);
    util.log(interactiveObjects)
  } else {
      return;
  }
  itemsInRoom = [];

  for(var i=0; i< interactiveObjects.length;i++){
      itemsInRoom.push(roomToSearch.interactiveObjects[interactiveObjects[i]]);
  }

  for (var i = 0; i < itemsInRoom.length; i++) {
      for (var j=0; j < itemsInRoom[i].alias.length; j++) {
          if (itemsInRoom[i].action == interaction && itemsInRoom[i].alias[j].toLowerCase().search(alias) != -1) {
              ItemFunctions.interactItem(id, itemsInRoom[i].function);
              return true;
          }
      }

  }

  return;

}
module.exports.interactItemInRoom = interactItemInRoom;

function addMoneyToCharacter(playerID, money){

    var moneyPlayer = playerById(playerID);
    var characterIndex;
    money = parseInt(money);

    if(!pcByID(moneyPlayer.PC.id)){
        util.log('No PC by ID '+moneyPlayer.PC.id);
        return;
    }

      for (var i = 0; i < PCs.length; i++) {
        if (PCs[i].id === moneyPlayer.PC.id) {
            characterIndex = i;
        }
      }

    if(PCs[characterIndex]['money'] != undefined){
        PCs[characterIndex]['money'] = parseInt(PCs[characterIndex]['money']) + money;

    } else {
        PCs[characterIndex]['money'] = money;
    }


    updateCharacterInventory(playerID);

}
module.exports.addMoneyToCharacter = addMoneyToCharacter;

function addMoneyToNPC(npcID, money){

    var moneyNPC = npcById(npcID);
    var npcIndex;
    money = parseInt(money);

      for (var i = 0; i < npcs.length; i++) {
        if (npcs[i].id === npcID) {
            npcIndex = i;
        }
      }

    if(npcs[npcIndex]['money'] != undefined){
        npcs[npcIndex]['money'] = parseInt(npcs[npcIndex]['money']) + money;

    } else {
        npcs[npcIndex]['money'] = money;
    }


}
module.exports.addMoneyToNPC = addMoneyToNPC;

function removeMoneyFromCharacter(playerID, money){

    var moneyPlayer = playerById(playerID);
    var characterIndex;
    money = parseInt(money);

    if(!pcByID(moneyPlayer.PC.id)){
        util.log('No PC by ID '+moneyPlayer.PC.id);
        return;
    }

      for (var i = 0; i < PCs.length; i++) {
        if (PCs[i].id === moneyPlayer.PC.id) {
            characterIndex = i;
        }
      }


    if(PCs[characterIndex]['money'] != undefined){
        if(money <= PCs[characterIndex]['money']){
            PCs[characterIndex]['money'] = parseInt(PCs[characterIndex]['money']) - money;
        } else {
            util.log('REMOVE MONEY FROM CHARACTER FAILURE - CHARACTER HAS '+ PCs[characterIndex]['money'] +' AND CANT REMOVE '+money);
        }

    } else {
        util.log('REMOVE MONEY FROM CHARACTER FAILURE - NO MONEY DEFINED FOR '+moneyPlayer.PC.name);
    }

    updateCharacterInventory(playerID);

}
module.exports.removeMoneyFromCharacter = removeMoneyFromCharacter;

function removeMoneyFromNPC(npcID, money){

    var moneyNPC = npcById(npcID);
    var npcIndex;
    money = parseInt(money);

      for (var i = 0; i < npcs.length; i++) {
        if (npcs[i].id === npcID) {
            npcIndex = i;
        }
      }


    if(npcs[npcIndex]['money'] != undefined){
        if(money <= npcs[npcIndex]['money']){
            npcs[npcIndex]['money'] = parseInt(npcs[npcIndex]['money']) - money;
        } else {
            util.log('REMOVE MONEY FROM NPC FAILURE - NPC HAS '+ npcs[npcIndex]['money'] +' AND CANT REMOVE '+money);
        }

    } else {
        util.log('REMOVE MONEY FROM CHARACTER FAILURE - NO MONEY DEFINED FOR '+moneyNPC.name);
    }


}
module.exports.removeMoneyFromNPC = removeMoneyFromNPC;

function addMoneyToRoom(roomid, money){

    money = parseInt(money);

    if(!roomById(roomid)){
        util.log('Room '+roomid+' not found!');
        return;
    }

    for(var i=0; i<rooms.length; i++){
        if(rooms[i].roomid == roomid){
            if(rooms[i].money != undefined){

                rooms[i].money = parseInt(rooms[i].money) + money;
            } else {

                rooms[i].money = money;
            }
            return;
        }
    }

}
module.exports.addMoneyToRoom = addMoneyToRoom;

function removeMoneyFromRoom(roomid, money){

    money = parseInt(money);

    if(!roomById(roomid)){
        util.log('Room '+roomid+' not found!');
        return;
    }

    for(var i=0; i<rooms.length; i++){
        if(rooms[i].roomid == roomid){
            if(rooms[i].money != undefined){

                if(money <= rooms[i].money){

                    rooms[i].money = parseInt(rooms[i].money) - money;
                } else {
                    util.log('REMOVE MONEY FROM ROOM FAILURE - ROOM HAS '+ rooms[i].money +' AND CANT REMOVE '+money);
                }
            } else {

                util.log('REMOVE MONEY FROM ROOM FAILURE - NO MONEY DEFINED FOR '+rooms[i].roomid);
            }
            return;
        }
    }

}
module.exports.removeMoneyFromRoom = removeMoneyFromRoom;

function getFormattedDate(){
    var date = new Date();
    
    var month = date.getMonth()+1;
    if(month < 10){
        month = "0" + day;
    }
    
    var day = date.getDate();
    if(day < 10){
        day = "0" + day;
    }
    
    var year = date.getFullYear();
    
    var hours = date.getHours();
    if(hours < 10){
        hours = "0" + hours;
    }
    
    var minutes = date.getMinutes();
    if(minutes < 10){
        minutes = "0" + minutes;
    }
    
    var seconds = date.getSeconds();
    if(seconds < 10){
        seconds = "0" + seconds;
    }    
    
    var AMPM;
    if(hours < 12){
        AMPM = "AM";
    } else {
        AMPM = "PM";
    }
    
    var returnDate = month + "/" + day + "/" + year + " " + hours +":"+ minutes +":"+ seconds +" "+AMPM;
    
    return returnDate;
    
    
    
}
module.exports.getFormattedDate = getFormattedDate;

function getAvailableEmployeeCount(cityID){
    var count = 0;
    for(var i=0; i<employees.length; i++){

        if(employees[i].city == cityID && employees[i].status == "available"){
            count++;
        }
    }
    return count;
}
module.exports.getAvailableEmployeeCount = getAvailableEmployeeCount;
/* ******************************************************************************************************
** RANDOM FUNCTIONS
********************************************************************************************************* */

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
module.exports.getRandomInt = getRandomInt;

function generateId() {
    var d = new Date().getTime();
    var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return id;
}
module.exports.generateId = generateId;

function randomRace() {
  //Human, Wood Elf, House Elf, Halfling, Orc, Gnome, Dwarf, Gillman, Golem, Lizard Man
  var races = ['Human', 'Wood Elf', 'House Elf', 'Halfling', 'Orc', 'Gnome', 'Dwarf', 'Gillman', 'Golem', 'Lizard Man']
  var random = getRandomInt(0, 9);
    
  return races[random];
}
module.exports.randomRace = randomRace;

function randomGender() {
  //Male, Female
  var genders = ['Male', 'Female']
  var random = getRandomInt(0, 1);
    
  return genders[random];
}
module.exports.randomGender = randomGender;

function randomName(race, gender) {
  var firstName = Definitions.DEFNames[race][gender].First[getRandomInt(0,Definitions.DEFNames[race][gender].First.length-1)];
  var lastName = "";
  if(race != "Gillman" && race != "Golem" && race != "Lizard Man"){
      var lastName = " " + Definitions.DEFNames[race][gender].Last[getRandomInt(0,Definitions.DEFNames[race][gender].Last.length-1)];
  } else {
  }
  var name = firstName + lastName;
    
  return name;
}
module.exports.randomName = randomName;