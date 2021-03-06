var util = require('util')

var server = require('./server');

/* ************************************************
** GAME SKILL CLASS
************************************************ */
var Skill = function (skillID, name, description, imageIndex, powerCost, energyCost, type, time, onHitValue, totalValue) {

  this.skillID = skillID;
  this.name = name;
  this.description = description;
  this.imageIndex = imageIndex;
  this.powerCost = powerCost;
  this.energyCost = energyCost;
  this.type = type;
  this.time = time;
  this.onHitValue = onHitValue;
  this.totalValue = totalValue;

  // Define which variables and methods can be accessed
  return {

    skillID: this.skillID,
    name: this.name,
    description: this.description,
    imageIndex : this.imageIndex,
    powerCost: this.powerCost,
    energyCost: this.energyCost,
    type: this.type,
    time: this.Time,
    onHitValue: this.onHitValue,
    totalValue: this.totalValue

  }


}

module.exports = Skill
