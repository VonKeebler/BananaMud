var game = new Phaser.Game($(window).width()-24, $(window).height()-24, Phaser.AUTO, 'phaser-example', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

//  The Google WebFont Loader will look for this object, so create it before loading the script.
WebFontConfig = {

    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    //active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Indie Flower', 'Shadows Into Light','Amatic SC:700', 'Bangers']
    }

};

//var socket; // Socket connection

var gameState = "Login";
var graphics;
var clientID;

var rooms = [];


//var enemies;

//var currentRoom = 0;
//var roomsLength = 0;

var localRoomsBaseX, localRoomsBaseY;

var charSheetBaseX, charSheetBaseY;
var charSheetHealth, charSheetMaxHealth, charSheetEnergy, charSheetMaxEvery, charSheetMagic, charSheetMaxMagic;
var charSheetHealthSeparator, charSheetEnergySeparator, charSheetMagicSeparator

var charSheetCrowns, charSheetShillings, charSheetPence;


var selectedTextBox;
var hoverTextBox;

var shopIcon;

var mouseCursor = 'normal';

function preload() {

    setEventHandlers();

    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

    game.load.image('bananaMud', 'assets/bananaMud.png');    
    
    game.load.spritesheet('loginButton', 'assets/startButton_sprite_sheet.png', 130, 32);
    game.load.spritesheet('createButton', 'assets/createButton_sprite_sheet.png', 130, 32);
    game.load.spritesheet('loginOkButton', 'assets/okButton_sprite_sheet.png', 130, 32);
    game.load.spritesheet('loginCancelButton', 'assets/cancelButton_sprite_sheet.png', 130, 32);
    game.load.spritesheet('loginTextBox', 'assets/loginTextBox.png', 202, 27);
    
    game.load.image('roomMap', 'assets/roomMap.png');

    game.load.image('CityOfTherus', 'assets/TherusRooms.png');
    game.load.image('TherusCountryside', 'assets/TherusCountryside.png');    
    game.load.image('TherusThievesGuild', 'assets/TherusThievesGuild.png');
    game.load.image('TherusSewer', 'assets/TherusSewerRooms.png');

    game.load.image('charSheet', 'assets/charSheet.png');
    game.load.image('inventoryCountPanel', 'assets/inventoryCounter.png');

    game.load.image('roomSelect', 'assets/roomSelect.png');
    game.load.image('upArrow', 'assets/upArrow.png');
    game.load.image('downArrow', 'assets/downArrow.png');
    game.load.image('doubleupArrow', 'assets/doubleupArrow.png');
    game.load.image('doubledownArrow', 'assets/doubledownArrow.png');

    game.load.image('foodTurkey', 'assets/foodTurkey.png');
    game.load.image('foodFoulMeal', 'assets/foodFoulMeal.png');
    game.load.image('foodHotDog', 'assets/foodHotDog.png');
    game.load.image('foodToppedHotDog', 'assets/foodToppedHotDog.png');
    game.load.image('foodWeirdHotDog', 'assets/foodWeirdHotDog.png');

    game.load.image('drinkCheapBeer', 'assets/drinkCheapBeer.png');
    game.load.image('drinkExpensiveWine', 'assets/drinkWine.png');

    game.load.image('weaponDagger', 'assets/weaponDagger.png');
    game.load.image('weaponLongsword', 'assets/weaponLongsword.png');
    game.load.image('weaponWoodenBow', 'assets/weaponWoodenBow.png');

    game.load.image('armorElCheapoTunic', 'assets/armorElCheapoTunic.png');
    game.load.image('armorSandals', 'assets/armorSandals.png');
    game.load.image('armorDungarees', 'assets/armorDungarees.png');
    game.load.image('armorShield', 'assets/armorShield.png');
    game.load.image('armorLeatherHat', 'assets/armorLeatherHat.png');

    game.load.image('itemTorch', 'assets/itemTorch.png');
    game.load.image('itemHealthPotion', 'assets/itemHealthPotion.png');
    game.load.image('itemLetter', 'assets/itemLetter.png');
    game.load.image('itemEnvelope', 'assets/itemEnvelope.png');
    game.load.image('itemNote', 'assets/itemNote.png');

    game.load.image('cartIcon', 'assets/cart.png');
    game.load.image('cartIconDisabled', 'assets/disabledCart.png');
    game.load.image('speakIcon', 'assets/speak.png');
    game.load.image('charIcon', 'assets/Character.png');
    game.load.image('settingsIcon', 'assets/Settings.png');
    game.load.image('messagesIcon', 'assets/Messages.png');
    game.load.spritesheet('alertIcon', 'assets/AlertSpriteSheet.png', 36, 32);
    game.load.spritesheet('propertyIcon', 'assets/buyManageProperty.png', 36, 32);

    game.load.spritesheet('buyManagePropertyMenu', 'assets/buyManagePropertyMenu.png', 316, 286);
    game.load.image('buyManagePropertyMenuEditButton', 'assets/managePropertyEditButton.png');
    game.load.image('buyManagePropertyMenuEditDescriptionButton', 'assets/managePropertyEditDescriptionButton.png');
    
    game.load.spritesheet('buyManagePropertyAmenitiesIcons', 'assets/managePropertyMenuAmenitiesIcons.png', 40, 40);
    game.load.spritesheet('buyManagePropertyEmployeesIcons', 'assets/managePropertyMenuEmployeeIcon.png', 40, 40);
    
    game.load.image('buyManagePropertyEditMenu', 'assets/popEditPropertyDialog.png');
    game.load.image('PropertyEditMenuNameField', 'assets/propertyEditNameField.png');
    game.load.image('PropertyEditMenuDescField', 'assets/propertyEditDescField.png');
    
    game.load.image('buyManagePropertyManageEmployeeMenu', 'assets/manageEmployeeMenu.png');
    game.load.image('buyManagePropertyAddEmployeeMenu', 'assets/hireEmployeeMenu.png');
    
    game.load.spritesheet('buysellButton', 'assets/buysellButton.png', 78, 24);    
    
    game.load.image('newButton', 'assets/newButton.png');
    game.load.image('sendButton', 'assets/sendButton.png');
    
    game.load.image('messagesMenu', 'assets/MessagesMenu.png');
    game.load.image('messagesViewButton', 'assets/messageButton.png');
    game.load.image('messagesDeleteButton', 'assets/messageDeleteButton.png');
    
    game.load.image('messagesViewMenu', 'assets/MessagesView.png');
    game.load.image('messagesNewMessageMenu', 'assets/MessagesNewMessage.png');
    
    game.load.image('messagesMenuUp', 'assets/MessagesView.png');
    game.load.image('messagesMenuDown', 'assets/MessagesView.png');
    
    game.load.image('NewMessageFromSubjectField', 'assets/newMessageFromSubjectField.png');
    game.load.image('NewMessageBodyField', 'assets/newMessageBodyField.png');
    
    game.load.image('itemInfoBox', 'assets/itemBox.png');
    game.load.image('itemInfoEquipButton', 'assets/itemBoxEquipButton.png');
    game.load.image('itemInfoUnequipButton', 'assets/itemBoxUnequipButton.png');
    game.load.image('itemInfoUseButton', 'assets/itemBoxUseButton.png');
    game.load.image('itemInfoDropButton', 'assets/itemBoxDropButton.png');

    game.load.image('shoppingMenu', 'assets/shoppingMenu.png');
    game.load.image('shoppingItemSelector', 'assets/itemSelector.png');
    game.load.image('shoppingBuySellMenu', 'assets/buysellMenu.png');
    game.load.image('shoppingBuySellMenuBuyButton', 'assets/buysellMenuBuyButton.png');
    game.load.image('shoppingAddButton', 'assets/addButton.png');
    game.load.image('shoppingSubtractButton', 'assets/subtractButton.png');

    game.load.image('characterSheetMenu', 'assets/characterSheetMenu.png');

    game.load.image('newCharacterMenu', 'assets/newCharacter.png');
    game.load.image('newCharacterMenuOk', 'assets/CharSheetOkButton.png');
    game.load.image('newCharacterMenuCancel', 'assets/CharSheetCancelButton.png');
    game.load.image('newCharacterMenuMakeCharacter', 'assets/CharSheetMakeCharButton.png');
    game.load.spritesheet('newCharacterMenuNameField', 'assets/newcharNameField.png', 192, 32);
    game.load.image('newCharacterMenuRaceField', 'assets/newcharRaceField.png');
    game.load.image('newCharacterMenuGenderField', 'assets/newcharGenderField.png');
    game.load.image('newCharacterMenuMaleButton', 'assets/CharSheetMaleButton.png');
    game.load.image('newCharacterMenuFemaleButton', 'assets/CharSheetFemaleButton.png');
    game.load.spritesheet('newCharacterMenuDescField', 'assets/newcharDescField.png', 740, 63);
    game.load.image('newCharacterMenuAddButton', 'assets/largeAdd.png');
    game.load.image('newCharacterMenuSubButton', 'assets/largeSub.png');
    game.load.image('newCharacterMenuSelectCombatSkillsButton', 'assets/newcharSelectCombatSkills.png');
    game.load.image('newCharacterMenuSelectStealthSkillsButton', 'assets/newcharSelectStealthSkills.png');
    game.load.image('newCharacterMenuSelectMagicSpellsButton', 'assets/newcharSelectMagicSpells.png');

    game.load.image('newCharacterMenuSelectCombatSkillsMenu', 'assets/popCombatSkills.png');
    game.load.image('newCharacterMenuSelectStealthSkillsMenu', 'assets/popStealthSkills.png');
    game.load.image('newCharacterMenuSelectMagicSpellsMenu', 'assets/popMagicSpells.png');

    game.load.spritesheet('skillImages', 'assets/skillImages.png', 40, 40);

    game.load.image('skillAddButton', 'assets/SkillAddButton.png');
    game.load.image('skillRemoveButton', 'assets/SkillRemoveButton.png');

    game.load.image('okButton', 'assets/okButton.png');
    game.load.image('cancelButton', 'assets/cancelButton.png');

    game.load.image('newCharacterRaceMenu', 'assets/characterSheetRaceMenu.png');
    game.load.spritesheet('newCharacterRaceMenuDescription', 'assets/characterSheetRaceDescription.png', 402, 342);
    game.load.spritesheet('newCharacterRaceMenuHumanButton', 'assets/CharSheetHumanButton.png', 137, 32);
    game.load.spritesheet('newCharacterRaceMenuWoodElfButton', 'assets/CharSheetWoodElfButton.png', 137, 32);
    game.load.spritesheet('newCharacterRaceMenuHouseElfButton', 'assets/CharSheetHouseElfButton.png', 137, 32);
    game.load.spritesheet('newCharacterRaceMenuHalflingButton', 'assets/CharSheetHalflingButton.png', 137, 32);
    game.load.spritesheet('newCharacterRaceMenuOrcButton', 'assets/CharSheetOrcButton.png', 137, 32);
    game.load.spritesheet('newCharacterRaceMenuGnomeButton', 'assets/CharSheetGnomeButton.png', 137, 32);
    game.load.spritesheet('newCharacterRaceMenuDwarfButton', 'assets/CharSheetDwarfButton.png', 137, 32);
    game.load.spritesheet('newCharacterRaceMenuGillmanButton', 'assets/CharSheetGillmanButton.png', 137, 32);
    game.load.spritesheet('newCharacterRaceMenuGolemButton', 'assets/CharSheetGolemButton.png', 137, 32);
    game.load.spritesheet('newCharacterRaceMenuLizardManButton', 'assets/CharSheetLizardManButton.png', 137, 32);

    game.load.image('ChatterMenu', 'assets/ChatterMenu.png');
    game.load.image('ChatterMenuClose', 'assets/closeChatter.png');
    game.load.image('ChatterMenuSpeakerSelector', 'assets/chatterSpeakerSelector.png');
    game.load.image('ChatterMenuAsk', 'assets/askButton.png');
    game.load.spritesheet('ChatterMenuAskField', 'assets/askField.png', 385, 22);

    game.load.spritesheet('ChatterMenuAskField', 'assets/askField.png');
    game.load.image('ChatterMenuAskButton', 'assets/askButton.png');

    game.load.image('popDialog', 'assets/popDialog.png');
    game.load.image('popDialogNoButton', 'assets/popDialogNoButton.png');
    game.load.image('popDialogYesButton', 'assets/popDialogYesButton.png');

    game.load.image('CombatMenu', 'assets/battleWindow.png');
    game.load.spritesheet('CombatNamePlate', 'assets/battleNamePlate.png', 225, 22);
    game.load.image('CombatStatusPlate', 'assets/battleStatusPlate.png');
    game.load.image('CombatTargetButton', 'assets/battleTarget.png');
    game.load.image('CombatFleeButton', 'assets/battleFlee.png');

    game.load.image('cousinLetterPop', 'assets/cousinLetterPop.png');
    game.load.image('cousinLetter2Pop', 'assets/cousinLetter2Pop.png');
    game.load.image('OldSilvermereInnNotePop', 'assets/itemOldSilvermereInnNote.png');

}

