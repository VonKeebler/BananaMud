/* global game */

var RemotePlayer = function (index, game, player, room) {
  var room = 0;

  this.game = game
  this.player = player
  this.alive = true

  this.player.name = index.toString()

}

RemotePlayer.prototype.update = function () {

}

window.RemotePlayer = RemotePlayer