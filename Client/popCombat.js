var combatPop;

var combatHomeNamePlates = [];
var combatHomeNames = [];

var combatHomeStatusPlates = [];
var combatHomeStatuses = [];

var combatHomeHealths = [];

var combatAwayNamePlates = [];
var combatAwayNames = [];

var combatAwayStatusPlates = [];
var combatAwayStatuses = [];

var combatAwayHealths = [];

var skillDisplay = [];

var combatMoneyArray = [];
var combatMoneyDisplayArray = [];
var combatInventory = [];
var combatDisplayInventory = [];

var combatCountDown, combatEnd, combatEndCount;

var combatHitTimers = [];

var combatTargetButton, combatFleeButton;

function popCombatPrep(data){ // on receipt of prep combat
    console.log('COMBAT PREP RECEIVED');
    if(combatPop == undefined || combatPop.visible == false){
        
        menusHide();
        
        graphics = game.add.graphics(0, 0);

        combatPop = game.add.sprite((game.world.width/2), (game.world.height/2), 'CombatMenu');        
        combatPop.anchor.x = 0.5;
        combatPop.anchor.y = 0.5;
        
        combatPop.scale.x = .1;
        combatPop.scale.y = .1;
        
    
        game.add.tween(combatPop.scale).to({ x: 1, y: 1}, 250, Phaser.Easing.Quadratic.InOut, true);

        //combatHomeNamePlates[0] = combatPop.addChild(game.make.sprite( -393, -247 , 'CombatNamePlate'));
        //combatHomeStatusPlates[0] = combatPop.addChild(game.make.sprite( -165, -247 , 'CombatStatusPlate'));
        combatTargetButton = combatPop.addChild(game.make.button( 9 - 400, 365 - 300 , 'CombatTargetButton', targetOnClick, this, 0, 0, 0));
        combatFleeButton = combatPop.addChild(game.make.button( 51-400, 365-300 , 'CombatFleeButton', fleeOnClick, this, 0, 0, 0));
                
        for(var i=0; i<data.homeCombatants.length; i++){
            combatHomeNamePlates[i] = combatPop.addChild(game.make.sprite( -393, -247 + (i*24) , 'CombatNamePlate'));
            combatHomeNamePlates[i].inputEnabled = true;
            combatHomeNamePlates[i].events.onInputDown.add(homeNamePlateOnClick, {index: i});
            
            combatHomeNamePlates[i].targetPoint = new Phaser.Point(combatHomeNamePlates[i].position.x+225, combatHomeNamePlates[i].position.y);
            
            combatHomeStatusPlates[i] = combatPop.addChild(game.make.sprite( -165, -247 + (i*24) , 'CombatStatusPlate'));
            combatHomeNames[i] = combatHomeNamePlates[i].addChild(game.make.text( 3, 2 , data.homeCombatants[i].name, { font: "16px Arial", fill: '#ffffff' }));
            combatHomeStatuses[i] = combatHomeStatusPlates[i].addChild(game.make.text( 3, 2 , data.homeCombatants[i].status, { font: "16px Arial", fill: '#ffffff' }));
            
            combatHomeHealths[i] = combatHomeStatusPlates[i].addChild(game.make.text( 3, 2, data.homeCombatants[i].health, { font: "16px Arial", fill: '#ffffff', boundsAlignH: "right"  }));
            combatHomeHealths[i].setTextBounds(0, 0, 167, 16);
            
        
        }
        
        for(var i=0; i<data.awayCombatants.length; i++){
            combatAwayNamePlates[i] = combatPop.addChild(game.make.sprite( 12, -247 + (i*24) , 'CombatNamePlate'));
            combatAwayNamePlates[i].inputEnabled = true;
            combatAwayNamePlates[i].events.onInputDown.add(awayNamePlateOnClick, {index: i});
            
            combatAwayNamePlates[i].targetPoint = new Phaser.Point(combatAwayNamePlates[i].position.x, combatAwayNamePlates[i].position.y);
            
            combatAwayStatusPlates[i] = combatPop.addChild(game.make.sprite( 240, -247 + (i*24) , 'CombatStatusPlate'));
            combatAwayNames[i] = combatAwayNamePlates[i].addChild(game.make.text( 3, 2, data.awayCombatants[i].name, { font: "16px Arial", fill: '#ffffff' }));
            combatAwayStatuses[i] = combatAwayStatusPlates[i].addChild(game.make.text( 3, 2 , data.awayCombatants[i].status, { font: "16px Arial", fill: '#ffffff' }));
            
            combatAwayHealths[i] = combatAwayStatusPlates[i].addChild(game.make.text( 3, 2, data.awayCombatants[i].health, { font: "16px Arial", fill: '#ffffff', boundsAlignH: "right"  })); 
            combatAwayHealths[i].setTextBounds(0, 0, 167, 16);
        }
        
        if(data.inventory != undefined){
            combatInventory = data.inventory;
            for(var i=0; i < combatInventory.length; i++){
                combatDisplayInventory[i] = combatPop.addChild(game.add.sprite((625-(combatPop.width/2)) + (42*i), 365-(combatPop.height/2), 'inventoryIcons'));
                combatDisplayInventory[i].frame = data.inventory[i].imageIndex;
            }
        } 
        
        if(data.money != undefined){
            combatMoneyArray = currencyExchange(data.money);
        } else {
            combatMoneyArray[0] = 0;
            combatMoneyArray[1] = 0;
            combatMoneyArray[2] = 0;
        }
        combatMoneyDisplayArray[0] = combatPop.addChild(game.make.text( 570-400, 437-300 , combatMoneyArray[0], { font: "12px Arial", fill: '#ffffff' }));
        combatMoneyDisplayArray[1] = combatPop.addChild(game.make.text( 570-400, 456-300, combatMoneyArray[1], { font: "12px Arial", fill: '#ffffff' }));
        combatMoneyDisplayArray[2] = combatPop.addChild(game.make.text( 570-400, 475-300 , combatMoneyArray[2], { font: "12px Arial", fill: '#ffffff' }));     
        
        updateStartTimer({startTimer: data.startTimer});
        
        if(data.combatSkills != undefined){
            for(var i=0; i<data.combatSkills.length; i++){
                skillDisplay.push( combatPop.addChild( game.make.button( 9-400 + (i*42), 492-300 , 'skillImages', skillOnClick, this) ) );
                skillDisplay[skillDisplay.length-1].frame = data.combatSkills[i].imageIndex;
            }
        }
        if(data.stealthSkills != undefined){
            for(var i=0; i<data.stealthSkills.length; i++){
                skillDisplay.push( combatPop.addChild( game.make.button( 278-400 + (i*42), 365-300 , 'skillImages', skillOnClick, this) ) );
                skillDisplay[skillDisplay.length-1].frame = data.stealthSkills[i].imageIndex;                
            }            
        }
        if(data.magicSpells != undefined){
            for(var i=0; i<data.magicSpells.length; i++){
                skillDisplay.push( combatPop.addChild( game.make.button( 278-400 + (i*42), 492-300 , 'skillImages', skillOnClick, this) ) );
                skillDisplay[skillDisplay.length-1].frame = data.magicSpells[i].imageIndex;                
            }            
        }        
        
        
    } else {
        menusHide();
    }
    
}

