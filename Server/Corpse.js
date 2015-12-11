var util = require('util')

var server = require('./server');

var disintegrateTimeout;

/* ************************************************
** GAME CORPSE CLASS
************************************************ */
var Corpse = function ( name, description, roomid) {
  this.id = server.getRandomInt(0, 99999);

  this.name = name;
  this.description = description;
  this.roomid = roomid;
  
  this.disintegrateTimeout = setTimeout(disintegrateCorpse, 180000, this.id );
  
// Disintegrate corpse
  function disintegrateCorpse(corpseId){
      
      for(var i = 0; i<corpses.length; i++){
          
          if(corpseId == corpses[i].id){
              var thisCorpse = corpses[i];

              server.socket.to('room'+thisCorpse.roomid).emit('message', {message: "The corpse of a "+thisCorpse.name+" rots into the ground.", styles: [{color: '#ffffff', weight: 'Bold'}]});

              corpses.splice(i, 1);
              delete thisCorpse;
              break;
          }
      }
  
  }
    
  var heartbeat = function () {

  } 

  // Define which variables and methods can be accessed
  return {

    heartbeat: heartbeat,
    disintegrateCorpse: disintegrateCorpse,
    id: this.id,
    name: this.name,
    description: this.description,
    roomid : this.roomid
    
  }
  

}

module.exports = Corpse
