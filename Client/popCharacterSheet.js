var characterSheetPop;

function characterClick () {

    if(characterSheetPop == undefined || characterSheetPop.visible == false){
        menusHide();
        //characterSheetMenu.visible = true;
        graphics = game.add.graphics(0, 0);
        
        characterSheetPop = game.add.sprite((game.world.width/2)+36, game.world.height, 'characterSheetMenu');        
        characterSheetPop.anchor.x = 0;
        characterSheetPop.anchor.y = 1;

        socket.emit('player character sheet', {id: clientID });     
        
    } else {
        menusHide();
    }
}

function onPlayerCharacterSheet (data) {
    var characterName = characterSheetPop.addChild(game.make.text( 10, -222, data.name, { font: "12px Arial", fill: '#ffffff' }));
    var characterGender = characterSheetPop.addChild(game.make.text( 237, -222, data.gender, { font: "12px Arial", fill: '#ffffff' }));
    var characterRace = characterSheetPop.addChild(game.make.text( 177, -198, data.race, { font: "12px Arial", fill: '#ffffff' }));
    
    var characterDescription = characterSheetPop.addChild(game.make.text( 11, -175, data.description, { font: "12px Arial", fill: '#ffffff', wordWrap: true, wordWrapWidth: 276 }));
    
    var characterHealth = characterSheetPop.addChild(game.make.text( 67, -110, data.health, { font: "10px Arial", fill: '#ffffff' }));
    var characterHealthSlash = characterSheetPop.addChild(game.make.text( 67, -110, '/', { font: "10px Arial", fill: '#ffffff', boundsAlignH: "center" }));
    characterHealthSlash.setTextBounds(0, 0, 48, 10); 
    var characterMaxHealth = characterSheetPop.addChild(game.make.text( 67, -110, data.maxhealth, { font: "10px Arial", fill: '#ffffff', boundsAlignH: "right"}));
    characterMaxHealth.setTextBounds(0, 0, 48, 10);  
    
    var characterEnergy = characterSheetPop.addChild(game.make.text( 160, -110, data.energy, { font: "10px Arial", fill: '#ffffff' }));
    var characterEnergySlash = characterSheetPop.addChild(game.make.text( 160, -110, '/', { font: "10px Arial", fill: '#ffffff', boundsAlignH: "center" }));    
    characterEnergySlash.setTextBounds(0, 0, 48, 10); 
    var characterMaxEnergy = characterSheetPop.addChild(game.make.text( 160, -110, data.maxenergy, { font: "10px Arial", fill: '#ffffff', boundsAlignH: "right" }));
    characterMaxEnergy.setTextBounds(0, 0, 48, 10);      
    
    var characterMagic = characterSheetPop.addChild(game.make.text( 253, -110, data.magic, { font: "10px Arial", fill: '#ffffff' }));
    var characterMagicSlash = characterSheetPop.addChild(game.make.text( 253, -110, '/', { font: "10px Arial", fill: '#ffffff', boundsAlignH: "center" }));    
    characterMagicSlash.setTextBounds(0, 0, 48, 10);  
    var characterMaxMagic = characterSheetPop.addChild(game.make.text( 253, -110, data.maxmagic, { font: "10px Arial", fill: '#ffffff', boundsAlignH: "right" }));
    characterMaxMagic.setTextBounds(0, 0, 48, 10);  
    
    var characterStrength = characterSheetPop.addChild(game.make.text( 40, -88, data.strength, { font: "10px Arial", fill: '#ffffff', boundsAlignH: "right" }));
    characterStrength.setTextBounds(0, 0, 48, 10);      
    var characterAgility = characterSheetPop.addChild(game.make.text( 40, -64, data.agility, { font: "10px Arial", fill: '#ffffff', boundsAlignH: "right" }));
    characterAgility.setTextBounds(0, 0, 48, 10);     
    var characterIntellect = characterSheetPop.addChild(game.make.text( 40, -40, data.intellect, { font: "10px Arial", fill: '#ffffff', boundsAlignH: "right" }));
    characterIntellect.setTextBounds(0, 0, 48, 10);     
    
    var characterMeleePower = characterSheetPop.addChild(game.make.text( 128, -88, data.meleepower, { font: "10px Arial", fill: '#ffffff', boundsAlignH: "right" }));
    characterMeleePower.setTextBounds(0, 0, 48, 10);         
    var characterSpeed = characterSheetPop.addChild(game.make.text( 128, -64, data.speed, { font: "10px Arial", fill: '#ffffff', boundsAlignH: "right" }));
    characterSpeed.setTextBounds(0, 0, 48, 10);     
    var characterSpellPower = characterSheetPop.addChild(game.make.text( 128, -40, data.spellpower, { font: "10px Arial", fill: '#ffffff', boundsAlignH: "right" })); 
    characterSpellPower.setTextBounds(0, 0, 48, 10);     

    var characterHitChance = characterSheetPop.addChild(game.make.text( 261, -88, data.hitchance, { font: "10px Arial", fill: '#ffffff', boundsAlignH: "right" }));
    characterHitChance.setTextBounds(0, 0, 48, 10);         
    var characterStealth = characterSheetPop.addChild(game.make.text( 261, -64, data.stealth, { font: "10px Arial", fill: '#ffffff', boundsAlignH: "right" }));
    characterStealth.setTextBounds(0, 0, 48, 10);     
    var characterCriticalChance = characterSheetPop.addChild(game.make.text( 261, -40, data.criticalchance, { font: "10px Arial", fill: '#ffffff', boundsAlignH: "right" })); 
    characterCriticalChance.setTextBounds(0, 0, 48, 10);  
    
    var characterDefence = characterSheetPop.addChild(game.make.text( 77, -21, data.defence, { font: "10px Arial", fill: '#ffffff', boundsAlignH: "right" }));
    characterDefence.setTextBounds(0, 0, 48, 10);     
    var characterAttack = characterSheetPop.addChild(game.make.text( 170, -21, data.attack, { font: "10px Arial", fill: '#ffffff', boundsAlignH: "right" })); 
    characterAttack.setTextBounds(0, 0, 48, 10);  
    
}

function dePopCharacterSheet () {

    characterSheetPop.destroy();
}

