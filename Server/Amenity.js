var util = require('util')

var server = require('./server');

/* ************************************************
** GAME AMENITY CLASS
************************************************ */
var Amenity = function (amenityID, name, imageIndex, description, upgrades) {
    
  this.amenityID = amenityID;

  this.name = name;
  this.imageIndex = imageIndex;
  this.description = description;
  this.upgrades = upgrades; 

  // Define which variables and methods can be accessed
  return {

    amenityID: this.amenityID,
    name: this.name,
    imageIndex: this.imageIndex,      
    description: this.description,
    upgrades: this.upgrades
  }


}

module.exports = Amenity
