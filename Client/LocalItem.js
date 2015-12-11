/* global game */ // NO LONGER NECESSARY - DELETE

var LocalItem = function (id, itemID, name, description, type, invImage, baseValue) {

  this.id = id;
  this.itemID = itemID;
  this.name = name;
  this.description = description;
  this.type = type;
  this.invImage = invImage;
  this.baseValue = baseValue;    

  // Define which variables and methods can be accessed
  return {
    id: this.id,
    itemID: this.itemID,
    name: this.name,
    description: this.description,
    type: this.type,
    invImage: this.invImage,
    baseValue: this.baseValue
  }
    
}

LocalItem.prototype.update = function () {

}

window.LocalItem = LocalItem