function dePopCombat() {
    combatPop.destroy();
}

function skillOnClick() {
    mouseCursor = 'crosshair';
}

function targetOnClick() {
    mouseCursor = 'crosshair';
}

function fleeOnClick() {
    
}

function onCombatUpdate(data) {
    console.log('COMBAT UPDATE RECEIVED');
    
    for(var i = 0; i<data.homeCombatants.length; i++){
        
        if(combatHomeNames[i] == undefined){
            
            combatHomeNamePlates[i] = combatPop.addChild(game.make.sprite( -393, -247 + (i*24) , 'CombatNamePlate'));
            combatHomeNamePlates[i].inputEnabled = true;
            combatHomeNamePlates[i].events.onInputDown.add(homeNamePlateOnClick, {index: i});
            
            combatHomeNamePlates[i].targetPoint = new Phaser.Point(combatHomeNamePlates[i].position.x+225, combatHomeNamePlates[i].position.y);
            
            combatHomeStatusPlates[i] = combatPop.addChild(game.make.sprite( -165, -247 + (i*24) , 'CombatStatusPlate'));
            combatHomeNames[i] = combatHomeNamePlates[i].addChild(game.make.text( 3, 2 , data.homeCombatants[i].name, { font: "16px Arial", fill: '#ffffff' }));
            combatHomeStatuses[i] = combatHomeStatusPlates[i].addChild(game.make.text( 3, 2 , data.homeCombatants[i].status, { font: "16px Arial", fill: '#ffffff' }));
            
            combatHomeHealths[i] = combatHomeStatusPlates[i].addChild(game.make.text( 3, 2, data.homeCombatants[i].health, { font: "16px Arial", fill: '#ffffff', boundsAlignH: "right" }));    
            combatHomeHealths[i].setTextBounds(0, 0, 167, 16);
        } else {
            combatHomeNames[i].text = data.homeCombatants[i].name;
            combatHomeStatuses[i].text = data.homeCombatants[i].status;
            combatHomeHealths[i].text = data.homeCombatants[i].health;
        }

    }
    
    for(var i = 0; i<data.awayCombatants.length; i++){

        if(combatAwayNames[i] == undefined){
            
            combatAwayNamePlates[i] = combatPop.addChild(game.make.sprite( 12, -247 + (i*24) , 'CombatNamePlate'));
            combatAwayNamePlates[i].inputEnabled = true;
            combatAwayNamePlates[i].events.onInputDown.add(awayNamePlateOnClick, {index: i});
            
            combatAwayNamePlates[i].targetPoint = new Phaser.Point(combatAwayNamePlates[i].position.x, combatAwayNamePlates[i].position.y);
            
            combatAwayStatusPlates[i] = combatPop.addChild(game.make.sprite( 240, -247 + (i*24) , 'CombatStatusPlate'));
            combatAwayNames[i] = combatAwayNamePlates[i].addChild(game.make.text( 3, 2, data.awayCombatants[i].name, { font: "16px Arial", fill: '#ffffff' }));
            combatAwayStatuses[i] = combatAwayStatusPlates[i].addChild(game.make.text( 3, 2 , data.awayCombatants[i].status, { font: "16px Arial", fill: '#ffffff' }));
            
            combatAwayHealths[i] = combatAwayStatusPlates[i].addChild(game.make.text( 3, 2, data.awayCombatants[i].health, { font: "16px Arial", fill: '#ffffff', boundsAlignH: "right" }));       
            combatAwayHealths[i].setTextBounds(0, 0, 167, 16);
            
        } else {
            combatAwayNames[i].text = data.awayCombatants[i].name;
            combatAwayStatuses[i].text = data.awayCombatants[i].status;
            combatAwayHealths[i].text = data.awayCombatants[i].health;
        }

    }
    
    if(data.inventory != undefined){
        combatInventory = data.inventory;
        for(var i=0; i < combatInventory.length; i++){
            combatDisplayInventory[i] = combatPop.addChild(game.add.sprite((625-(combatPop.width/2)) + (42*i), 365-(combatPop.height/2), 'inventoryIcons'));
            combatDisplayInventory[i].frame = data.inventory[i].imageIndex;
        }
    }   
    
    if(data.money != undefined){
        combatMoneyArray = currencyExchange(data.money);
    } else {
        combatMoneyArray[0] = 0;
        combatMoneyArray[1] = 0;
        combatMoneyArray[2] = 0;
    }
    combatMoneyArray = currencyExchange(data.money);
    combatMoneyDisplayArray[0].text = combatMoneyArray[0];
    combatMoneyDisplayArray[1].text = combatMoneyArray[1];
    combatMoneyDisplayArray[2].text = combatMoneyArray[2];

    
    updateStartTimer({startTimer: data.startTimer});

}

