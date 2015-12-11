var util = require('util')
var server = require('./server');

var Corpse = require('./Corpse');

/* ************************************************
** GAME PC CLASS
************************************************ */
var PC = function (id, playerName, name, gender, race, description, level, health, maxhealth, energy, maxenergy, magic, maxmagic, strength, agility, intellect, meleepower, speed, spellpower, hitchance, stealth, criticalchance, defence, attack, combatSkills, stealthSkills, magicSpells, roomid, inventory, money, allegiances, equipment, messages, secretdialog, movementfunctions) {

  this.id = id;
  this.playerName = playerName;  
  this.name = name;
  this.gender = gender;
  this.race = race;
  this.description = description;
  this.level = level;
    
    
  this.health = health;
  this.maxhealth = maxhealth;
  
  this.energy = energy;  
  this.maxenergy = maxenergy;
  this.magic = magic;
  this.maxmagic = maxmagic;
  this.strength = strength;
  this.agility = agility;
  this.intellect = intellect;
    
  this.meleepower = meleepower;
  this.speed = speed;
  this.spellpower = spellpower;
  this.hitchance = hitchance;
  this.stealth = stealth;
  this.criticalchance = criticalchance;
  this.defence = defence;
  this.attack = attack;
    
  this.combatSkills = combatSkills;
  this.stealthSkills = stealthSkills;
  this.magicSpells = magicSpells;
    
  this.roomid = roomid;
  this.inventory = inventory;    
  this.money = money;   
  this.allegiances = allegiances;
    this.currentBattle = null;
    
    this.equipment = equipment;
    
    this.messages = messages;
    
    this.secretDialog = secretdialog;
    this.movementFunctions = movementfunctions;
    
  var heartbeat = function () {
    //return this.name + ' REPORTING!';
      if(this.currentBattle == null){
          if(this.health < this.maxhealth){
              this.health += Math.ceil((this.maxhealth)/20);
          }
          if(this.energy < this.maxenergy){
              this.energy += Math.ceil((this.maxenergy)/10);
          }
          if(this.magic < this.maxmagic){
              this.magic += Math.ceil((this.maxmagic)/10);
          }
      }
  }  
  
  var killMe = function () {
    for(var i=0; i<players.length; i++){
        if(players[i].PC.id == this.id){
            var dieingPlayer = players[i];
            break;
        }
    }
      
      
    corpses.push(new Corpse(this.name, this.description, this.roomid ));
    
    server.socket.to(dieingPlayer.id).emit('message', {message: "YOU DIE.", styles: [{color: '#FF0000', weight: 'Bold'}]});
    //server.socket.to('room'+this.roomid).emit('message', {message: this.name+" falls down dead.", styles: [{color: '#ffffff', weight: 'Normal'}]});
    dieingPlayer.Socket.broadcast.to('room'+this.roomid).emit('message', {message: dieingPlayer.PC.name + " falls down dead.", styles: [{color: '#ffffff', weight: 'Normal'}]});

    dieingPlayer.Socket.to(dieingPlayer.id).leave('room'+this.roomid);
    dieingPlayer.Socket.to(dieingPlayer.id).join('roomTHERUSMEDICAL');        
      
    this.roomid = "THERUSMEDICAL";
    
    //server.socket.to('roomTHERUSMEDICAL').emit('message', {message: this.name+" is wheeled into Therus Medical on a stretcher and quickly revived.", styles: [{color: '#ffffff', weight: 'Normal'}]});  
      
      this.health = 0;
      
    server.socket.to(dieingPlayer.id).emit('move player', {id: dieingPlayer.id, roomName: server.roomById("THERUSMEDICAL").name, mapx: server.roomById("THERUSMEDICAL").mapX, mapy: server.roomById("THERUSMEDICAL").mapY, mapImage: server.roomById("THERUSMEDICAL").region['map']});
      
  }
  
  var messageMe = function (data) {
      if(this.messages == undefined){
          this.messages = [];
      }
      
      this.messages.push({id: server.getRandomInt(0, 99999), from: data.from, date: data.date, subject: data.subject, body: data.body});
      
  }
  
  // Define which variables and methods can be accessed
  return {
    heartbeat: heartbeat,
    killMe: killMe,
    messageMe: messageMe,
    id: this.id,
    playerName: this.playerName,
    name: this.name,
      gender:  this.gender,
      race:  this.race,
      description:   this.description,
      level:   this.level,
      health:   this.health,
      maxhealth:  this.maxhealth,
      energy:   this.energy,
      maxenergy:   this.maxenergy,
      magic:  this.magic,
      maxmagic:   this.maxmagic,
      strength:  this.strength,
      agility:  this.agility,
      intellect:   this.intellect,
      meleepower:  this.meleepower,
      speed:  this.speed,
      spellpower:  this.spellpower,
      hitchance: this.hitchance,
      stealth:  this.stealth,
      criticalchance:  this.criticalchance,
      defence:  this.defence,
      attack:  this.attack,
      combatSkills:  this.combatSkills,
      stealthSkills:  this.stealthSkills,
      magicSpells:  this.magicSpells,
      roomid:  this.roomid,
      inventory: this.inventory,
      money:  this.money,
      allegiances: this.allegiances,
      currentBattle: this.currentBattle,
      equipment: this.equipment,
      messages: this.messages,
      secretDialog: this.secretDialog,
      movementFunctions: this.movementFunctions
  }
}

// Export the Player class so you can use it in
// other files by using require("Player")
module.exports = PC