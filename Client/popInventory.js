var inventory = [];
var equippedInventory = [];
var displayInventory = [];
var displayInventoryCount = [];
var displayInventoryCountPanel = [];
var displayEquipment = [];
var updatingInventory = false;

var selectedInventoryIndex = null;
var selectedInventorySlotType = null;


var inventorySelectPop = null;
var itemInfoBox, itemInfoBoxDesc, itemInfoBoxHealth, itemInfoBoxEnergy, itemInfoBoxMagic, itemInfoBoxStrength, itemInfoBoxAgility, itemInfoBoxIntellect, itemInfoBoxMeleePower, itemInfoBoxSpeed, itemInfoBoxSpellPower, itemInfoBoxHitChance, itemInfoBoxStealth, itemInfoBoxCritChance, itemInfoBoxDefence, itemInfoBoxAttack;

var inventorySelectEquipButton, inventorySelectDropButton, inventorySelectUseButton;

var inventoryMoneyArray = [];

function inventoryItemClick (data) {

    if(inventorySelectPop == undefined || inventorySelectPop.visible == false){
        menusHide();
        
        graphics = game.add.graphics(0, 0);
        
        inventorySelectPop = game.add.sprite(charSheetBaseX-314, charSheetBaseY+309, 'itemInfoBox');        
        
        inventorySelectPop.anchor.x = 0;
        inventorySelectPop.anchor.y = 0;

        socket.emit('player inventory select', {invIndex: this.index, itemId: this.itemId, slotType: this.slotType});     
        
    } else {
        if(selectedInventoryIndex == this.index && selectedInventorySlotType == this.slotType){

        } else {

            socket.emit('player inventory select', {invIndex: this.index, itemId: this.itemId, slotType: this.slotType });     
        }
        
    }
}