function onCombatHit (data){
    var targetFrameX, targetFrameY;
    
    console.log(data.characterHitting.side + ' character number '+ data.characterHitting.index + ' should hit character ' + data.characterHit.index + ' on side '+data.characterHit.side + ' with a '+data.attackDamage.status+' attack for '+ data.attackDamage.totalDamage +' damage');
    
    if(data.characterHitting.side == "home" && data.characterHit.side == "away"){
        targetFrameX = combatPop.x + combatAwayNamePlates[data.characterHit.index].targetPoint.x; // FOR PARTICLES
        targetFrameY = combatPop.y + combatAwayNamePlates[data.characterHit.index].targetPoint.y;
            
        var tweenHit = game.add.tween(combatHomeNamePlates[data.characterHitting.index]).to({x: combatAwayNamePlates[data.characterHit.index].targetPoint.x-225,  y: combatAwayNamePlates[data.characterHit.index].targetPoint.y}, 250, Phaser.Easing.Exponential.In);
        var tweenReturn = game.add.tween(combatHomeNamePlates[data.characterHitting.index]).to({x: combatHomeNamePlates[data.characterHitting.index].position.x,  y: combatHomeNamePlates[data.characterHitting.index].position.y}, 250, Phaser.Easing.Back.Out);   
        tweenHit.chain(tweenReturn);
        tweenHit.start();
    }
    
    if(data.characterHitting.side == "away" && data.characterHit.side == "home"){
        targetFrameX = combatPop.x + combatHomeNamePlates[data.characterHit.index].targetPoint.x; //FOR PARTICLES
        targetFrameY = combatPop.y + combatHomeNamePlates[data.characterHit.index].targetPoint.y;
        
        var tweenHit = game.add.tween(combatAwayNamePlates[data.characterHitting.index]).to({x: combatHomeNamePlates[data.characterHit.index].targetPoint.x,  y: combatHomeNamePlates[data.characterHit.index].targetPoint.y}, 250, Phaser.Easing.Exponential.In);
        var tweenReturn = game.add.tween(combatAwayNamePlates[data.characterHitting.index]).to({x: combatAwayNamePlates[data.characterHitting.index].position.x,  y: combatAwayNamePlates[data.characterHitting.index].position.y}, 250, Phaser.Easing.Back.Out);   
        tweenHit.chain(tweenReturn);
        tweenHit.start();
    }

    combatHitTimers.push( setTimeout(applyDamage, 250, {targetX: targetFrameX, targetY: targetFrameY, side: data.characterHit.side, index: data.characterHit.index, status: data.attackDamage.status, totalDamage: data.attackDamage.totalDamage}) ); // APPLY DAMAGE AND GRAPHIC
}

