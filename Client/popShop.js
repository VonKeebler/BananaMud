var shopItemNames = [];
var shopItemPrices = [];
var shoppingItemSelectors = [];
var shopItemArray = [];
var shopBuySellMenu, shopBuySellName, shopBuySellDescription, shopBuySellStock, shopBuySellPlayerStock;

var shopBuySellHealth, shopBuySellEnergy, shopBuySellMagic, shopBuySellStrength, shopBuySellAgility, shopBuySellIntellect;

var shopBuySellMeleePower, shopBuySellSpeed, shopBuySellSpellPower, shopBuySellHitChance, shopBuySellStealth, shopBuySellCritChance;

var shopBuySellDefence, shopBuySellAttack;

var shopBuySellAdd, shopBuySellSubtract, shopBuySellBuy;

var shopBuySellValue = [];
var shopBuySellPriceDisplayArray = [];

var shopPop, shopBuySellMenuPop;

var selectedShopItemIndex = null;
var selectedItemValue, selectedItemId;

var playerItemCount, shopItemCount;

// Shop Shop on Click
/*function shopClick () {

    if(shopMenu.visible === false){
        menusHide();
        shopMenu.visible = true;
        socket.emit('player shop', {id: clientID });     
        
    } else {
        menusHide();
    }
}*/

// Shop Shop on Click
function shopClick (data) {

    if(shopPop == undefined || shopPop.visible == false){
        menusHide();
        
        graphics = game.add.graphics(0, 0);
        
        shopPop = game.add.sprite((game.world.width/2)+36, game.world.height-256, 'shoppingMenu');        
        
        shopPop.anchor.x = 0;
        shopPop.anchor.y = 0;

        socket.emit('player shop', {id: clientID });     
        
    } else {
        menusHide();
        
    }
}

