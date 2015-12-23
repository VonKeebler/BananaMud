var server = require('./server');
var Combat = require('./Combat');
var NPC = require('./NPC');

var util = require('util')

var startTimer;  
var starterCountDown;
var homeCombatantData;
var awayCombatantData;

var endingTimer;

var inventory, money;

var attackTimers;

/* ************************************************
** GAME BATTLE CLASS
************************************************ */
var Battle = function (roomid, homeCombatants, awayCombatants) {

  this.id = server.generateId();
  this.roomid = roomid;  
  this.homeCombatants = homeCombatants;
  this.awayCombatants = awayCombatants;
  this.homeCombatantData = [];
  this.awayCombatantData = [];
  this.attackTimers = [];
    
  this.inventory = [];
  this.money = 0;
  
  this.startTimer = 10;
  this.starterCountDown = null;

  var winBattle = function (winningSide){
      //util.log(winningSide+' WINS');
      
      updateCombatants(this);
      
      for(var i=0; i<this.attackTimers.length; i++){
          clearTimeout(this.attackTimers[i]);
      }
      
      
      for(var i=0; i<this.homeCombatants.length; i++){ 
          var inCombatPlayer = server.playerById(this.homeCombatants[i]);
          //inCombatPlayer.PC.currentBattle = null;
          server.socket.to(inCombatPlayer.id).emit('end combat', this);
            
      } 
 
      
      endingTimer = setTimeout(this.destroyBattle, 10000, this);
      
      
  }
  
  var destroyBattle = function (battle){
      //util.log('DESTROYING BATTLE');
      
      var battleRoom = server.roomById(battle.roomid);
      
      if(battle.money != undefined){
          server.addMoneyToRoom(battle.roomid, battle.money)
          server.socket.to('room'+battle.roomid).emit('message', {message: "Some money falls to the ground.", styles: [{color: '#ffffff', weight: 'Normal'}]});
      }
      
      if(battle.inventory != undefined){
          for(var i=0; i<Object.keys(battle.inventory).length; i++){
              server.addItemToRoom(Object.keys(battle.inventory)[i], battle.roomid, battle.inventory[Object.keys(battle.inventory)[i]])
              server.socket.to('room'+battle.roomid).emit('message', {message: "A "+server.itemByItemID(Object.keys(battle.inventory)[i]).name+" falls to the ground.", styles: [{color: '#ffffff', weight: 'Normal'}]});
          }
      }
      
      for(var i=0; i<battle.homeCombatants.length; i++){ 
          var inCombatPlayer = server.playerById(battle.homeCombatants[i]);
          inCombatPlayer.PC.currentBattle = null;
          if(inCombatPlayer.PC.health < 0){
              inCombatPlayer.PC.killMe();
          }
                      
      } 
      for(var i=0; i<battle.awayCombatants.length; i++){ 
          var inCombatNPC = server.npcById(battle.awayCombatants[i]);
          inCombatNPC.currentBattle = null;
          if(inCombatNPC.health < 0){
              inCombatNPC.killMe();
          }
      }  
      
      battle.awayCombatants = [];
      battle.awayCombatantData = [];
      battle.homeCombatants = [];
      battle.homeCombatantData = [];
      
      battle.inventory = [];
      
      Battles.splice(Battles.indexOf(battle), 1);
      
      delete battle;
      
  }
    
  var heartbeat = function () {
      
    //BUCKLE UP MOTHERFUCKERS
    //BUCKLE UP TWICE, NOW WE'RE SENDING AN OBJECT
    // EMIT DATA SETUP -------------------------------------------
    for(var i=0; i<this.homeCombatants.length; i++){
        var homeCombatantPlayer = server.playerById(this.homeCombatants[i]);
        if(!homeCombatantPlayer){
            util.log('No home combatant player found : '+ homeCombatant[i]);
        }
        
        if(this.homeCombatantData[i] != undefined){
            this.homeCombatantData[i] = { name: homeCombatantPlayer.PC.name, health: homeCombatantPlayer.PC.health, maxhealth: homeCombatantPlayer.PC.maxhealth, target: this.homeCombatantData[i].target, status: this.homeCombatantData[i].status};
        } else {
            this.homeCombatantData[i] = { name: homeCombatantPlayer.PC.name, health: homeCombatantPlayer.PC.health, maxhealth: homeCombatantPlayer.PC.maxhealth, target: undefined, status: "Preparing..." };            
        }
    }

    for(var i=0; i<this.awayCombatants.length; i++){
        var awayCombatantNPC = server.npcById(this.awayCombatants[i]);

        if(!awayCombatantNPC){
            util.log('No away combatant NPC found : '+ awayCombatants[i]);
        }
        
        if(this.awayCombatantData[i] != undefined){
            this.awayCombatantData[i] = { name: awayCombatantNPC.name, health: awayCombatantNPC.health, maxhealth: awayCombatantNPC.maxhealth, target: this.awayCombatantData[i].target, status: this.awayCombatantData[i].status };
        } else {
            this.awayCombatantData[i] = { name: awayCombatantNPC.name, health: awayCombatantNPC.health, maxhealth: awayCombatantNPC.maxhealth, target: undefined, status: "Preparing..." };
        }
        
    
    }
      
    // FINISHED EMIT DATA SETUP ----------------------------------
      updateCombatants(this);
      /*for(var i=0; i<this.homeCombatants.length; i++){ // THIS IS ALL PLAYERS FOR NOW I GUESS JESUS CHRIST
          var inCombatPlayer = server.playerById(this.homeCombatants[i]);
          
          server.socket.to(inCombatPlayer.id).emit('update combat', { startTimer: this.startTimer, homeCombatants: this.homeCombatantData, awayCombatants: this.awayCombatantData, battleId: this.id});
      }*/
      
  }  

  // TIMERS -----------------------------------------------------------------------------------
  function beginBattle(battleId){
      for(var i=0; i<this.homeCombatants.length; i++){
          if(this.homeCombatantData[i].target == undefined){
                this.homeCombatantData[i].target = this.awayCombatants[0];
          }
          //util.log(this.homeCombatantData[i].name + ' TARGETING ' + this.homeCombatantData[i].target);
          this.homeCombatantData[i].status = "Striking";
          
          var combatantAttackTimer = (100/parseInt(server.playerById(this.homeCombatants[i]).PC.speed)) * 1000;
          
          this.attackTimers.push( setTimeout(performHit, combatantAttackTimer, this.homeCombatants[i], battleId) );
          
      }
      for(var i=0; i<this.awayCombatants.length; i++){
          if(this.awayCombatantData[i].target == undefined){
                this.awayCombatantData[i].target = this.homeCombatants[0];
          }
          //util.log(this.awayCombatantData[i].name + ' TARGETING ' + this.awayCombatantData[i].target);
          this.awayCombatantData[i].status = "Striking";
          
          var combatantAttackTimer = (100/parseInt(server.npcById(this.awayCombatants[i]).speed)) * 1000;

          this.attackTimers.push( setTimeout(performHit, combatantAttackTimer, this.awayCombatants[i], battleId) );
      }
      
      updateCombatants(this);
      /*for(var i=0; i<this.homeCombatants.length; i++){ // COMBINE THIS IN A COMBAT UPDATE FUNCTION ITS EVERYWHERE
          var inCombatPlayer = server.playerById(this.homeCombatants[i]);
          
          server.socket.to(inCombatPlayer.id).emit('update combat', { startTimer: this.startTimer, homeCombatants: this.homeCombatantData, awayCombatants: this.awayCombatantData, battleId: this.id});
      }*/
      
  }
    
  function performHit(combatantHitting, battleId){
      var characterHitting, targetHit, hittingName, hitName, nextHitTimer;
      var existingBattle = server.battleById(battleId);
      var attackDamage;
      
      var combatantHit;
      
      var characterHittingIndex = server.battleCombatantIndexById(combatantHitting, battleId);
      
      if(characterHittingIndex.side == "away"){
          combatantHit = existingBattle.awayCombatantData[characterHittingIndex.index].target;
      } else if(characterHittingIndex.side == "home"){
          combatantHit = existingBattle.homeCombatantData[characterHittingIndex.index].target;
      }
      
      var characterHitIndex = server.battleCombatantIndexById(combatantHit, battleId);      
      
      if(characterHitIndex.side == "away"){
          if(combatantHit == undefined || existingBattle.awayCombatantData[characterHitIndex.index].status == "Dead"){
              checkBattleTargets(existingBattle);
              existingBattle.attackTimers.push( setTimeout(performHit, 100, combatantHitting, battleId ));      
              return;
            }     
      } else if(characterHitIndex.side == "home"){
          if(combatantHit == undefined || existingBattle.homeCombatantData[characterHitIndex.index].status == "Dead"){
              checkBattleTargets(existingBattle);
              existingBattle.attackTimers.push( setTimeout(performHit, 100, combatantHitting, battleId ));      
              return;
            }               
      }
          
      
      if(server.playerById(combatantHitting)){
        characterHitting = server.playerById(combatantHitting).PC;     
      } else if(server.npcById(combatantHitting)){
        characterHitting = server.npcById(combatantHitting);         
      }
      
      if(server.playerById(combatantHit)){
          targetHit = server.playerById(combatantHit).PC;          
      } else if(server.npcById(combatantHit)){
          targetHit = server.npcById(combatantHit);          
      }
 
      
      //If the character hitting is dead, don't do anything
      if(characterHittingIndex.side == "away"){
        if(existingBattle.awayCombatantData[characterHittingIndex.index].status == "Dead"){
            return;
        }
      } else if(characterHittingIndex.side == "home"){
        if(existingBattle.homeCombatantData[characterHittingIndex.index].status == "Dead"){
            return;
        }            
      }
      
      
      hittingName = characterHitting.name;
      nextHitTimer = (100/parseInt(characterHitting.speed)) * 1000;      

      hitName = targetHit.name;      
      
      attackDamage = Combat.calculateDamage(characterHitting, targetHit, battleId);


      
        for(var i=0; i<existingBattle.homeCombatants.length; i++){
            server.socket.to(existingBattle.homeCombatants[i]).emit('display combat hit', { characterHitting: characterHittingIndex, characterHit: characterHitIndex, attackDamage: attackDamage});
        }      
      
      util.log(hittingName + ' '+attackDamage.status+' '+ hitName + ' for '+attackDamage.totalDamage)
      

      targetHit.health = parseInt(targetHit.health) - attackDamage.totalDamage;
      
      //Update Battle Data
      if(characterHitIndex.side == "away"){
        existingBattle.awayCombatantData[characterHitIndex.index].health = targetHit.health;

      } else if(characterHitIndex.side == "home"){
        existingBattle.homeCombatantData[characterHitIndex.index].health = targetHit.health;
          
      }
      
      if(parseInt(targetHit.health) < 0){
          //KILL THE CHARACTER, SET THE STATUS IN BATTLE, DON'T ALLOW INTERACTIONS, DUMP HIS CRAP INTO THE BATTLE INVENTORY, MAKE A NICE CORPSE, SEND HIS MOM SOME FLOWERS        
          
          var battleStatus = killCombatant(characterHitIndex.side, characterHitIndex.index, existingBattle);
          if(battleStatus == "END"){
              return; // COMBAT OVER
          }
          
          checkBattleTargets(existingBattle);

      }

      /*var newTarget;
      if(characterHittingIndex.side == "away"){
          newTarget = existingBattle.awayCombatantData[characterHittingIndex.index].target;
          existingBattle.awayCombatantData[characterHittingIndex.index].status = "Striking";
      } else {
          newTarget = existingBattle.homeCombatantData[characterHittingIndex.index].target;  
          existingBattle.homeCombatantData[characterHittingIndex.index].status = "Striking";
      } */     
      
      updateCombatants(existingBattle);
      
      existingBattle.attackTimers.push( setTimeout(performHit, nextHitTimer, combatantHitting, battleId ));      
  }
    
    

  // END TIMERS ----------------------------------------------------------------------------
    
  function killCombatant(side, combatantIndex, battle){
      
      if(side == "home"){
      
            battle.homeCombatantData[combatantIndex].status = "Dead";
                        
          
        } else if(side == "away"){

            battle.awayCombatantData[combatantIndex].status = "Dead";
            var dieingNPC = server.npcById(battle.awayCombatants[combatantIndex])
            if(dieingNPC.inventory != "undefined"){

                for(var i=0; i<Object.keys(dieingNPC.inventory).length; i++){
                    //MOVE EACH ITEM TO BATTLE INVENTORY
                    
                    server.addItemToBattle(Object.keys(dieingNPC.inventory)[i], battle.id, dieingNPC.inventory[Object.keys(dieingNPC.inventory)[i]]);
                    server.removeItemFromNPC(Object.keys(dieingNPC.inventory)[i], dieingNPC.id, dieingNPC.inventory[Object.keys(dieingNPC.inventory)[i]]);

                }
            }
            if(dieingNPC.money != "undefined"){
                battle.money = parseInt(battle.money) + parseInt(server.npcById(battle.awayCombatants[combatantIndex]).money);
                dieingNPC.money = 0;
                
            }

        }
      var livingCombatants = false;
      for(var i=0; i<battle.homeCombatants.length; i++){ 
          if(battle.homeCombatantData[i].status != "Dead"){
              livingCombatants = true;
          }
      } 
      
      if(livingCombatants == false){
          //Home Combatants Lose. Destroy Combat
          
          battle.winBattle("away");
          return "END";
          
      }
      
      livingCombatants = false;
      for(var i=0; i<battle.awayCombatants.length; i++){ 
          if(battle.awayCombatantData[i].status != "Dead"){
              livingCombatants = true;
          }
      } 
      
      if(livingCombatants == false){
          //Away Combatants Lose. Destroy Combat
          
          battle.winBattle("home");
          return "END";
      }
      
      return;
  }
    
    // UPDATE ANY PLAYER COMBATANTS
  function updateCombatants(battle){
      //FOR NOW, JUST UPDATE HOME COMBATANTS
      
      for(var i=0; i<battle.homeCombatants.length; i++){ 
          var inCombatPlayer = server.playerById(battle.homeCombatants[i]);

          var battleInventory = [];
          for(var j = 0; j<Object.keys(battle.inventory).length; j++){
              var battleLootItem = server.itemByItemID(Object.keys(battle.inventory)[j]);
              battleLootItem.count = battle.inventory[Object.keys(battle.inventory)[j]];
              battleInventory.push(battleLootItem);
          }
    
            if(inCombatPlayer.PC.currentBattle == null){ // If the player is new to battle, prep the player with the battle info

          
              var playerCombatSkills = [];
              var playerStealthSkills = [];
              var playerMagicSpells = [];    
                
                for(var i=0; i<inCombatPlayer.PC.combatSkills.length; i++){
                    var skillToAdd = {skillID: inCombatPlayer.PC.combatSkills[i], name: server.skillById(inCombatPlayer.PC.combatSkills[i]).name, imageIndex: server.skillById(inCombatPlayer.PC.combatSkills[i]).imageIndex}
                    playerCombatSkills.push(skillToAdd)
                }
                
                for(var i=0; i<inCombatPlayer.PC.stealthSkills.length; i++){
                    var skillToAdd = {skillID: inCombatPlayer.PC.stealthSkills[i], name: server.skillById(inCombatPlayer.PC.stealthSkills[i]).name, imageIndex: server.skillById(inCombatPlayer.PC.stealthSkills[i]).imageIndex}
                    playerStealthSkills.push(skillToAdd)
                }
                
                for(var i=0; i<inCombatPlayer.PC.magicSpells.length; i++){
                    var skillToAdd = {skillID: inCombatPlayer.PC.magicSpells[i], name: server.skillById(inCombatPlayer.PC.stealthSkills[i]).name, imageIndex: server.skillById(inCombatPlayer.PC.magicSpells[i]).imageIndex}
                    playerMagicSpells.push(skillToAdd)
                }
                util.log('SENDING PREP COMBAT TO '+inCombatPlayer.id)
            server.socket.to(inCombatPlayer.id).emit('prep combat', { startTimer: battle.startTimer, homeCombatants: battle.homeCombatantData, awayCombatants: battle.awayCombatantData, battleId: battle.id, inventory: battleInventory, money: battle.money, combatSkills: playerCombatSkills, stealthSkills: playerStealthSkills,  magicSpells: playerMagicSpells});         
            } else {
                util.log('SENDING UPDATE COMBAT TO '+inCombatPlayer.id)
            server.socket.to(inCombatPlayer.id).emit('update combat', { startTimer: battle.startTimer, homeCombatants: battle.homeCombatantData, awayCombatants: battle.awayCombatantData, battleId: battle.id, inventory: battleInventory, money: battle.money});
            }
      }      

  } 
    
    // Check for dead targets and reset
  function checkBattleTargets(battle){
      
      
      for(var i=0; i<battle.homeCombatants.length; i++){
                      
            if(server.battleCombatantIndexById(battle.homeCombatantData[i].target, battle.id).status  == "Dead") { //If this persons target is dead
                battle.homeCombatantData[i].target = undefined;
                //util.log('TARGET IS DEAD, RESETTING')
                for(var j=0; j<battle.awayCombatants.length; j++){
                    if(battle.awayCombatantData[j].status != "Dead"){
                        //util.log(battle.homeCombatants[i]+' now targeting '+battle.awayCombatants[j]);
                        battle.homeCombatantData[i].target = battle.awayCombatants[j];
                    }
                }  
                
                
            }
      }   
      for(var i=0; i<battle.awayCombatants.length; i++){
            if(server.battleCombatantIndexById(battle.awayCombatantData[i].target, battle.id).status  == "Dead") { //If this persons target is dead
                battle.awayCombatantData[i].target = undefined;
                for(var j=0; j<battle.homeCombatants.length; j++){
                    if(battle.homeCombatantData[j].status != "Dead"){
                        battle.awayCombatantData[i].target = battle.homeCombatants[j];
                    }
                }  
                
                
            }
      }  

  }
    
    
  // Define which variables and methods can be accessed
  return {
    heartbeat: heartbeat,
    beginBattle: beginBattle,
    updateCombatants: updateCombatants,
    checkBattleTargets: checkBattleTargets,
    winBattle: winBattle,
    destroyBattle: destroyBattle,
    attackTimers: this.attackTimers,
    id: this.id,
    roomid: this.roomid,
    inventory: this.inventory,
    money: this.money,
    homeCombatants: this.homeCombatants,
    awayCombatants: this.awayCombatants,
    homeCombatantData: this.homeCombatantData,
    awayCombatantData: this.awayCombatantData,
    startTimer: this.startTimer,
    starterCountDown: this.starterCountDown
    
  }
}

// Export the Player class so you can use it in
// other files by using require("Player")
module.exports = Battle