function applyDamage (data){
    if(data.side == "away"){
        //combatAwayHealths[data.index].text = parseInt(combatAwayHealths[data.index].text) - data.totalDamage;

    } else {
        //combatHomeHealths[data.index].text = parseInt(combatHomeHealths[data.index].text) - data.totalDamage;

    }

    if(data.status == "critical hit"){
        console.log("CRITICAL HIT");
        popMeleeCriticalHit({targetX: data.targetX, targetY: data.targetY }); //LETS TRY PARTICLES?
    } else {
        popMeleeHit({targetX: data.targetX, targetY: data.targetY }); //LETS TRY PARTICLES?
    }    


}

function updateStartTimer(data){
        
    if(data.startTimer > 0){
        if(combatCountDown == undefined){
            combatCountDown = combatPop.addChild(game.make.text(-60,0, 'BATTLE STARTS IN: '+data.startTimer, {  font: "32px Bangers", fill: '#ffffff', boundsAlignH: "center" }));
            combatCountDown.setTextBounds(0, 0, 140, 60);
        } else {
            combatCountDown.text = 'BATTLE STARTS IN: '+data.startTimer;
        }
    }

    if(data.startTimer == 0){
        if(combatCountDown == undefined){
            combatCountDown = combatPop.addChild(game.make.text(-120,0, 'FIGHT', {  font: "32px Bangers", fill: '#ff0000', boundsAlignH: "center" }));
            combatCountDown.setTextBounds(0, 0, 260, 100);
        } else {
            combatCountDown.text = 'FIGHT';
        } 
        game.add.tween(combatCountDown).to( { alpha: 0 }, 1000, "Linear", true);
    }   
    
    game.world.bringToTop(combatCountDown);
}