function create() {

    graphics = game.add.graphics(0, 0);

    this.game.stage.backgroundColor = '#222222';

    this.game.stage.disableVisibilityChange = true;


    game.input.keyboard.addCallbacks(this, null, null, keyPress);

    hoverTextBox = game.add.text(10, 10, '', { font: "12px Arial",
                                    fill: "#ffffff",
                                    boundsAlignH: "center",
                                    boundsAlignV: 'top',
                                    wordWrap: true,
                                    wordWrapWidth: 60});
    hoverTextBox.setTextBounds(0, 0, 60, 60);
    hoverTextBox.text = "";


    popLogin();

}

function update() {

    if(messageQueue.length){
        if(showingMessage === 0){
            showingMessage = 1;

            showText(messageQueue.shift());
        }
    }

    if(mouseCursor == 'crosshair'){
        $('canvas').css('cursor', 'crosshair');
    }

}

function render () {

}

function startMud(data){
    console.log('Starting Mud...')

    game.cache.removeImage('bananaMud');  
    game.cache.removeImage('loginButton');  
    game.cache.removeImage('createButton');  
    game.cache.removeImage('loginOkButton');  
    game.cache.removeImage('loginCancelButton');  
    game.cache.removeImage('loginTextBox');  
    
    graphics = game.add.graphics(0, 0);
    
    game.physics.startSystem(Phaser.Physics.ARCADE); // FOR PARTICLES
    var particleEmitter = game.add.emitter(0, 0, 100); // FOR PARTICLES    

    gameState = "Started";
    queueMessage({message: "Welcome to: ", styles: [{color: '#ffffff', weight: 'Bold'}]});
    queueMessage({message: "BANANAMUD", styles: [{color: '#f3ff14', weight: 'Bold', style: 'Italic'}]});
    queueMessage({message: "Type /? or /help for starting information.", styles: [{color: '#ffffff', weight: 'Bold'}]});
    queueMessage({message: "", styles: [{color: '#19de65', weight: 'Normal', style: 'Normal'}]});

    /*outputText = game.add.text(32, 10, '', { font: "15px Arial",
                                            fill: "#19de65",
                                            wordWrap: true,
                                            boundsAlignV: 'bottom',
                                            wordWrapWidth: (game.world.width/2)-50});
    outputText.setTextBounds(0, 0, (game.world.width), game.world.height-52);*/

    outputTextMask = game.add.graphics(0, 0);
    outputTextMask.beginFill(0xffffff);
    outputTextMask.drawRect(32, 0, (game.world.width/2)-37, game.world.height-48);
    //outputText.mask= outputTextMask;
    graphics.endFill();

    outputTextUpArrow = game.add.sprite((game.world.width/2)-20, 5, 'upArrow');
    outputTextUpArrow.inputEnabled = true;
    outputTextUpArrow.events.onInputDown.add(function() { scrollOutput('up'); }, this);

    outputTextDoubleUpArrow = game.add.sprite((game.world.width/2)-20, 25, 'doubleupArrow');
    outputTextDoubleUpArrow.inputEnabled = true;
    outputTextDoubleUpArrow.events.onInputDown.add(function() { scrollOutput('doubleup'); }, this);

    outputTextDownArrow = game.add.sprite((game.world.width/2)-20, game.world.height-60, 'downArrow');
    outputTextDownArrow.inputEnabled = true;
    outputTextDownArrow.events.onInputDown.add(function() { scrollOutput('down'); }, this);

    outputTextDoubleDownArrow = game.add.sprite((game.world.width/2)-20, game.world.height-90, 'doubledownArrow');
    outputTextDoubleDownArrow.inputEnabled = true;
    outputTextDoubleDownArrow.events.onInputDown.add(function() { scrollOutput('doubledown'); }, this);

    inputLine = game.add.text(32, game.world.height-25, '', { font: "15px Arial", fill: "#ffffff" });

    selectedTextBox = inputLine;

    graphics.beginFill(0x19de65);
    middleDivider = graphics.drawRect((game.world.width/2)-2, 0, 4, game.world.height);
    bottomDivider = graphics.drawRect(0, game.world.height-40, (game.world.width/2)-2, 4);
    //middleDivider = new Phaser.Rectangle((this.game.world.width/2)-2, 0, 4, this.game.world.height);
    //bottomDivider = new Phaser.Rectangle(0, this.game.world.height-40, (this.game.world.width/2)-2, 4);
    graphics.endFill();

    localRoomsBaseX = (game.world.width/2)+11;
    localRoomsBaseY = 9;
    localRooms = game.add.sprite(localRoomsBaseX, localRoomsBaseY, 'CityOfTherus');
    localRooms.anchor.x = 0;
    localRooms.anchor.y = 0;

    roomMapMask = game.add.graphics(0, 0);
    roomMapMask.beginFill(0xffffff);
    roomMapMask.drawRect((game.world.width/2)+11, 7, 194, 194);
    localRooms.mask= roomMapMask;
    graphics.endFill();

    roomSelector = game.add.sprite(localRoomsBaseX+89, localRoomsBaseY+89, 'roomSelect');

    //roomMap = game.add.sprite((this.game.world.height*.75), (this.game.world.width*.75), 'roomMap');
    roomMap = game.add.sprite((game.world.width/2)+108, 130, 'roomMap');
    roomMap.anchor.x = 0.5;
    roomMap.anchor.y = 0.5;

    charSheetBaseX = game.world.width;
    charSheetBaseY = 0;
    charSheet = game.add.sprite(charSheetBaseX, charSheetBaseY, 'charSheet');
    charSheet.anchor.x = 1;
    charSheet.anchor.y = 0;

    charSheetHealth = game.add.text(charSheetBaseX-143, charSheetBaseY+3, '', { font: "10px Arial",
                                fill: "#ffffff",
                                boundsAlignH: "left"});
    charSheetHealth.setTextBounds(0, 0, 48, 8);

    charSheetHealthSeparator = game.add.text(charSheetBaseX-143, charSheetBaseY+3, '/', { font: "10px Arial",
                                fill: "#ffffff",
                                boundsAlignH: "center"});
    charSheetHealthSeparator.setTextBounds(0, 0, 48, 8);

    charSheetMaxHealth = game.add.text(charSheetBaseX-143, charSheetBaseY+3, '', { font: "10px Arial",
                                fill: "#ffffff",
                                boundsAlignH: "right"});
    charSheetMaxHealth.setTextBounds(0, 0, 48, 8);


    charSheetEnergy = game.add.text(charSheetBaseX-143, charSheetBaseY+17, '', { font: "10px Arial",
                                fill: "#ffffff",
                                boundsAlignH: "left"});
    charSheetEnergy.setTextBounds(0, 0, 48, 8);

    charSheetEnergySeparator = game.add.text(charSheetBaseX-143, charSheetBaseY+17, '/', { font: "10px Arial",
                                fill: "#ffffff",
                                boundsAlignH: "center"});
    charSheetEnergySeparator.setTextBounds(0, 0, 48, 8);

    charSheetMaxEnergy = game.add.text(charSheetBaseX-143, charSheetBaseY+17, '', { font: "10px Arial",
                                fill: "#ffffff",
                                boundsAlignH: "right"});
    charSheetMaxEnergy.setTextBounds(0, 0, 48, 8);


    charSheetMagic = game.add.text(charSheetBaseX-143, charSheetBaseY+31, '', { font: "10px Arial",
                                fill: "#ffffff",
                                boundsAlignH: "left"});
    charSheetMagic.setTextBounds(0, 0, 48, 8);

    charSheetMagicSeparator = game.add.text(charSheetBaseX-143, charSheetBaseY+31, '/', { font: "10px Arial",
                                fill: "#ffffff",
                                boundsAlignH: "center"});
    charSheetMagicSeparator.setTextBounds(0, 0, 48, 8);

    charSheetMaxMagic = game.add.text(charSheetBaseX-143, charSheetBaseY+31, '', { font: "10px Arial",
                                fill: "#ffffff",
                                boundsAlignH: "right"});
    charSheetMaxMagic.setTextBounds(0, 0, 48, 8);

    charSheetCrowns = game.add.text(charSheetBaseX-296, charSheetBaseY+243, '', { font: "10px Arial",
                                fill: "#ffffff",
                                boundsAlignH: "right"});
    charSheetCrowns.setTextBounds(0, 0, 38, 15);

    charSheetShillings = game.add.text(charSheetBaseX-296, charSheetBaseY+262, '', { font: "10px Arial",
                                fill: "#ffffff",
                                boundsAlignH: "right"});
    charSheetShillings.setTextBounds(0, 0, 38, 15);

    charSheetPence = game.add.text(charSheetBaseX-296, charSheetBaseY+281, '', { font: "10px Arial",
                                fill: "#ffffff",
                                boundsAlignH: "right"});
    charSheetPence.setTextBounds(0, 0, 38, 15);

    propertyButton = game.add.sprite((game.world.width/2)+2, game.world.height, 'propertyIcon');
    propertyButton.anchor.x = 0;
    propertyButton.anchor.y = 1;

    propertyButton.inputEnabled = true;
    propertyButton.events.onInputDown.add(propertyClick, this);    
    
    shopButton = game.add.sprite((game.world.width/2)+2, game.world.height-32, 'cartIcon');
    shopButton.anchor.x = 0;
    shopButton.anchor.y = 1;

    shopButton.inputEnabled = true;
    shopButton.events.onInputDown.add(shopClick, this);

    shopBuySellMenu = game.add.sprite((game.world.width/2)+330, game.world.height, 'shoppingBuySellMenu');
    shopBuySellMenu.anchor.x = 0;
    shopBuySellMenu.anchor.y = 1;

    shopBuySellMenu.visible = false;

    speakButton = game.add.sprite((game.world.width/2)+2, game.world.height-64, 'speakIcon');
    speakButton.anchor.x = 0;
    speakButton.anchor.y = 1;

    speakButton.inputEnabled = true;
    speakButton.events.onInputDown.add(popChatterPrep, this);

    alertButton = game.add.sprite((game.world.width/2)+2, game.world.height-96, 'alertIcon');
    alertButton.frame = 0;
    alertButton.anchor.x = 0;
    alertButton.anchor.y = 1;

    messagesButton = game.add.sprite((game.world.width/2)+2, game.world.height-128, 'messagesIcon');
    messagesButton.anchor.x = 0;
    messagesButton.anchor.y = 1;
    
    messagesButton.inputEnabled = true;
    messagesButton.events.onInputDown.add(messagesClick, this);    

    settingsButton = game.add.sprite((game.world.width/2)+2, game.world.height-160, 'settingsIcon');
    settingsButton.anchor.x = 0;
    settingsButton.anchor.y = 1;

    characterButton = game.add.sprite((game.world.width/2)+2, game.world.height-192, 'charIcon');
    characterButton.anchor.x = 0;
    characterButton.anchor.y = 1;

    characterButton.inputEnabled = true;
    characterButton.events.onInputDown.add(characterClick, this);

    //characterSheetMenu = game.add.sprite((game.world.width/2)+36, game.world.height, 'characterSheetMenu');
    //characterSheetMenu.anchor.x = 0;
    //characterSheetMenu.anchor.y = 1;

    //characterSheetMenu.visible = false;

    localRoomText = game.add.text(localRoomsBaseX-3, localRoomsBaseY+207, '', { font: "12px Arial",
                                fill: "#ffffff",
                                boundsAlignH: "center", align: "center"});

    localRoomText.setTextBounds(0, 0, 218, 36);

    socket.emit('player started', { id: clientID , name: loginNameText.text})

}


