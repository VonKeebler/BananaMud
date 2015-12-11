var util = require('util')

var server = require('./server');

/* ************************************************
** GAME EMPLOYEE CLASS
************************************************ */
var Employee = function (name, city, race, gender, upkeep, skills) {
    
  this.id = server.getRandomInt(0, 99999);

  this.name = name;
  this.city = city;
  this.race = race;
  this.gender = gender;
  this.upkeep = upkeep;
    
  this.skills = skills;

  var heartbeat = function () {
    
      
  } 

  // Define which variables and methods can be accessed
  return {
    heartbeat: heartbeat,

    id: this.id,
    name: this.name,
    city: this.city,
    race: this.race,
    gender: this.gender,
    upkeep: this.upkeep,
    skills: this.skills
  }


}

module.exports = Employee