function homeNamePlateOnClick (index){

    if(mouseCursor == 'crosshair'){
        if(combatHomeStatuses[this.index].text == "Dead"){
            console.log('CANNOT TARGET DEAD THINGS')
            return;
        }
        
        for(var i=0; i<combatHomeNamePlates.length; i++){
            combatHomeNamePlates[i].frame = 0;
        }
        for(var i=0; i<combatAwayNamePlates.length; i++){
            combatAwayNamePlates[i].frame = 0;
        }        
        
        combatHomeNamePlates[this.index].frame = 1;
        resetMouseCursor();
        
        socket.emit('player combat target', { id: clientID , targetSide: "home", targetIndex: this.index});
    }
}

function awayNamePlateOnClick (index){
    
    if(mouseCursor == 'crosshair'){
        if(combatAwayStatuses[this.index].text == "Dead"){
            console.log('CANNOT TARGET DEAD THINGS')
            return;
        }
        
        for(var i=0; i<combatHomeNamePlates.length; i++){
            combatHomeNamePlates[i].frame = 0;
        }        
        for(var i=0; i<combatAwayNamePlates.length; i++){
            combatAwayNamePlates[i].frame = 0;
        }        

        combatAwayNamePlates[this.index].frame = 1;
        resetMouseCursor();
        
        socket.emit('player combat target', { id: clientID , targetSide: "away", targetIndex: this.index});
    }
}


function onCombatEnd() {
    combatEndCount = 10;
    combatEnd = combatPop.addChild(game.make.text(-60,0, 'COMBAT CLOSES IN: '+combatEndCount+' SECONDS',{  font: "32px Bangers", fill: '#ffffff', boundsAlignH: "center" }));
    combatEnd.setTextBounds(0, 0, 260, 100);
    combatHitTimers.push( setTimeout(stepEndCombat, 1000, this) );
    
}

function stepEndCombat() {
    combatEndCount--;
    combatEnd.text = 'COMBAT CLOSES IN: '+combatEndCount+' SECONDS';

    if(combatEndCount == 1){
        combatHitTimers.push( setTimeout(removeCombat, 1000, this) );
    } else {
        combatHitTimers.push( setTimeout(stepEndCombat, 1000, this) );
    }
    
}

function removeCombat() {
    for(var i=0; i<combatHitTimers.length; i++){
        clearTimeout(combatHitTimers[i]);
    }
    resetMouseCursor();

    for(var i=0; i<combatHomeNamePlates.length; i++){
        combatHomeNamePlates[i].destroy();
    }

    for(var i=0; i<combatHomeNames.length; i++){
        combatHomeNames[i].destroy();
    }
    

    for(var i=0; i<combatHomeStatusPlates.length; i++){
        combatHomeStatusPlates[i].destroy();
    }
    
    for(var i=0; i<combatHomeStatuses.length; i++){
        combatHomeStatuses[i].destroy();
    }   
    
    for(var i=0; i<combatHomeHealths.length; i++){
        combatHomeHealths[i].destroy();
    } 
        
    
    for(var i=0; i<combatAwayNamePlates.length; i++){
        combatAwayNamePlates[i].destroy();
    }    
    for(var i=0; i<combatAwayNames.length; i++){
        combatAwayNames[i].destroy();
    }   
    
    for(var i=0; i<combatAwayStatusPlates.length; i++){
        combatAwayStatusPlates[i].destroy();
    }
    
    for(var i=0; i<combatAwayStatuses.length; i++){
        combatAwayStatuses[i].destroy();
    }      
    
    for(var i=0; i<combatAwayHealths.length; i++){
        combatAwayHealths[i].destroy();
    } 
    
    for(var i=0; i<combatDisplayInventory.length; i++){
        combatDisplayInventory[i].destroy();
    } 
    
    for(var i=0; i<skillDisplay.length; i++){
        skillDisplay[i].destroy();
    }
    
    combatEnd.destroy();
    combatHitTimers = [];
    combatCountDown.destroy();
    combatCountDown = undefined;
    
    combatTargetButton.destroy();
    combatFleeButton.destroy();
    
    combatHomeNamePlates = [];
    combatHomeNames = [];
    combatHomeStatusPlates = [];
    combatHomeStatuses = [];
    combatHomeHealths = [];
    
    combatAwayNamePlates = [];
    combatAwayNames = [];
    combatAwayStatusPlates = [];
    combatAwayStatuses = [];
    combatAwayHealths = [];
    
    combatDisplayInventory = [];
    
    combatPop.destroy();
    
}