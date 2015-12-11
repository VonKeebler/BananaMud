var util = require('util')

var server = require('./server');
var Battle = require('./Battle')

// Players Entering Combat
function onPlayerCombat (data) {
    
    
}

module.exports.onPlayerCombat = onPlayerCombat;

// Should Combat Occur? Check at room entry
function checkCombat (playerID, roomid) {
    var combatPlayer = server.playerById(playerID);
    
    if(!combatPlayer){
        util.log('Combat Player not found '+playerID);
        return;
    }
    
    var combatRoom = server.roomById(roomid);

    if(!combatRoom){
        util.log('Combat Room not found '+roomid);
        return;
    } 
    
    var roomNPCs = server.npcInRoom(roomid);
    
    for(var i=0; i<roomNPCs.length;i++){ //Loop through all NPCs in room
        if(combatPlayer.PC.allegiances[roomNPCs[i].allegiance] < -60){ // If the NPC's allegiance is lower than -60
            //util.log('COMBAT SHOULD HAPPEN BETWEEN '+roomNPCs[i].name+' AND '+combatPlayer.PC.name);
            if(combatPlayer.PC.currentBattle != null){ // if the player IS currently in battle
                if(roomNPCs[i].currentBattle == null){ // if the NPC is not currently in battle
                    util.log('ADDING NPC '+roomNPCs[i].id+' TO BATTLE ' +combatPlayer.PC.currentBattle)
                    addToCombat(roomNPCs[i].id, combatPlayer.PC.currentBattle, "away"); //Add the NPC to the players ongoing battle
                } else if(roomNPCs[i].currentBattle != null){ // if the npc IS currently in battle
                    //Do nothing, they're both already fighting.
                }
            } else if (combatPlayer.PC.currentBattle == null){ // if the player is NOT currently in battle
                if(roomNPCs[i].currentBattle != null){ // but the NPC is in a currently battle;
                    util.log('ADDING PC '+combatPlayer.id+' TO BATTLE ' +roomNPCs[i].currentBattle)
                    addToCombat(combatPlayer.id, roomNPCs[i].currentBattle, "home"); // add the player to the NPC's ongoing battle
                } else if(roomNPCs[i].currentBattle == null){ //if neither the NPC nor the Player is in battle
                    var homeCombatants = [];
                    //homeCombatants[0] = combatPlayer.id; // The first home combatant is the player NOPE, ADD TO COMBAT WILL TAKE CARE OF IT
                    var awayCombatants = [];
                    //awayCombatants[0] = roomNPCs[i].id; // The first away combatant is the NPC NO, SAME AS ABOVE
                    var newBattle = new Battle(roomNPCs[i].roomid, homeCombatants, awayCombatants); // Create a new battle between the two
                    Battles.push(newBattle); // Put it in the battle list
                    battleStartTimer(newBattle.id);

                    util.log('ADDING BOTH PC '+combatPlayer.id+' AND ' +roomNPCs[i].id + ' TO BATTLE '+newBattle.id)
                    addToCombat(combatPlayer.id, newBattle.id, "home"); // Add the Player to the new battle on the home side
                    addToCombat(roomNPCs[i].id, newBattle.id, "away"); // Add the NPC to the new battle on the away side                    

                }
            }
            
            
        }
    }
    
}

module.exports.checkCombat = checkCombat;

