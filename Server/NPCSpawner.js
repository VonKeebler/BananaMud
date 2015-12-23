var util = require('util')

var server = require('./server');

var NPC = require('./NPC')

var Fileloader = require('./Fileloader.js');

// Spawn an NPC
function spawnNPC (npcName, roomid) {
    
    var npcToSpawn = Fileloader.findNPC(npcName);
        
    if(npcToSpawn == undefined){
        util.log(npcName + ' NOT SPAWNED: NOT FOUND');
        return;
    }
    
    var id, name, alias, roomdescription, description, startingroom, inventory, money, dialog, secretdialog, idleEmotes, allegiance, currentBattle, health, maxhealth, energy, maxenergy, magic, maxmagic, strength, agility, intellect, meleepower, speed, spellpower, hitchance, stealth, criticalchance, defence, attack, roaming, equipment;
    //id = npcToSpawn['id'];
    id = server.generateId();
    name = npcToSpawn['name'];
    alias = npcToSpawn['alias'];
    roomdescription = npcToSpawn['roomdescription'];
    description = npcToSpawn['description'];
    startingroom = roomid; //SET TO SPAWN ROOM
    inventory = npcToSpawn['inventory'];
    money = npcToSpawn['money'];
    dialog = npcToSpawn['dialog'];
    secretdialog = npcToSpawn['secretdialog'];
    idleEmotes = npcToSpawn['idleEmotes'];
    allegiance = npcToSpawn['allegiance'];
    currentBattle = null;
        
    health = npcToSpawn['health'];
    maxhealth = npcToSpawn['maxhealth'];
    energy = npcToSpawn['energy'];        
    maxenergy = npcToSpawn['maxenergy'];        
    magic = npcToSpawn['magic'];        
    maxmagic = npcToSpawn['maxmagic'];        
        
    strength = npcToSpawn['strength'];        
    agility = npcToSpawn['agility'];        
    intellect = npcToSpawn['intellect'];        
        
    meleepower = npcToSpawn['meleepower'];
    speed = npcToSpawn['speed'];
    spellpower = npcToSpawn['spellpower'];
        
    hitchance = npcToSpawn['hitchance'];
    stealth = npcToSpawn['stealth'];
    criticalchance = npcToSpawn['criticalchance'];
                
    defence = npcToSpawn['defence'];
    attack = npcToSpawn['attack'];        
        
    roaming = npcToSpawn['roaming'];
    equipment = npcToSpawn['equipment'];
        
    var newNPC = new NPC(id, name, alias, roomdescription, description, startingroom, inventory, money, dialog, secretdialog, idleEmotes, allegiance, currentBattle, health, maxhealth, energy, maxenergy, magic, maxmagic, strength, agility, intellect, meleepower, speed, spellpower, hitchance, stealth, criticalchance, defence, attack, roaming, equipment);
    npcs.push(newNPC);
    return newNPC.id;
    
}

module.exports.spawnNPC = spawnNPC;
