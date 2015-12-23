var server = require('./server');

/* ************************************************
** GAME ITEM CLASS
************************************************ */
var Item = function (id, itemID, name, description, type, imageIndex, baseValue, stats, use) {
  this.id = server.generateId();

  this.itemID = itemID;
  this.name = name;
  this.description = description;
  this.type = type;
  this.imageIndex = imageIndex;
  this.baseValue = baseValue;
  this.stats = stats;
  this.use = use;

  // Define which variables and methods can be accessed
  return {
    id: this.id,
    itemID: this.itemID,
    name: this.name,
    description: this.description,
    type: this.type,
    imageIndex: this.imageIndex,
    baseValue: this.baseValue,
    stats: this.stats,
    use: this.use
  }

}

// Export the Player class so you can use it in
// other files by using require("Player")
module.exports = Item