// Shop Show Inventory
function onShopInventory (data) {
    //test = data.shop[data.shopItems[0]]['basePriceDif']; JESUS CHRIST REMEMBER THIS FOREVER AND HOPE THE ARRAY AND PRODUCT KEYS ARE NEVER OUT OF SYNC
    //console.log(data.shopItemsArray[0].baseValue + " PLUS " + test + " IS " + (data.shopItemsArray[0].baseValue + test));
    
    shopItemArray = [];
    
    for(var i=0; i<Object.keys(data.shop).length; i++){
        var productPrice = parseInt(data.shopItemsArray[i].baseValue) + parseInt(data.shop[data.shopItems[i]]['basePriceDif']);
        var priceArray = currencyExchange(productPrice);
        
        shopItemArray[i] = data.shopItemsArray[i]; // LOAD UP SHOP ARRAY FROM BASE ITEM.
        
        shopItemNames[i] = shopPop.addChild(game.add.text(11, 48 + (i * 18), data.shopItemsArray[i].name, { font: "12px Arial", fill: "#ffffff"}));
        
        temptext = shopPop.addChild(game.add.text(179, 48 + (i * 18), priceArray[0], { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
        temptext.setTextBounds(0, 0, 38, 20);         
        
        shopItemPrices.push(temptext );

        temptext = shopPop.addChild(game.add.text(214, 48 + (i * 18), priceArray[1], { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
        temptext.setTextBounds(0, 0, 38, 20);        
        
        shopItemPrices.push(temptext );

        temptext = shopPop.addChild(game.add.text(251, 48 + (i * 18), priceArray[2], { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
        temptext.setTextBounds(0, 0, 38, 20);        
        
        shopItemPrices.push(temptext );        
        
        tempItemSelector = shopPop.addChild(game.add.sprite(9, 47 + (i * 18), 'shoppingItemSelector'));
        tempItemSelector.alpha = 0;
        tempItemSelector.inputEnabled = true;
        tempItemSelector.events.onInputDown.add(swapShopItemSelectors, this);
        
        //shoppingItemSelectors.push(tempItemSelector, data.shopItemsArray[i]);
        shoppingItemSelectors[i] = tempItemSelector;
        
    }

}

function swapShopItemSelectors(selector, item){
    var indexSelected;
    if(selector.alpha == 0){
        for(var i=0; i<shoppingItemSelectors.length;i++){
            shoppingItemSelectors[i].alpha = 0;
            if(shoppingItemSelectors[i] == selector){
                indexSelected = i;
            }
        }        
        selector.alpha = .6;
        //alert(indexSelected + " INDEX IN " + shopItemArray + " IS " + shopItemArray[indexSelected]);
        BuySellMenu(shopItemArray[indexSelected]);
    }
        
    
}

function BuySellMenu(item){

    var itemStats = item.stats;
    
    if(itemStats.health == undefined) { itemStats.health = 0; }
    if(itemStats.energy == undefined) { itemStats.energy = 0; }
    if(itemStats.magic == undefined) { itemStats.magic = 0; }
        
    if(itemStats.strength == undefined) { itemStats.strength = 0; }
    if(itemStats.agility == undefined) { itemStats.agility = 0; }
    if(itemStats.intellect == undefined) { itemStats.intellect = 0; }
    
    if(itemStats.meleepower == undefined) { itemStats.meleepower = 0; }
    if(itemStats.speed == undefined) { itemStats.speed = 0; }
    if(itemStats.spellpower == undefined) { itemStats.spellpower = 0; }
    
    if(itemStats.hitchance == undefined) { itemStats.hitchance = 0; }
    if(itemStats.stealth == undefined) { itemStats.stealth = 0; }
    if(itemStats.critchance == undefined) { itemStats.critchance = 0; }
    
    if(itemStats.defence == undefined) { itemStats.defence = 0; }
    if(itemStats.attack == undefined) { itemStats.attack = 0; }
    
    if(shopBuySellMenuPop == undefined || shopBuySellMenuPop.visible == false){
        //shopBuySellMenu.visible = true;

        shopBuySellMenuPop = game.add.sprite((game.world.width/2)+330, game.world.height-256, 'shoppingBuySellMenu');        

        shopBuySellMenuPop.anchor.x = 0;
        shopBuySellMenuPop.anchor.y = 0;
        
        
        shopBuySellName = shopBuySellMenuPop.addChild(game.add.text(84, 11, item.name, { font: "12px Arial", fill: "#ffffff"}));
        shopBuySellDescription = shopBuySellMenuPop.addChild(game.add.text(12, 34, item.description, { font: "10px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: 296}));
        
        //ITEM STATS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        shopBuySellHealth = shopBuySellMenuPop.addChild(game.add.text(77, 93, itemStats.health, { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
        shopBuySellHealth.setTextBounds(0, 0, 47, 8);
        
        shopBuySellEnergy = shopBuySellMenuPop.addChild(game.add.text(170, 93, itemStats.energy, { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
        shopBuySellEnergy.setTextBounds(0, 0, 47, 8);
        
        shopBuySellMagic = shopBuySellMenuPop.addChild(game.add.text(263, 93, itemStats.magic, { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
        shopBuySellMagic.setTextBounds(0, 0, 47, 8);
        
        
        shopBuySellStrength = shopBuySellMenuPop.addChild(game.add.text(50, 115, itemStats.strength, { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
        shopBuySellStrength.setTextBounds(0, 0, 47, 8);
        
        shopBuySellAgility = shopBuySellMenuPop.addChild(game.add.text(50, 139, itemStats.agility, { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
        shopBuySellAgility.setTextBounds(0, 0, 47, 8);
        
        shopBuySellIntellect = shopBuySellMenuPop.addChild(game.add.text(50, 163, itemStats.intellect, { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
        shopBuySellIntellect.setTextBounds(0, 0, 47, 8);        
        
        
        shopBuySellMeleePower = shopBuySellMenuPop.addChild(game.add.text(135, 115, itemStats.meleepower, { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
        shopBuySellMeleePower.setTextBounds(0, 0, 47, 8);
        
        shopBuySellSpeed = shopBuySellMenuPop.addChild(game.add.text(135, 139, itemStats.speed, { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
        shopBuySellSpeed.setTextBounds(0, 0, 47, 8);
        
        shopBuySellSpellPower = shopBuySellMenuPop.addChild(game.add.text(135, 163, itemStats.spellpower, { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
        shopBuySellSpellPower.setTextBounds(0, 0, 47, 8);        
        
        
        shopBuySellHitChance = shopBuySellMenuPop.addChild(game.add.text(268, 115, itemStats.hitchance, { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
        shopBuySellHitChance.setTextBounds(0, 0, 47, 8);
        
        shopBuySellStealth = shopBuySellMenuPop.addChild(game.add.text(268, 139, itemStats.stealth, { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
        shopBuySellStealth.setTextBounds(0, 0, 47, 8);
        
        shopBuySellCritChance = shopBuySellMenuPop.addChild(game.add.text(268, 163, itemStats.critchance, { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
        shopBuySellCritChance.setTextBounds(0, 0, 47, 8);  
        
        
        shopBuySellDefence = shopBuySellMenuPop.addChild(game.add.text(84, 182, itemStats.defence, { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
        shopBuySellDefence.setTextBounds(0, 0, 47, 8);
        
        shopBuySellAttack = shopBuySellMenuPop.addChild(game.add.text(177, 182, itemStats.attack, { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
        shopBuySellAttack.setTextBounds(0, 0, 47, 8);
        
        //END ITEM STATS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        
        shopBuySellStock = shopBuySellMenuPop.addChild(game.add.text(90, 229, item.count, { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
        shopBuySellStock.setTextBounds(0, 0, 52, 14); 
        
        shopBuySellPlayerStock = shopBuySellMenuPop.addChild(game.add.text(12, 229, item.playerCount, { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
        shopBuySellPlayerStock.setTextBounds(0, 0, 52, 14);  
        
        shopBuySellValue = [0, 0, 0];
        shopBuySellPriceDisplayArray[0] = shopBuySellMenuPop.addChild(game.add.text(134, 229, shopBuySellValue[0], { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
        shopBuySellPriceDisplayArray[0].setTextBounds(0, 0, 38, 20); 
        
        shopBuySellPriceDisplayArray[1] = shopBuySellMenuPop.addChild(game.add.text(170, 229, shopBuySellValue[1], { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
        shopBuySellPriceDisplayArray[1].setTextBounds(0, 0, 38, 20); 
        
        shopBuySellPriceDisplayArray[2] = shopBuySellMenuPop.addChild(game.add.text(206, 229, shopBuySellValue[2], { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
        shopBuySellPriceDisplayArray[2].setTextBounds(0, 0, 38, 20); 
        
        shopBuySellAdd = shopBuySellMenuPop.addChild(game.add.sprite(50, 229, 'shoppingAddButton'));
        shopBuySellAdd.inputEnabled = true;
        shopBuySellAdd.events.onInputDown.add(shopBuySellAddClick, this);
        
        shopBuySellSubtract = shopBuySellMenuPop.addChild(game.add.sprite(68, 229, 'shoppingSubtractButton'));
        shopBuySellSubtract.inputEnabled = true;
        shopBuySellSubtract.events.onInputDown.add(shopBuySellSubtractClick, this);
        
        shopBuySellBuy = shopBuySellMenuPop.addChild(game.add.sprite(233, 190, 'shoppingBuySellMenuBuyButton'));
        shopBuySellBuy.inputEnabled = true;
        shopBuySellBuy.events.onInputDown.add(shopTransactButton, this);        

        
        playerItemCount = item.playerCount;
        shopItemCount = item.count;
        selectedItemValue = item.shopValue;
        selectedItemId = item.itemID;
        
    } else {
        shopBuySellName.text = item.name;
        shopBuySellDescription.text = item.description;

        //ITEM STATS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        shopBuySellHealth.text = itemStats.health;
        shopBuySellEnergy.text = itemStats.energy;
        shopBuySellMagic.text = itemStats.magic;
        
        shopBuySellStrength.text = itemStats.strength;
        shopBuySellAgility.text = itemStats.agility;
        shopBuySellIntellect.text = itemStats.intellect;      
        
        
        shopBuySellMeleePower.text = itemStats.meleepower;
        shopBuySellSpeed.text = itemStats.speed;
        shopBuySellSpellPower.text = itemStats.spellpower;         
        
        
        shopBuySellHitChance.text = itemStats.hitchance;
        shopBuySellStealth.text = itemStats.stealth;
        shopBuySellCritChance.text = itemStats.critchance;   
        
        
        shopBuySellDefence.text = itemStats.defence;
        shopBuySellAttack.text = itemStats.attack;          
                
        
        //END ITEM STATS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++        
        
        shopBuySellStock.text = item.count;
        shopBuySellPlayerStock.text = item.playerCount;
        
        shopBuySellValue = [0, 0, 0];
        shopBuySellPriceDisplayArray[0].text = shopBuySellValue[0];
        shopBuySellPriceDisplayArray[1].text = shopBuySellValue[1];
        shopBuySellPriceDisplayArray[2].text = shopBuySellValue[2];
        
        playerItemCount = item.playerCount;
        shopItemCount = item.count;
        selectedItemValue = item.shopValue; 
        selectedItemId = item.itemID;
    }
    
}

function shopBuySellAddClick() {
    
    if(parseInt(shopBuySellStock.text) > 0){
        shopBuySellStock.text = parseInt(shopBuySellStock.text) - 1;
        shopBuySellPlayerStock.text = parseInt(shopBuySellPlayerStock.text) + 1;
    } else {
        alert('You cant buy no more');
    }
    
    var transactionDifference = parseInt(shopBuySellPlayerStock.text) - parseInt(playerItemCount);
    
    if(transactionDifference >= 0){
       
        shopBuySellPriceDisplayArray[0].addColor('#ff0000', 0);
        shopBuySellPriceDisplayArray[1].addColor('#ff0000', 0);
        shopBuySellPriceDisplayArray[2].addColor('#ff0000', 0);
    }
    if(transactionDifference < 0){
        
        transactionDifference = Math.abs(transactionDifference);
        shopBuySellPriceDisplayArray[0].addColor('#00ff00', 0);
        shopBuySellPriceDisplayArray[1].addColor('#00ff00', 0);
        shopBuySellPriceDisplayArray[2].addColor('#00ff00', 0);
    }
    
    shopBuySellValue = currencyExchange(selectedItemValue * transactionDifference);
    shopBuySellPriceDisplayArray[0].text = shopBuySellValue[0];
    shopBuySellPriceDisplayArray[1].text = shopBuySellValue[1];
    shopBuySellPriceDisplayArray[2].text = shopBuySellValue[2];
}

function shopBuySellSubtractClick() {
    
    if(parseInt(shopBuySellPlayerStock.text) > 0){
        shopBuySellPlayerStock.text = parseInt(shopBuySellPlayerStock.text) - 1;
        shopBuySellStock.text = parseInt(shopBuySellStock.text) + 1;
    } else {
        alert('You cant sell no more');
    }
    
    var transactionDifference = parseInt(shopBuySellPlayerStock.text) - parseInt(playerItemCount);
    
    if(transactionDifference >= 0){
       
        shopBuySellPriceDisplayArray[0].addColor('#ff0000', 0);
        shopBuySellPriceDisplayArray[1].addColor('#ff0000', 0);
        shopBuySellPriceDisplayArray[2].addColor('#ff0000', 0);
    }
    if(transactionDifference < 0){
        
        transactionDifference = Math.abs(transactionDifference);
        shopBuySellPriceDisplayArray[0].addColor('#00ff00', 0);
        shopBuySellPriceDisplayArray[1].addColor('#00ff00', 0);
        shopBuySellPriceDisplayArray[2].addColor('#00ff00', 0);
    }
    
    shopBuySellValue = currencyExchange(selectedItemValue * transactionDifference);
    shopBuySellPriceDisplayArray[0].text = shopBuySellValue[0];
    shopBuySellPriceDisplayArray[1].text = shopBuySellValue[1];
    shopBuySellPriceDisplayArray[2].text = shopBuySellValue[2];
}

function shopTransactButton() {
    
    var transactionDifference = parseInt(shopBuySellPlayerStock.text) - parseInt(playerItemCount);
    
    socket.emit('player shop transaction', {id: clientID,  itemID: selectedItemId, count: transactionDifference});
    
}

function dePopShop() {
    
    shopPop.destroy();
    shopItemNames = [];
    shopItemPrices = [];
    shoppingItemSelectors = [];
    
    shopBuySellValue = [0, 0, 0];
    
    playerItemCount = null;
    shopItemCount = null;
    selectedItemValue = null;  
    selectedItemId = null;
}

function dePopShopBuySell() {
    
    shopBuySellMenuPop.destroy();

}