function menusHide(){

    if(managePropertyPop != undefined){
        dePopProperty();
    }
    
    if(poppedImage != undefined){
        poppedImage.destroy();        
    }

    
    if(shopPop != undefined){
        dePopShop();
    }

    if(shopBuySellMenuPop != undefined){
        dePopShopBuySell();
    }

    if(characterSheetPop != undefined){
        //characterSheetMenu.visible = false;
        dePopCharacterSheet();
    }

    if(chatterPop != undefined){
        dePopChatter();
    }

    if(dialogPop != undefined){
        dePopDialog();
    }

    if(combatPop != undefined){
        dePopCombat();
    }

    if(inventorySelectPop != undefined){
        dePopInventorySelect();
    }
    
    if(messagesPop != undefined){
        dePopMessagesMenu();
    }

}

var setEventHandlers = function () {
  // Socket connection successful
  socket.on('connect', onSocketConnected);

  // Socket connection successful
  socket.on('pong', onPong);

  // Player login message received
  socket.on('player login', onPlayerLogin);

  // Socket disconnection
  socket.on('disconnect', onSocketDisconnect);

  // New player message received
  socket.on('new player', onNewPlayer);

  // New player needs new character received
  socket.on('create new character', onCreateCharacter);

  // New character skill list
  socket.on('new character skill list', popChooseSkills);

  // Player's new character created successfully
  socket.on('character created', onCharacterCreated);


  // Player Character Fetched, Start Mudding
  socket.on('start mud', startMud);

  // Player move message received
  socket.on('move player', onMovePlayer);

  // Player removed message received
  //socket.on('remove player', onRemovePlayer);

  // Player character sheet load
  socket.on('player character sheet', onPlayerCharacterSheet);

  // Player look message received
  socket.on('player look', onPlayerLook);

  // Player update inventory message received
  socket.on('player update inventory', onPlayerUpdateInventory);

  // Player inventory select message received
  socket.on('player inventory select', onInventorySelect);

  // Player display message received
  socket.on('message', onMessage);

  // Player display image received
  socket.on('pop image', onPopImage);

  // Player display message received
  socket.on('create login response', onCreateResponse);

  // Shop Inventory Showing received
  socket.on('shop inventory', onShopInventory);

  // Player Begin Chatter received
  socket.on('player chat', popChatter);
    
  // Player Viewing Mail Response
  socket.on('player view messages response', onViewMessagesResponse);
    
  // Player Successfully Sent Message
  socket.on('player sent message', onSentMessage);
    
  // Player Successfully Deleted Message
  socket.on('player deleted message', onDeletedMessage);    

  // Chatter Subjects Received
  socket.on('player chat subjects', onPlayerChatSubjects);

  // Chatter Response to Question Received
  socket.on('player chat response', onPlayerChatResponse);

  // PREPARE PLAYER FOR COMBAT
  socket.on('prep combat', popCombatPrep);

  // UPDATE COMBAT
  socket.on('update combat', onCombatUpdate);

  // UPDATE COMBAT START TIMER
  socket.on('update combat starttimer', updateStartTimer);

  // SHOW COMBAT HITS
  socket.on('display combat hit', onCombatHit);

  // END COMBAT
  socket.on('end combat', onCombatEnd);

  // POP DIALOG
  socket.on('pop dialog', onPopDialog);
    
  // POP PROPERTY MANAGE MENU
  socket.on('player manage property response', onPropertyManage);    
    
  // POP PROPERTY EDIT MENU
  socket.on('player edit property data', onPropertyEditData);      
    
  // POP ADD EMPLOYEE MENU
  socket.on('player employees available', onEmployeeAdd);    
}