// Add combatant to battle on a side (home or away)
function addToCombat (combatCharacterID, battle, side) {
    var combatCharacter = server.npcById(combatCharacterID); // Find NPC if possible
    var combatPlayer;
    
    var existingBattle =  server.battleById( battle);
    
    if(!combatCharacter){ // If not an NPC, probably a PC
        combatPlayer = server.playerById(combatCharacterID); // Player
        combatCharacter = server.pcByID(combatPlayer.PC.id); // PC
    }
    
    if(!combatCharacter){
        util.log('No combat character found: ' + combatCharacter + ' ' +combatCharacterID);
        return;
    }

    server.socket.to('room'+combatCharacter.roomid).emit('message', {message: combatCharacter.name+" runs into the fight!", styles: [{color: '#ffffff', weight: 'Normal'}]});

    if(side == "away"){
        existingBattle.awayCombatants.push(combatCharacterID); // Add this character to the battles away combatants
    } else if(side == "home"){
        existingBattle.homeCombatants.push(combatCharacterID); // Add this character to the battles home combatants
    }

    // SET UP EMIT DATA ------------------------------------------------------
    
    var homeCombatants = existingBattle.homeCombatants;
    var awayCombatants = existingBattle.awayCombatants;

    for(var i=0; i<homeCombatants.length; i++){
        var homeCombatantPlayer = server.playerById(homeCombatants[i]);
        if(!homeCombatantPlayer){
            util.log('No home combatant player found : '+ homeCombatant[i]);
        }

        if(existingBattle.homeCombatantData[i] != undefined){
            existingBattle.homeCombatantData[i] = { name: homeCombatantPlayer.PC.name, health: homeCombatantPlayer.PC.health, maxhealth: homeCombatantPlayer.PC.maxhealth, target: existingBattle.homeCombatantData[i].target, status: existingBattle.homeCombatantData[i].status };
        } else {
            util.log('ADDING HOME COMBATANT '+homeCombatantPlayer.PC.name);
            existingBattle.homeCombatantData[i] = { name: homeCombatantPlayer.PC.name, health: homeCombatantPlayer.PC.health, maxhealth: homeCombatantPlayer.PC.maxhealth, target: undefined, status: "Preparing..." };            
        }
        
    }

    for(var i=0; i<awayCombatants.length; i++){
        var awayCombatantNPC = server.npcById(awayCombatants[i]);
        if(!awayCombatantNPC){
            util.log('No away combatant NPC found : '+ awayCombatants[i]);
        }
        
        if(existingBattle.awayCombatantData[i] != undefined){
            existingBattle.awayCombatantData[i] = { name: awayCombatantNPC.name, health: awayCombatantNPC.health, maxhealth: awayCombatantNPC.maxhealth, target: existingBattle.awayCombatantData[i].target, status: existingBattle.awayCombatantData[i].status };
        } else {
            util.log('ADDING AWAY COMBATANT '+awayCombatantNPC.name);
            existingBattle.awayCombatantData[i] = { name: awayCombatantNPC.name, health: awayCombatantNPC.health, maxhealth: awayCombatantNPC.maxhealth, target: undefined, status: "Preparing..."  };
        }
        
    }
    
    // FINISHED SETTING UP EMIT DATA ----------------------------------------
    
    existingBattle.updateCombatants(existingBattle);

    /*for(var i=0; i<homeCombatants.length; i++){ // Home combatants are probably players and need to receive the new combatant OR HAVE BATTLE PREPARED!

        if(server.playerById(homeCombatants[i]).PC.currentBattle == null){ // If the player is new to battle, prep the player with the battle info

            server.socket.to(homeCombatants[i]).emit('prep combat', { startTimer: existingBattle.startTimer, homeCombatants: existingBattle.homeCombatantData, awayCombatants: existingBattle.awayCombatantData, battleId: existingBattle.id});         
        } else { // otherwise the homeCombatant player is already in battle, send the update via update combat
            
            server.socket.to(homeCombatants[i]).emit('update combat', { startTimer: existingBattle.startTimer, homeCombatants: existingBattle.homeCombatantData, awayCombatants: existingBattle.awayCombatantData, battleId: existingBattle.id});         
        }


    }*/
    util.log('SETTING '+combatCharacter.name+' CURRENT BATTLE TO '+existingBattle.id)
    combatCharacter.currentBattle = existingBattle.id; // Set the characters current battle to this battle
    
    
    
}

module.exports.addToCombat = addToCombat;

function battleStartTimer(battleId){
  var existingBattle = server.battleById(battleId);
    
  existingBattle.starterCountDown = setInterval( updateStarterCountDown , 1000, battleId);
  
  
}
module.exports.battleStartTimer = battleStartTimer;


function updateStarterCountDown (battleId){
      var existingBattle = server.battleById(battleId);
    
      existingBattle.startTimer = parseInt(existingBattle.startTimer) - 1;
      
      if(existingBattle.homeCombatants != undefined){
          for(var i=0; i<existingBattle.homeCombatants.length; i++){ 

              var inCombatPlayer = server.playerById(existingBattle.homeCombatants[i]);

              server.socket.to(inCombatPlayer.id).emit('update combat starttimer', { startTimer: existingBattle.startTimer});

          }
      }
     if(existingBattle.startTimer <= 0){
         existingBattle.beginBattle(existingBattle.id);         
         clearInterval(existingBattle.starterCountDown);
      }
}
module.exports.updateStarterCountDown = updateStarterCountDown;


// Players Targeting in Combat
function onPlayerTarget (data) {

    var combatPlayer = server.playerById(this.id);

    if(!combatPlayer){
        util.log('Combat Player not found '+this.id);
        return;
    }
    
    var currentBattle = server.battleById(combatPlayer.PC.currentBattle);
    
    if(!currentBattle){
        util.log('Battle not found '+combatPlayer.PC.currentBattle);
        return;
    }
    
    var target;
    
    if(data.targetSide == "home"){
        target = currentBattle.homeCombatants[data.targetIndex];
    }
    
    if(data.targetSide == "away"){
        target = currentBattle.awayCombatants[data.targetIndex];   

    }
    
    if(target == undefined){
        util.log('Combat Player Target Not Found!'); 
        return;
    }
    
    var combatPlayerIndex = server.battleCombatantIndexById(this.id, currentBattle.id).index;
    
    currentBattle.homeCombatantData[combatPlayerIndex].target = target;
    
    util.log('Combat Player '+combatPlayer.PC.name+' targeting '+data.targetSide+' combatant '+currentBattle.homeCombatantData[combatPlayerIndex].target);
    
}

module.exports.onPlayerTarget = onPlayerTarget;

function calculateDamage (characterHitting, characterHit, battleId){
    var status = 'normal hit';
    var critChance = parseInt(characterHitting.criticalchance);
    var hitChance = 75+parseInt(characterHitting.hitchance);
    var randomInt = server.getRandomInt(0, 100);
    
    var damage = Math.floor(parseInt(characterHitting.meleepower/2)+server.getRandomInt(1, parseInt(characterHitting.attack/2)));
    
    if(randomInt<critChance){
        damage = damage*2;
        status = 'critical hit';
    } else if(randomInt>hitChance){
        damage = 0;
        status = 'missed';
    }
    
    var damageReduction = parseInt(characterHit.defence) + Math.floor((characterHit.speed/10));
    var totalDamage = damage - damageReduction;
    if(totalDamage < 0)    {
      totalDamage = 0;
    }
    return {totalDamage: totalDamage, status: status};
}
module.exports.calculateDamage = calculateDamage;