function onInventorySelect (data) {

        if(data.health == undefined) { data.health = 0; }
        if(data.energy == undefined) { data.energy = 0; }
        if(data.magic == undefined) { data.magic = 0; }
        
        if(data.strength == undefined) { data.strength = 0; }
        if(data.agility == undefined) { data.agility = 0; }
        if(data.intellect == undefined) { data.intellect = 0; }
    
        if(data.meleepower == undefined) { data.meleepower = 0; }
        if(data.speed == undefined) { data.speed = 0; }
        if(data.spellpower == undefined) { data.spellpower = 0; }
    
        if(data.hitchance == undefined) { data.hitchance = 0; }
        if(data.stealth == undefined) { data.stealth = 0; }
        if(data.critchance == undefined) { data.critchance = 0; }
    
        if(data.defence == undefined) { data.defence = 0; }
        if(data.attack == undefined) { data.attack = 0; }
    
    
    if(selectedInventoryIndex == null){
        itemInfoBoxName = inventorySelectPop.addChild(game.add.text(85, 9, data.name, { font: "12px Arial", fill: "#ffffff"}));
        itemInfoBoxDesc = inventorySelectPop.addChild(game.add.text(13, 33, data.description, { font: "10px Arial", fill: "#ffffff", wordWrap: true, boundsAlignV: 'top', wordWrapWidth: 292})); 
        

        itemInfoBoxHealth = inventorySelectPop.addChild(game.add.text(76, 94, data.health, { font: "10px Arial", fill: "#ffffff", boundsAlignH: "right" }));
        itemInfoBoxHealth.setTextBounds(0, 0, 27, 8);
        itemInfoBoxEnergy = inventorySelectPop.addChild(game.add.text(169, 94, data.energy, { font: "10px Arial", fill: "#ffffff", boundsAlignH: "right" }));
        itemInfoBoxEnergy.setTextBounds(0, 0, 27, 8);
        itemInfoBoxMagic = inventorySelectPop.addChild(game.add.text(262, 94, data.magic, { font: "10px Arial", fill: "#ffffff", boundsAlignH: "right" }));
        itemInfoBoxMagic.setTextBounds(0, 0, 27, 8);   
        
        itemInfoBoxStrength = inventorySelectPop.addChild(game.add.text(49, 116, data.strength, { font: "10px Arial", fill: "#ffffff", boundsAlignH: "right" }));
        itemInfoBoxStrength.setTextBounds(0, 0, 27, 8);
        itemInfoBoxAgility = inventorySelectPop.addChild(game.add.text(49, 140, data.agility, { font: "10px Arial", fill: "#ffffff", boundsAlignH: "right" }));
        itemInfoBoxAgility.setTextBounds(0, 0, 27, 8);
        itemInfoBoxIntellect = inventorySelectPop.addChild(game.add.text(49, 164, data.intellect, { font: "10px Arial", fill: "#ffffff", boundsAlignH: "right" }));
        itemInfoBoxIntellect.setTextBounds(0, 0, 27, 8); 
        
        itemInfoBoxMeleePower = inventorySelectPop.addChild(game.add.text(136, 116, data.meleepower, { font: "10px Arial", fill: "#ffffff", boundsAlignH: "right" }));
        itemInfoBoxMeleePower.setTextBounds(0, 0, 27, 8);
        itemInfoBoxSpeed = inventorySelectPop.addChild(game.add.text(136, 140, data.speed, { font: "10px Arial", fill: "#ffffff", boundsAlignH: "right" }));
        itemInfoBoxSpeed.setTextBounds(0, 0, 27, 8);
        itemInfoBoxSpellPower = inventorySelectPop.addChild(game.add.text(136, 164, data.spellpower, { font: "10px Arial", fill: "#ffffff", boundsAlignH: "right" }));
        itemInfoBoxSpellPower.setTextBounds(0, 0, 27, 8); 
        
        itemInfoBoxHitChance = inventorySelectPop.addChild(game.add.text(270, 116, data.hitchance, { font: "10px Arial", fill: "#ffffff", boundsAlignH: "right" }));
        itemInfoBoxHitChance.setTextBounds(0, 0, 27, 8);
        itemInfoBoxStealth = inventorySelectPop.addChild(game.add.text(270, 140, data.stealth, { font: "10px Arial", fill: "#ffffff", boundsAlignH: "right" }));
        itemInfoBoxStealth.setTextBounds(0, 0, 27, 8);
        itemInfoBoxCritChance = inventorySelectPop.addChild(game.add.text(270, 164, data.critchance, { font: "10px Arial", fill: "#ffffff", boundsAlignH: "right" }));
        itemInfoBoxCritChance.setTextBounds(0, 0, 27, 8); 
        
        itemInfoBoxDefence = inventorySelectPop.addChild(game.add.text(85, 183, data.defence, { font: "10px Arial", fill: "#ffffff", boundsAlignH: "right" }));
        itemInfoBoxDefence.setTextBounds(0, 0, 27, 8);
        itemInfoBoxAttack = inventorySelectPop.addChild(game.add.text(179, 183, data.attack, { font: "10px Arial", fill: "#ffffff", boundsAlignH: "right" }));
        itemInfoBoxAttack.setTextBounds(0, 0, 27, 8);
        
        inventorySelectEquipButton = inventorySelectPop.addChild( game.add.sprite(8, 224, 'itemInfoEquipButton'));
        inventorySelectEquipButton.inputEnabled = true;
        
        if(data.slotType == "inventory"){
            inventorySelectEquipButton.events.onInputDown.add(equipOnClick, {item: data.name});        
            inventorySelectEquipButton.key = 'itemInfoEquipButton';
        } else if(data.slotType == "equipment"){
            inventorySelectEquipButton.events.onInputDown.add(removeOnClick, {item: data.name});        
            inventorySelectEquipButton.key = 'itemInfoUnequipButton';
        }
        
        inventorySelectUseButton = inventorySelectPop.addChild( game.add.sprite(154, 224, 'itemInfoUseButton'));
        inventorySelectUseButton.inputEnabled = true;
        inventorySelectUseButton.events.onInputDown.add(useOnClick, {item: data.name});
        
        inventorySelectDropButton = inventorySelectPop.addChild( game.add.sprite(228, 224, 'itemInfoDropButton'));
        inventorySelectDropButton.inputEnabled = true;
        inventorySelectDropButton.events.onInputDown.add(dropOnClick, {item: data.name});
        
    } else {
        itemInfoBoxName.text = data.name;
        itemInfoBoxDesc.text = data.description;
        
        
        itemInfoBoxHealth.text = data.health;
        itemInfoBoxEnergy.text = data.energy;
        itemInfoBoxMagic.text = data.magic;
        
        itemInfoBoxStrength.text = data.strength;
        itemInfoBoxAgility.text = data.agility;
        itemInfoBoxIntellect.text = data.intellect;
        
        itemInfoBoxMeleePower.text = data.meleepower;
        itemInfoBoxSpeed.text = data.speed;
        itemInfoBoxSpellPower.text = data.spellpower;
        
        itemInfoBoxHitChance.text = data.hitchance;
        itemInfoBoxStealth.text = data.stealth;
        itemInfoBoxCritChance.text = data.critchance;
        
        itemInfoBoxDefence.text = data.defence;
        itemInfoBoxAttack.text = data.attack;
        
        inventorySelectEquipButton.events.onInputDown.removeAll();
        inventorySelectUseButton.events.onInputDown.removeAll();
        inventorySelectDropButton.events.onInputDown.removeAll();
        
        if(data.slotType == "inventory"){
            inventorySelectEquipButton.events.onInputDown.add(equipOnClick, {item: data.name});
            inventorySelectEquipButton.loadTexture('itemInfoEquipButton');
        } else if(data.slotType == "equipment"){
            inventorySelectEquipButton.events.onInputDown.add(removeOnClick, {item: data.name});        
            inventorySelectEquipButton.loadTexture('itemInfoUnequipButton');
        }
        
        inventorySelectUseButton.events.onInputDown.add(useOnClick, {item: data.name});
        inventorySelectDropButton.events.onInputDown.add(dropOnClick, {item: data.name});
    }
    
    selectedInventorySlotType = data.slotType;
    selectedInventoryIndex = data.invIndex;

                                                         
    
}