// Socket connected
function onSocketConnected () {
  console.log('Connected to socket server')
  clientID = socket.io.engine.id;
    // Send local player data to the game server
}

function onPong () {
  console.log('Pong!');

}

// Socket disconnected
function onSocketDisconnect () {
  console.log('Disconnected from socket server')
}

// New player
function onNewPlayer (data) {
  console.log('New player connected:', data.id)

  // Add new player to the remote players array
  //enemies.push(new RemotePlayer(data.id, game, player, room))
}

// Create New Character
function onCreateCharacter (data) {
    console.log('Creating New Character...')
    popNewCharacter();
}

//THE USER CREATED A CHARACTER AND I SWEAR TO GOD THIS IS GIVING ME AN ANEURYSM
function onCharacterCreated (){
    dePopNewCharacter();
    socket.emit('new player', {id: clientID, name: loginNameText.text });
}

// Move player
function onMovePlayer (data) {
    //var newX = localRoomsBaseX - (data.mapx/2)+34-(10*(Math.floor((data.mapx-114)/20)));
    //var newY = localRoomsBaseY - (data.mapy/2)+34-(10*(Math.floor((data.mapy-114)/20)));

    var newX = localRoomsBaseX - data.mapx + 91;
    var newY = localRoomsBaseY - data.mapy + 91;

    var mapImage = data.mapImage;
    if(mapImage != localRooms.key){

        localRooms.loadTexture(mapImage);
        if(data.transitionx != undefined){

            localRooms.position.x = localRoomsBaseX - data.transitionx + 91;
        }
        if(data.transitiony != undefined){
            localRooms.position.y = localRoomsBaseY - data.transitiony + 91;
        }        
    }

    if(data.speed == "instant"){
        localRooms.position.x = newX;
        localRooms.position.y = newY;
    } else {
        game.add.tween(localRooms).to( { x: newX, y: newY }, 750, "Linear", true);
    }

    var roomNameText;

    //console.log('Moving into room ' + data.roomName)
    if(data.roomName.indexOf(',') != -1){
        roomNameText = data.roomName.substr(0, data.roomName.indexOf(",")+1) + '\n' + data.roomName.substr(data.roomName.indexOf(",")+2, data.roomName.length);
    } else {
        roomNameText = data.roomName;
    }

    localRoomText.text = roomNameText;

    menusHide();

    if(!data.shop){
        shopButton.input.enabled = false;
        shopButton.loadTexture('cartIconDisabled');
    } else {
        shopButton.input.enabled = true;
        shopButton.loadTexture('cartIcon');
    }
    
    if(!data.property){
        propertyButton.input.enabled = false;
        propertyButton.frame = 0;
    } else {
        propertyButton.input.enabled = true;

        if(data.property == 'You'){
            propertyButton.frame = 2;
        } else {
            propertyButton.frame = 1;
        }
    }    

    socket.emit('player look', {id: clientID });

}


// Player Look
function onPlayerLook (data) {
    //showText(data.message);
    queueMessage(data);
}


// Find player by ID
/*function playerById (id) {
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].player.name === id) {
      return enemies[i]
    }
  }

  return false
}*/

function currencyExchange(value){
    //12 Pence to a Shilling, 5 Shillings to a Crown
    moneyArray = [];
    crowns = Math.floor(value/60);
    remainder = value - (crowns*60);
    shillings = Math.floor(remainder/12);
    remainder = remainder - (shillings*12);
    moneyArray[0] = crowns;
    moneyArray[1] = shillings;
    moneyArray[2] = remainder;
    return moneyArray;

}

function resetMouseCursor(){
    mouseCursor = 'normal';
    $('canvas').css('cursor', 'default');
}
