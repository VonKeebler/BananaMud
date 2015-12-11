
/* ************************************************
** GAME PLAYER CLASS
************************************************ */
var Player = function (id) {
  var id

  var PC;  
  var Socket;
  this.id = id;
  //this.name = name;



  // Define which variables and methods can be accessed
  return {

    id: this.id,

    PC: this.PC,
    Socket: this.Socket
  }
}

// Export the Player class so you can use it in
// other files by using require("Player")
module.exports = Player