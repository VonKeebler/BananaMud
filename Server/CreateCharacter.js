var util = require('util')

var server = require('./server');

var Fileloader = require('./Fileloader.js');

// Create Character Functions
function showNewCharacterSkills (data) {
  var skillList = [];

  if(data.skills == "combat"){
      for(var i=0; i<combatSkills.length; i++){
          var skillData = {skillID: combatSkills[i].skillID, name: combatSkills[i].name, description: combatSkills[i].description, imageIndex: combatSkills[i].imageIndex, powerCost: combatSkills[i].powerCost, resourceCost: combatSkills[i].energyCost};

          skillList.push(skillData);
      }
  }

  if(data.skills == "stealth"){
      for(var i=0; i<stealthSkills.length; i++){
          var skillData = {skillID: stealthSkills[i].skillID, name: stealthSkills[i].name, description: stealthSkills[i].description, imageIndex: stealthSkills[i].imageIndex, powerCost: stealthSkills[i].powerCost, resourceCost: stealthSkills[i].energyCost};

          skillList.push(skillData);
      }
  }

  if(data.skills == "magic"){
      for(var i=0; i<spells.length; i++){
          var spellData = {skillID: spells[i].skillID, name: spells[i].name, description: spells[i].description, imageIndex: spells[i].imageIndex, powerCost: spells[i].powerCost, resourceCost: spells[i].magicCost};

          skillList.push(spellData);
      }
  }

  server.socket.to(this.id).emit('new character skill list', {skillList: skillList, skills: data.skills});
}

module.exports.showNewCharacterSkills = showNewCharacterSkills;


function onCreateCharacter(data){

  result = Fileloader.createCharacter(data);
  //creatingPlayer.PC = pcByPlayerName(data.name);
  if(result == "CREATION SUCCESSFUL"){
      console.log('Character '+ data.name +' Created Succesfully For ' + this.id)
      server.socket.to(this.id).emit('character created', {id: this.id}); //Next step is to rerun onNewPlayer with login ID given this character
      return;
  } else {
      console.log('WHAT THE FUCK HAPPEN AT CHARACTER CREATION?')
      return;
  }

}

module.exports.onCreateCharacter = onCreateCharacter;
