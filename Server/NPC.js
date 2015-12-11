var util = require('util')
var server = require('./server');
var Movement = require('./Movement');
var Corpse = require('./Corpse');
        
var roamingTimeOut;

/* ************************************************
** GAME NPC CLASS
************************************************ */
var NPC = function (id, name, alias, roomdescription, description, roomid, inventory, money, dialog, secretdialog, idleEmotes, allegiance, currentBattle, health, maxhealth, energy, maxenergy, magic, maxmagic, strength, agility, intellect, meleepower, speed, spellpower, hitchance, stealth, criticalchance, defence, attack, roaming, equipment, visibility) {
  this.id = server.getRandomInt(0, 99999);
  
  this.name = name;
  this.alias = alias;
  this.roomDescription = roomdescription;
  this.description = description;
  this.roomid = roomid;
  this.inventory = inventory;
  this.money = money;
  this.dialog = dialog;
  this.secretdialog = secretdialog;
  this.idleEmotes = idleEmotes;
  this.allegiance = allegiance;
    this.currentBattle = null;
    
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
    
    
    this.roaming = roaming;
    
    this.roamingTimeOut = null;
    
    
    this.equipment = equipment;
    this.visibility = visibility;
    
    
  // Getters and setters
  var getRoom = function () {
    return roomid;
  }

  var setRoom = function (newRoom) {
    this.roomid = newRoom;
  }
  
  var killMe = function () {
    corpses.push(new Corpse(this.name, this.description, this.roomid ));
    server.socket.to('room'+this.roomid).emit('message', {message: this.name+" falls down dead.", styles: [{color: '#ffffff', weight: 'Normal'}]});

    npcs.splice(npcs.indexOf(this), 1);

    delete this;
  }

  var heartbeat = function () {
    //return this.name + ' REPORTING!';
    var chance = server.getRandomInt(0, 100);
    
    if(this.roaming != undefined){
        var roamChance = server.getRandomInt(0, 100);
        if(roamChance > 50 && this.roamingTimeOut == null){
            var roamInterval = this.roaming['interval']       
            //util.log('TRIGGERING ROAM');
            this.roamingTimeOut = setTimeout(Movement.roamNPC, roamInterval, this.id);
        }
    }
      
    if(chance > 90){
        if(this.idleEmotes != undefined){
            var emotes = Object.keys(this.idleEmotes);
            if(emotes.length != 0){
                var randomIndex = server.getRandomInt(0, emotes.length-1);
                server.socket.to('room'+this.roomid).emit('message', {message: this.idleEmotes[emotes[randomIndex]], styles: [{color: '#ffffff', weight: 'Normal'}]});
            }
        }
    }
    return chance;
  }  
  
  var die = function () {
    //Kills the Character
      
  }  
  
  // Define which variables and methods can be accessed
  return {
    getRoom: getRoom,
    setRoom: setRoom,
    killMe: killMe,
    heartbeat: heartbeat,
    die: die,
    id: this.id,
    name: this.name,
    alias: this.alias,
    roomDescription: this.roomDescription,
    description: this.description,
    roomid: this.roomid,
    inventory: this.inventory,
    money: this.money,
    dialog: this.dialog,
    secretdialog: this.secretdialog,
    idleEmotes: this.idleEmotes,
    allegiance: this.allegiance,
    currentBattle: this.currentBattle,
      
    health : this.health,
    maxhealth : this.maxhealth,
    energy : this.energy,
    maxenergy : this.maxenergy,
    magic : this.magic,
    maxmagic : this.maxmagic, 
    
    strength : this.strength,  
    agility : this.agility,
    intellect : this.intellect,    
    
    meleepower : this.meleepower,
    speed : this.speed,
    spellpower : this.spellpower,    
    
    hitchance : this.hitchance,    
    stealth : this.stealth,    
    criticalchance : this.criticalchance,  
    
    defence : this.defence,  
    attack : this.attack,
      
    roaming: this.roaming,
      roamingTimeOut: this.roamingTimeOut,
      equipment: this.equipment,
      visibility: this.visibility
  }
}

// Export the Player class so you can use it in
// other files by using require("Player")
module.exports = NPC