function dePopInventorySelect () {
    selectedInventoryIndex = null;
    selectedInventorySlotType = null;
    inventorySelectPop.destroy();
}

function dropOnClick (data) {
    console.log(this.item)
    socket.emit('player drop', {id: clientID, item: this.item }); 
    dePopInventorySelect();
}

function useOnClick (data) {
    socket.emit('player use', {id: clientID, item: this.item }); 

}

function equipOnClick (data) {
    socket.emit('player equip', {id: clientID, item: this.item }); 

}

function removeOnClick (data) {
    socket.emit('player remove', {id: clientID, item: this.item }); 

}



// Player Update Inventory
function onPlayerUpdateInventory (data) {

    console.log('Updating Inventory');
    inventory = [];
    equipment = [];
    for(var i=0; i<displayInventory.length; i++){
        displayInventory[i].destroy();
    } 
    for(var i=0; i<displayInventoryCount.length; i++){
        if(displayInventoryCount[i] != undefined){
            displayInventoryCount[i].destroy();
        }
    }    
    for(var i=0; i<displayInventoryCountPanel.length; i++){
        if(displayInventoryCountPanel[i] != undefined){
            displayInventoryCountPanel[i].destroy();
        }
    }     
    for(var i=0; i<displayEquipment.length; i++){
        displayEquipment[i].destroy();
    } 
    
    displayInventory = [];
    displayInventoryCountPanel = [];
    displayInventoryCount = [];
    displayEquipment = [];
    
    updatingInventory = true;

    for(var i=0; i<data.inventory.length; i++){
        if(i < 4){
            displayInventory[i] = game.add.sprite(charSheetBaseX-240+(i*(42)), charSheetBaseY+173, 'inventoryIcons');
            displayInventory[i].frame = data.inventory[i].imageIndex;
            if(data.inventory[i].count > 1){ 
                displayInventoryCountPanel[i] = game.add.sprite(charSheetBaseX-242+(i*(42)), charSheetBaseY+198, 'inventoryCountPanel');
                displayInventoryCount[i] =  displayInventoryCountPanel[i].addChild( game.add.text(0, 0, data.inventory[i].count, { font: "12px Arial", fill: "#000000", boundsAlignH: 'right'}) );
                displayInventoryCount[i].setTextBounds(0, 0, 33, 13);
            }
        } else if(i<8) {
            displayInventory[i] = game.add.sprite(charSheetBaseX-240+((i-4)*(42)), charSheetBaseY+215, data.inventory[i].imageIndex);
            if(data.inventory[i].count > 1){ 
                displayInventoryCountPanel[i] = game.add.sprite(charSheetBaseX-242+(i-4*(42)), charSheetBaseY+240, 'inventoryCountPanel');
                displayInventoryCount[i] =  displayInventoryCountPanel[i].addChild( game.add.text(0, 0, data.inventory[i].count, { font: "12px Arial", fill: "#000000", boundsAlignH: 'right'}) );
                displayInventoryCount[i].setTextBounds(0, 0, 33, 13);
            }            
        } else {
            displayInventory[i] = game.add.sprite(charSheetBaseX-240+((i-8)*(42)), charSheetBaseY+257, data.inventory[i].imageIndex);            
            if(data.inventory[i].count > 1){ 
                displayInventoryCountPanel[i] = game.add.sprite(charSheetBaseX-242+(i-8*(42)), charSheetBaseY+282, 'inventoryCountPanel');
                displayInventoryCount[i] =  displayInventoryCountPanel[i].addChild( game.add.text(0, 0, data.inventory[i].count, { font: "12px Arial", fill: "#000000", boundsAlignH: 'right'}) );
                displayInventoryCount[i].setTextBounds(0, 0, 33, 13);
            }            
        }
        displayInventory[i].anchor.x = 0;
        displayInventory[i].anchor.y = 0;
        displayInventory[i].inputEnabled = true;
        displayInventory[i].events.onInputDown.add(inventoryItemClick, {index: i, itemId: data.inventory[i].itemID, slotType: 'inventory'});        
    }
    for(var i=0; i<data.equipment.length; i++){
        var x, y;
        if(data.equipmentSlots[i] == "Head"){
            x = charSheetBaseX-314+32;
            y = charSheetBaseY+6;
        }
        if(data.equipmentSlots[i] == "Body"){
            x = charSheetBaseX-314+244;
            y = charSheetBaseY+6;
        }
        if(data.equipmentSlots[i] == "RHand"){

            x = charSheetBaseX-314+32;
            y = charSheetBaseY+60;
        }       
        if(data.equipmentSlots[i] == "LHand"){

            x = charSheetBaseX-314+244;
            y = charSheetBaseY+60;
        }   
        if(data.equipmentSlots[i] == "Legs"){
            x = charSheetBaseX-314+32;
            y = charSheetBaseY+114;
        }       
        if(data.equipmentSlots[i] == "Feet"){
            x = charSheetBaseX-314+244;
            y = charSheetBaseY+114;
        }         

        displayEquipment[i] = game.add.sprite(x, y, 'inventoryIcons');
        displayEquipment[i].frame = data.equipment[i].imageIndex;
        displayEquipment[i].anchor.x = 0;
        displayEquipment[i].anchor.y = 0;
        displayEquipment[i].inputEnabled = true;
        displayEquipment[i].events.onInputDown.add(inventoryItemClick, {index: i, itemId: data.equipment[i].itemID, slotType: 'equipment'});        
    }
    
    updatingInventory = false;
    
    //WHY DID I INCLUDE STATS WITH THE INVENTORY WINDOW? I GUESS TO KEEP IT SHOWING? NOW I HAVE TO CALL THIS EVERY TIME THEY GET HIT?
    
    charSheetHealth.text = data.health;
    charSheetMaxHealth.text = data.maxhealth;
    charSheetEnergy.text = data.energy;
    charSheetMaxEnergy.text = data.maxenergy;
    charSheetMagic.text = data.magic;
    charSheetMaxMagic.text = data.maxmagic;
    
    inventoryMoneyArray = currencyExchange(data.money);
    
    charSheetCrowns.text = inventoryMoneyArray[0];
    charSheetShillings.text = inventoryMoneyArray[1];
    charSheetPence.text = inventoryMoneyArray[2];
    
}
