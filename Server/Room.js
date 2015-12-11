var util = require('util')

var server = require('./server');

var NPC = require('./NPC')

var itemSpawner, monsterSpawner;
var monstersSpawned;

var initializeTimeOut;

/* ************************************************
** GAME ROOM CLASS
************************************************ */
var Room = function (id, roomid, Name, Description, mapx, mapy, transitionx, transitiony, exits, roomExitFunctions, flavorObjects, inventory, money, shop, spawns, region, interactiveObjects) {
    
    
  this.id = id;
  //this.roomName = Name;
  //this.roomDescription = Description;
  //this.mapX = mapx;
  //this.mapY = mapy;
  this.roomid = roomid;
  this.name = Name;
  this.description = Description;
  this.mapX = mapx;
  this.mapY = mapy;
    
  this.transitionX = transitionx;
  this.transitionY = transitiony;    
    
  this.roomExits = exits;
  this.roomExitFunctions = roomExitFunctions;

  this.inventory = inventory;
  this.money = money;
    
  this.flavorObjects = flavorObjects;
  this.shop = shop;
    
  this.spawns = spawns;
    
  this.region = region;
  this.interactiveObjects = interactiveObjects;
    
  this.monstersSpawned = [];
    
  this.initializeTimeOut = setTimeout(initRoom, 5000, roomid)

  // Getters and setters
  var getRoomName = function () {
    return this.name;
  }
  
  var getRoomDescription = function () {
    return this.description;
  }
  
  var heartbeat = function () {
      if(this.spawns != undefined){
          if(this.spawns['items'] != undefined){
              var spawnItemsPairs = this.spawns['items'];
              var itemIDs = Object.keys(spawnItemsPairs);
              var itemsToCheck = [];
              
              for(var i=0; i<itemIDs.length; i++){
                  itemsToCheck.push( server.itemByItemID(itemIDs[i]) );
              }
              
              
              for(var i=0; i<itemsToCheck.length; i++){
                  var expectedCountOfItem = spawnItemsPairs[itemsToCheck[i].itemID].count;
                  var timerToRestock = spawnItemsPairs[itemsToCheck[i].itemID].timer;
                  //util.log('CHECKING ' + this.name + ' STOCK OF ' + itemsToCheck[i].name + ' WHICH SHOULD BE AT ' + expectedCountOfItem);
                  
                  if(this.inventory[itemsToCheck[i].itemID] == undefined){
                      itemName = itemsToCheck[i].name;
                      itemID = itemsToCheck[i].itemID;
                      roomidToStock = this.roomid;
                      roomName = this.name;
                      itemRestocking = true;
                      
                      //util.log(this.name + ' HAS NO '+itemsToCheck[i].itemID);
                      if(itemSpawner == null){
                        itemSpawner = setTimeout(function() { console.log(roomName + " RESTOCKED " + itemName);
                                             server.addItemToRoom(itemID, roomidToStock, expectedCountOfItem);
                                             itemSpawner = null;                                          
                                            }, timerToRestock);
                      }
                  }
                  else if(this.inventory[itemsToCheck[i].itemID].count < expectedCountOfItem){
                      //util.log(this.name + ' HAS LESS THAN '+ expectedCountOfItem +' '+itemsToCheck[i].name);
                      
                  }
                  
              }
          }
          if(this.spawns['monsters'] != undefined){ // RESPAWN DEAD MONSTERS
              var spawnMonsterListing = this.spawns['monsters'];
              var monsterNames = Object.keys(spawnMonsterListing);
              

              
              for(var i=0; i<monsterNames.length; i++){
                  //var activeMonster = server.npcById(this.spawnMonsterListing[monsterNames[i]]);
                  
                  //search NPCs and check all ids against spawned npc ids and if not there, spawn new one
                  var npcFound = false;
                  for(var j=0; j<npcs.length; j++){
                      if(spawnMonsterListing[monsterNames[i]].id == npcs[j].id){
                         npcFound = true; 
                         break;
                      }
                  }
                  
                  if(npcFound == false){

                          if(this.monsterSpawner == null){

                            thisRoomId = this.roomid;
                            thisMonster = monsterNames[i];

                            this.monsterSpawner = setTimeout(roomSpawn, spawnMonsterListing[monsterNames[i]].timer, thisRoomId, thisMonster);
                          }                        

                  }
                  
              }
              
          }          
      }
  } 

  // Define which variables and methods can be accessed
  return {
    getRoomName: getRoomName,      
    getRoomDescription: getRoomDescription,
    heartbeat: heartbeat,
    initRoom: initRoom,
    id: this.id,
    roomid : this.roomid,
    name: this.name,
    description: this.description,
    mapX: this.mapX,
    mapY: this.mapY,
    transitionX: this.transitionX,
    transitionY: this.transitionY,      
    roomExits: this.roomExits,
    roomExitFunctions: this.roomExitFunctions,
    flavorObjects: this.flavorObjects,
    inventory: this.inventory,
    money: this.money,
    shop: this.shop,
    spawns: this.spawns,
    monstersSpawned: this.monstersSpawned,
      region: this.region,
      interactiveObjects: this.interactiveObjects,
      monsterSpawner: this.monsterSpawner
  }
  //rooms.push(this);

}

// Export the Player class so you can use it in
// other files by using require("Player")
module.exports = Room

  var NPCSpawner = require('./NPCSpawner') // Why does this have to be here and not above?

function initRoom (roomid){
  var thisRoom = server.roomById(roomid);
  if(thisRoom.spawns != undefined){
      if(thisRoom.spawns['monsters'] != undefined){
        var spawnMonsterListing = thisRoom.spawns['monsters'];
        var monsterNames = Object.keys(spawnMonsterListing);

        for(var i=0; i<monsterNames.length; i++){
            
            spawnMonsterListing[monsterNames[i]].id = NPCSpawner.spawnNPC(monsterNames[i], thisRoom.roomid);

        }    
      }
  }

}

function roomSpawn (roomid, monstername){
    var thisRoom = server.roomById(roomid);
    
    server.socket.to('room'+thisRoom.roomid).emit('message', {message: monstername+" walks into the room.", styles: [{color: '#ffffff', weight: 'Normal'}]});

  thisRoom.spawns['monsters'][monstername].id = NPCSpawner.spawnNPC(monstername, thisRoom.roomid);
    clearTimeout(thisRoom.monsterSpawner);
  thisRoom.monsterSpawner = null;

}