var util = require('util')

var server = require('./server');

/* ************************************************
** GAME EMPLOYEE CLASS
************************************************ */
var Employee = function (id, name, city, race, gender, upkeep, status, employer, skills) {
    
  //this.id = server.getRandomInt(0, 99999);
  //this.id = server.generateId();
  this.id = id;

  this.name = name;
  this.city = city;
  this.race = race;
  this.gender = gender;
  this.upkeep = upkeep;
    
  this.status = status;
  this.employer = employer;
    
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
    status: this.status,      
    employer: this.employer,            
    skills: this.skills
  }


}

module.exports = Employee


function createEmployee(city){

    var id = server.generateId();

    var race = server.randomRace();
    var gender = server.randomGender();    
    
    var name = server.randomName(race, gender);
    //var city = city;

    var status = 'available';
    var employer = 'none';

    var skillTotal = server.getRandomInt(20, 200);
    var employeeSkills = {};
    
    var breaker = 0;
    
    while(skillTotal > 0 && breaker < 6){
        var randomAmenity = server.getRandomInt(0, amenities.length-1);
        if(employeeSkills[amenities[randomAmenity].amenityID] == undefined){            
            var randomSkill = server.getRandomInt(10, 100);
            employeeSkills[amenities[randomAmenity].amenityID] = (randomSkill/100).toFixed(2);
            skillTotal -= randomSkill;
        }
        breaker++;
    }
    
    var skillNames = Object.keys(employeeSkills);
    
    var upkeep = 0;
    
    for(var i = 0; i < skillNames.length; i++){
        upkeep += Math.floor(server.getAmenityById(skillNames[i]).upgrades["1"].baseUpkeep * employeeSkills[skillNames[i]]);
    }
    
    util.log("CREATING NEW EMPLOYEE: "+name+", "+gender+" "+race+", "+JSON.stringify(employeeSkills)+" "+upkeep+" "+city);
    
    newEmployee = new Employee(id, name, city, race, gender, upkeep, status, employer, employeeSkills);
    employees.push(newEmployee);
    

}
module.exports.createEmployee = createEmployee;