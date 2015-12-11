var util = require('util')

var server = require('./server');

/* ************************************************
** GAME CITY CLASS
************************************************ */
var City = function (cityID, name, description, population, propertyTax, market) {
    
  this.cityID = cityID;

  this.name = name;
  this.description = description;
  this.population = population;
  this.propertyTax = propertyTax;
  this.market = market;

  var heartbeat = function () {
      
      
  } 

  // Define which variables and methods can be accessed
  return {
    heartbeat: heartbeat,

    cityID: this.cityID,
    name: this.name,
    description: this.description,
    population: this.population,
    propertyTax: this.propertyTax,
    market: this.market
  }


}

module.exports = City
