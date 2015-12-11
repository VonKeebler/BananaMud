var newCharacterPop, newCharacterRacePop, newCharacterSkillPop;

var charSheetOkButton, charSheetMakeCharacterButton, charSheetCancelButton;
var charSheetNameField, charSheetRaceField, charSheetGenderField, charSheetDescField;
var charSheetNameText, charSheetRaceText, charSheetGenderText, charSheetDescText, charSheetErrorText;

var charSheetRaceDescription;
var charSheetMaleButton, charSheetFemaleButton;
var charSheetRaceHumanButton, charSheetRaceWoodElfButton, charSheetRaceHouseElfButton, charSheetRaceHalflingButton, charSheetRaceOrcButton, charSheetRaceGnomeButton, charSheetRaceDwarfButton, charSheetRaceGillmanButton, charSheetRaceGolemButton, charSheetRaceLizardManButton;
var charSheetRaceOkButton, charSheetStrAddButton, charSheetStrSubButton, charSheetAgiAddButton, charSheetAgiSubButton, charSheetIntAddButton, charSheetIntSubButton;

var charSheetSelectCombatSkillsButton, charSheetSelectStealthSkillsButton, charSheetSelectMagicSpellsButton;
var charSheetSelectedSkillType;
var charSheetDisplaySkillIcons = [];
var charSheetDisplayChosenCombatSkills = [];
var charSheetDisplayChosenStealthSkills = [];
var charSheetDisplayChosenMagicSpells = [];
var charSheetDisplayChosenSkillIcons = [];
var skillBuffer = [];
var powerBuffer;
var charSheetDisplaySkillName, charSheetDisplaySkillResourceCost, charSheetDisplaySkillDescription, charSheetDisplaySkillPowerCost, charSheetDisplaySkillPowerRemaining;

var charSheetDisplaySkillPowerSpent;

var selectedPossibleSkill, selectedCharacterSkill;

var charSheetSelectSkillsAddButton, charSheetSelectSkillsRemoveButton, charSheetSelectSkillsOkButton, charSheetSelectSkillsCancelButton;

var charSheetStatPointsText;

var charSheetStrPointsText, charSheetAgiPointsText, charSheetIntPointsText;

var charSheetHPText, charSheetEPText, charSheetMPText;
var charSheetDefenceText, charSheetAttackText;

var charSheetMeleePowerText, charSheetSpeedText, charSheetSpellPowerText;
var charSheetHitText, charSheetStealthText, charSheetCritText;

function popNewCharacter(){

    graphics = game.add.graphics(0, 0);

    newCharacterPop = game.add.sprite((this.game.world.width/2), (this.game.world.height/2), 'newCharacterMenu');
    newCharacterPop.anchor.x = 0.5;
    newCharacterPop.anchor.y = 0.5;

    charSheetNameText = game.add.text((this.game.world.width/2)-294, (this.game.world.height/2)-269, '', { font: "24px Indie Flower", fill: "#000000" });

    charSheetNameField = game.add.sprite((this.game.world.width/2)-298, (this.game.world.height/2)-271, 'newCharacterMenuNameField');
    charSheetNameField.inputEnabled = true;
    charSheetNameField.events.onInputDown.add(charsheetFieldFocus, { field: "name" });

    charSheetRaceText = game.add.text((this.game.world.width/2)-39, (this.game.world.height/2)-269, '', { font: "24px Indie Flower", fill: "#000000" });

    charSheetRaceField = game.add.sprite((this.game.world.width/2)-43, (this.game.world.height/2)-271, 'newCharacterMenuRaceField');
    charSheetRaceField.inputEnabled = true;
    charSheetRaceField.events.onInputDown.add(charsheetFieldFocus, { field: "race" });

    charSheetGenderText = game.add.text((this.game.world.width/2)+238, (this.game.world.height/2)-269, '', { font: "24px Indie Flower", fill: "#000000" });

    charSheetGenderField = game.add.sprite((this.game.world.width/2)+235, (this.game.world.height/2)-271, 'newCharacterMenuGenderField');
    charSheetGenderField.inputEnabled = true;
    charSheetGenderField.events.onInputDown.add(charsheetFieldFocus, { field: "gender" });

    charSheetDescText = game.add.text((this.game.world.width/2)-366, (this.game.world.height/2)-199, '', { font: "24px Indie Flower", fill: "#000000" });

    charSheetDescField = game.add.sprite((this.game.world.width/2)-370, (this.game.world.height/2)-201, 'newCharacterMenuDescField');
    charSheetDescField.inputEnabled = true;
    charSheetDescField.events.onInputDown.add(charsheetFieldFocus, { field: "desc" });

    charSheetHPText = game.add.text((this.game.world.width/2)-193, (this.game.world.height/2)-128, '', { font: "24px Indie Flower", fill: "#000000", boundsAlignH: "center"});
    charSheetHPText.setTextBounds(0, 0, 78, 29);

    charSheetEPText = game.add.text((this.game.world.width/2)+59, (this.game.world.height/2)-128, '', { font: "24px Indie Flower", fill: "#000000", boundsAlignH: "center"});
    charSheetEPText.setTextBounds(0, 0, 78, 29);

    charSheetMPText = game.add.text((this.game.world.width/2)+311, (this.game.world.height/2)-128, '', { font: "24px Indie Flower", fill: "#000000", boundsAlignH: "center"});
    charSheetMPText.setTextBounds(0, 0, 78, 29);


    charSheetDefenceText = game.add.text((this.game.world.width/2)-193, (this.game.world.height/2)-90, '', { font: "24px Indie Flower", fill: "#000000", boundsAlignH: "center"});
    charSheetDefenceText.setTextBounds(0, 0, 78, 29);

    charSheetAttackText = game.add.text((this.game.world.width/2)+59, (this.game.world.height/2)-90, '', { font: "24px Indie Flower", fill: "#000000", boundsAlignH: "center"});
    charSheetAttackText.setTextBounds(0, 0, 78, 29);



    charSheetStatPointsText = game.add.text((this.game.world.width/2)-41, (this.game.world.height/2)-21, '10', { font: "24px Indie Flower", fill: "#000000", boundsAlignH: "center"});
    charSheetStatPointsText.setTextBounds(0, 0, 78, 29);

    charSheetStrPointsText = game.add.text((this.game.world.width/2)-255, (this.game.world.height/2)+13, '1', { font: "24px Indie Flower", fill: "#000000", boundsAlignH: "center" });
    charSheetStrPointsText.setTextBounds(0, 0, 78, 29);

    charSheetAgiPointsText = game.add.text((this.game.world.width/2)-3, (this.game.world.height/2)+13, '1', { font: "24px Indie Flower", fill: "#000000", boundsAlignH: "center" });
    charSheetAgiPointsText.setTextBounds(0, 0, 78, 29);

    charSheetIntPointsText = game.add.text((this.game.world.width/2)+249, (this.game.world.height/2)+13, '1', { font: "24px Indie Flower", fill: "#000000", boundsAlignH: "center" });
    charSheetIntPointsText.setTextBounds(0, 0, 78, 29);

    charSheetStrAddButton = game.add.button(newCharacterPop.position.x-202, newCharacterPop.position.y+10, 'newCharacterMenuAddButton', charsheetAddOnClick, { stat: "strength" });

    charSheetStrSubButton = game.add.button(newCharacterPop.position.x-166, newCharacterPop.position.y+10, 'newCharacterMenuSubButton', charsheetSubOnClick, { stat: "strength" });

    charSheetAgiAddButton = game.add.button(newCharacterPop.position.x+50, newCharacterPop.position.y+10, 'newCharacterMenuAddButton', charsheetAddOnClick, { stat: "agility" });

    charSheetAgiSubButton = game.add.button(newCharacterPop.position.x+86, newCharacterPop.position.y+10, 'newCharacterMenuSubButton', charsheetSubOnClick, { stat: "agility" });

    charSheetIntAddButton = game.add.button(newCharacterPop.position.x+302, newCharacterPop.position.y+10, 'newCharacterMenuAddButton', charsheetAddOnClick, { stat: "intellect" });

    charSheetIntSubButton = game.add.button(newCharacterPop.position.x+338, newCharacterPop.position.y+10, 'newCharacterMenuSubButton', charsheetSubOnClick, { stat: "intellect" });



    charSheetMeleePowerText = game.add.text((this.game.world.width/2)-193, (this.game.world.height/2)+52, '', { font: "24px Indie Flower", fill: "#000000", boundsAlignH: "center"});
    charSheetMeleePowerText.setTextBounds(0, 0, 78, 29);

    charSheetSpeedText = game.add.text((this.game.world.width/2)+59, (this.game.world.height/2)+52, '', { font: "24px Indie Flower", fill: "#000000", boundsAlignH: "center"});
    charSheetSpeedText.setTextBounds(0, 0, 78, 29);

    charSheetSpellPowerText = game.add.text((this.game.world.width/2)+311, (this.game.world.height/2)+52, '', { font: "24px Indie Flower", fill: "#000000", boundsAlignH: "center"});
    charSheetSpellPowerText.setTextBounds(0, 0, 78, 29);


    charSheetHitText = game.add.text((this.game.world.width/2)-185, (this.game.world.height/2)+130, '', { font: "24px Indie Flower", fill: "#000000", boundsAlignH: "center"});
    charSheetHitText.setTextBounds(0, 0, 78, 29);

    charSheetStealthText = game.add.text((this.game.world.width/2)+63, (this.game.world.height/2)+130, '', { font: "24px Indie Flower", fill: "#000000", boundsAlignH: "center"});
    charSheetStealthText.setTextBounds(0, 0, 78, 29);

    charSheetCritText = game.add.text((this.game.world.width/2)+311, (this.game.world.height/2)+130, '', { font: "24px Indie Flower", fill: "#000000", boundsAlignH: "center"});
    charSheetCritText.setTextBounds(0, 0, 78, 29);

    // SELECT COMBAT/STEALTH/MAGIC SPELLS BUTTONS
    charSheetSelectCombatSkillsButton = game.add.button(newCharacterPop.position.x-370, newCharacterPop.position.y+166, 'newCharacterMenuSelectCombatSkillsButton', charsheetCombatSkillsOnClick, this);

    charSheetSelectStealthSkillsButton = game.add.button(newCharacterPop.position.x-122, newCharacterPop.position.y+166, 'newCharacterMenuSelectStealthSkillsButton', charsheetStealthSkillsOnClick, this);

    charSheetSelectMagicSpellsButton = game.add.button(newCharacterPop.position.x+126, newCharacterPop.position.y+166, 'newCharacterMenuSelectMagicSpellsButton', charsheetMagicSpellsOnClick, this);

    charSheetOkButton = game.add.button(newCharacterPop.position.x-365, newCharacterPop.position.y+231, 'newCharacterMenuOk', charsheetOkOnClick, this);

    charSheetMakeCharacterButton = game.add.button(newCharacterPop.position.x-275, newCharacterPop.position.y+231, 'newCharacterMenuMakeCharacter', charsheetMakeCharacterOnClick, this);

    charSheetCancelButton = game.add.button(newCharacterPop.position.x+268, newCharacterPop.position.y+231, 'newCharacterMenuCancel', charsheetCancelOnClick, this);

    charSheetErrorText = game.add.text(newCharacterPop.position.x-275, newCharacterPop.position.y+200, '', { font: "24px Indie Flower", fill: "#FF0000", boundsAlignH: "center" });
    charSheetErrorText.setTextBounds(0, 0, 524, 60);

    game.world.bringToTop(charSheetNameField);
    game.world.bringToTop(charSheetRaceField);
    game.world.bringToTop(charSheetGenderField);
    game.world.bringToTop(charSheetDescField);

    game.world.bringToTop(charSheetNameText);
    game.world.bringToTop(charSheetRaceText);
    game.world.bringToTop(charSheetGenderText);
    game.world.bringToTop(charSheetDescText);

    newCharacterCrunchNumbers();

}

function charsheetFieldFocus(data){
    if(this.field == "name"){
        charSheetNameField.frame = 1;
        charSheetDescField.frame = 0;
        selectedTextBox = charSheetNameText;
    } else if(this.field == "race"){
        charSheetNameField.frame = 0;
        charSheetDescField.frame = 0;
        selectedTextBox = null;
        if(charSheetMaleButton){
            dePopGenderMenu();
        }
        popRaceMenu();
    } else if(this.field == "gender"){
        charSheetNameField.frame = 0;
        charSheetDescField.frame = 0;
        selectedTextBox = null;
        if(newCharacterRacePop){
            dePopRaceMenu();
        }
        popGenderMenu();
    } else if(this.field == "desc"){
        charSheetNameField.frame = 0;
        charSheetDescField.frame = 1;
        selectedTextBox = charSheetDescText;
    }

}

function newCharacterCrunchNumbers(){
    var level = 1;
    charSheetHPText.text = (Math.trunc(parseInt(charSheetStrPointsText.text)*3)+Math.ceil(0.5*level));
    charSheetEPText.text = Math.trunc(parseInt(charSheetAgiPointsText.text)+Math.ceil(0.5*level));
    charSheetMPText.text = Math.trunc(parseInt(charSheetIntPointsText.text)+Math.ceil(0.5*level));

    charSheetDefenceText.text = Math.trunc((parseInt(charSheetAgiPointsText.text)/2)+Math.ceil(0.5*level));
    charSheetAttackText.text = Math.trunc((parseInt(charSheetStrPointsText.text)/2)+Math.ceil(0.5*level));

    charSheetMeleePowerText.text = Math.trunc((parseInt(charSheetStrPointsText.text)/2));
    charSheetSpeedText.text = Math.trunc(parseInt(charSheetAgiPointsText.text)*5);
    charSheetSpellPowerText.text = Math.trunc((parseInt(charSheetIntPointsText.text)/2));

    charSheetHitText.text = Math.trunc((parseInt(charSheetStrPointsText.text)+(parseInt(charSheetAgiPointsText.text)))+Math.ceil(0.5*level));
    charSheetStealthText.text = Math.trunc((parseInt(charSheetAgiPointsText.text)+(parseInt(charSheetIntPointsText.text)))/3);
    charSheetCritText.text = Math.trunc((parseInt(charSheetIntPointsText.text)+(parseInt(charSheetStrPointsText.text)))+Math.ceil(0.5*level));
}

function popGenderMenu(){
    charSheetMaleButton = game.add.button(newCharacterPop.position.x+235, newCharacterPop.position.y-238, 'newCharacterMenuMaleButton', charsheetGenderOnClick, { gender: "male" });
    charSheetFemaleButton = game.add.button(newCharacterPop.position.x+235, newCharacterPop.position.y-206, 'newCharacterMenuFemaleButton', charsheetGenderOnClick, { gender: "female" });
}

function charsheetGenderOnClick(data){
    if(this.gender == "male"){
        charSheetGenderText.text = "Male";
    }
    if(this.gender == "female"){
        charSheetGenderText.text = "Female";
    }
    dePopGenderMenu();
}

function dePopGenderMenu(){
    charSheetMaleButton.destroy();
    charSheetFemaleButton.destroy();
}

function popRaceMenu(){
    newCharacterRacePop = game.add.sprite((this.game.world.width/2), (this.game.world.height/2), 'newCharacterRaceMenu');
    newCharacterRacePop.anchor.x = 0.5;
    newCharacterRacePop.anchor.y = 0.5;

    charSheetRaceDescription = game.add.sprite((this.game.world.width/2)-132, (this.game.world.height/2)-171, 'newCharacterRaceMenuDescription');

    charSheetRaceHumanButton = game.add.button(newCharacterRacePop.position.x-270, newCharacterRacePop.position.y-165, 'newCharacterRaceMenuHumanButton', charsheetChoiceButtonOnClick, { race: "human" }, 0, 0, 1);

    charSheetRaceWoodElfButton = game.add.button(newCharacterRacePop.position.x-270, newCharacterRacePop.position.y-133, 'newCharacterRaceMenuWoodElfButton', charsheetChoiceButtonOnClick, { race: "wood elf" }, 0, 0, 1);

    charSheetRaceHouseElfButton = game.add.button(newCharacterRacePop.position.x-270, newCharacterRacePop.position.y-101, 'newCharacterRaceMenuHouseElfButton', charsheetChoiceButtonOnClick, { race: "house elf" }, 0, 0, 1);

    charSheetRaceHalflingButton = game.add.button(newCharacterRacePop.position.x-270, newCharacterRacePop.position.y-69, 'newCharacterRaceMenuHalflingButton', charsheetChoiceButtonOnClick, { race: "halfling" }, 0, 0, 1);

    charSheetRaceOrcButton = game.add.button(newCharacterRacePop.position.x-270, newCharacterRacePop.position.y-37, 'newCharacterRaceMenuOrcButton', charsheetChoiceButtonOnClick, { race: "orc" }, 0, 0, 1);

    charSheetRaceGnomeButton = game.add.button(newCharacterRacePop.position.x-270, newCharacterRacePop.position.y-5, 'newCharacterRaceMenuGnomeButton', charsheetChoiceButtonOnClick, { race: "gnome" }, 0, 0, 1);

    charSheetRaceDwarfButton = game.add.button(newCharacterRacePop.position.x-270, newCharacterRacePop.position.y+27, 'newCharacterRaceMenuDwarfButton', charsheetChoiceButtonOnClick, { race: "dwarf" }, 0, 0, 1);

    charSheetRaceGillmanButton = game.add.button(newCharacterRacePop.position.x-270, newCharacterRacePop.position.y+59, 'newCharacterRaceMenuGillmanButton', charsheetChoiceButtonOnClick, { race: "gillman" }, 0, 0, 1);

    charSheetRaceGolemButton = game.add.button(newCharacterRacePop.position.x-270, newCharacterRacePop.position.y+91, 'newCharacterRaceMenuGolemButton', charsheetChoiceButtonOnClick, { race: "golem" }, 0, 0, 1);

    charSheetRaceLizardManButton = game.add.button(newCharacterRacePop.position.x-270, newCharacterRacePop.position.y+123, 'newCharacterRaceMenuLizardManButton', charsheetChoiceButtonOnClick, { race: "lizardman" }, 0, 0, 1);

    charSheetRaceOkButton = game.add.button(newCharacterRacePop.position.x+214, newCharacterRacePop.position.y+131, 'newCharacterMenuOk', charsheetRaceOkOnClick, this);
    game.world.bringToTop(charSheetRaceOkButton);
}

function charsheetChoiceButtonOnClick (data){
    if(this.race == "human"){
        charSheetRaceDescription.frame = 1;
        charSheetRaceText.text = "Human";
    }
    if(this.race == "wood elf"){
        charSheetRaceDescription.frame = 2;
        charSheetRaceText.text = "Wood Elf";
    }
    if(this.race == "house elf"){
        charSheetRaceDescription.frame = 3;
        charSheetRaceText.text = "House Elf";
    }
    if(this.race == "halfling"){
        charSheetRaceDescription.frame = 4;
        charSheetRaceText.text = "Halfling";
    }
    if(this.race == "orc"){
        charSheetRaceDescription.frame = 5;
        charSheetRaceText.text = "Orc";
    }
    if(this.race == "gnome"){
        charSheetRaceDescription.frame = 6;
        charSheetRaceText.text = "Gnome";
    }
    if(this.race == "dwarf"){
        charSheetRaceDescription.frame = 7;
        charSheetRaceText.text = "Dwarf";
    }
    if(this.race == "gillman"){
        charSheetRaceDescription.frame = 8;
        charSheetRaceText.text = "Gillman";
    }
    if(this.race == "golem"){
        charSheetRaceDescription.frame = 9;
        charSheetRaceText.text = "Golem";
    }
    if(this.race == "lizardman"){
        charSheetRaceDescription.frame = 10;
        charSheetRaceText.text = "Lizard Man";
    }

}

function charsheetAddOnClick (data) {
    if(charSheetStatPointsText.text == 0){
        charSheetErrorText.text = "You don't have any more points to attribute.";
        return;
    }
    if(this.stat == "strength"){
        charSheetStrPointsText.text = parseInt(charSheetStrPointsText.text) + 1;
    }
    if(this.stat == "agility"){
        charSheetAgiPointsText.text = parseInt(charSheetAgiPointsText.text) + 1;
    }
    if(this.stat == "intellect"){
        charSheetIntPointsText.text = parseInt(charSheetIntPointsText.text) + 1;
    }
    charSheetStatPointsText.text = parseInt(charSheetStatPointsText.text) - 1;
    newCharacterCrunchNumbers();

}

function charsheetSubOnClick (data) {
    if(this.stat == "strength"){
        if(charSheetStrPointsText.text == 1){
            charSheetErrorText.text = "You can't have less than 1 in Strength.";
            return;
        }
        charSheetStrPointsText.text = parseInt(charSheetStrPointsText.text) - 1;
    }
    if(this.stat == "agility"){
        if(charSheetAgiPointsText.text == 1){
            charSheetErrorText.text = "You can't have less than 1 in Agility.";
            return;
        }
        charSheetAgiPointsText.text = parseInt(charSheetAgiPointsText.text) - 1;
    }
    if(this.stat == "intellect"){
        if(charSheetIntPointsText.text == 1){
            charSheetErrorText.text = "You can't have less than 1 in Intellect.";
            return;
        }
        charSheetIntPointsText.text = parseInt(charSheetIntPointsText.text) - 1;
    }
    charSheetStatPointsText.text = parseInt(charSheetStatPointsText.text) + 1;
    newCharacterCrunchNumbers()

}

function charsheetRaceOkOnClick () {
    dePopRaceMenu();
}

function charsheetOkOnClick () {
    //socket.emit('player login', {id: this.id, name: loginNameText.text, pass: loginPassText.text});
    if(charSheetNameText.text.length == 0){
        charSheetErrorText.text = "ENTER A NAME";
        return;
    }
    if(charSheetRaceText.text.length == 0){
        charSheetErrorText.text = "PICK A RACE";
        return;
    }
    if(charSheetGenderText.text.length == 0){
        charSheetErrorText.text = "PICK A GENDER, NANCY";
        return;
    }
    if(charSheetDescText.text.length == 0){
        charSheetDescText.text = "A non descript "+charSheetRaceText.text+" just standing around here.";

    }
    
    var combatSkills = [];
    var stealthSkills = [];
    var magicSpells = [];
    
    for(var i=0; i<charSheetDisplayChosenCombatSkills.length; i++){
        combatSkills.push(charSheetDisplayChosenCombatSkills[i].skillID);
    }
    for(var i=0; i<charSheetDisplayChosenStealthSkills.length; i++){
        stealthSkills.push(charSheetDisplayChosenStealthSkills[i].skillID);
    }
    for(var i=0; i<charSheetDisplayChosenMagicSpells.length; i++){
        magicSpells.push(charSheetDisplayChosenMagicSpells[i].skillID);
    }     

    socket.emit('create new character', {id: clientID, playerName: loginNameText.text, name: charSheetNameText.text, gender: charSheetGenderText.text, race: charSheetRaceText.text, description: charSheetDescText.text, level: 1, health: charSheetHPText.text, maxhealth: charSheetHPText.text, energy: charSheetEPText.text, maxenergy: charSheetEPText.text, magic: charSheetMPText.text, maxmagic: charSheetMPText.text, strength: charSheetStrPointsText.text, agility: charSheetAgiPointsText.text, intellect: charSheetIntPointsText.text, meleepower: charSheetMeleePowerText.text, speed: charSheetSpeedText.text, spellpower: charSheetSpellPowerText.text, hitchance: charSheetHitText.text, stealth: charSheetStealthText.text, criticalchance: charSheetCritText.text, defence: charSheetDefenceText.text, attack: charSheetAttackText.text,  combatSkills: combatSkills, stealthSkills: stealthSkills, magicSpells: magicSpells, roomid: 'BBBINN', inventory: {itemCousinsLetter: 1  }, equipment: {           "Body": "armorElCheapoTunic", "Legs": "armorDungarees", "Feet": "armorSandals"  }, money: 100}); //Eventually passed to File Loader


}

function charsheetMakeCharacterOnClick () {
    //socket.emit('player login', {id: this.id, name: loginNameText.text, pass: loginPassText.text});
    if(charSheetNameText.text.length == 0){
        charSheetErrorText.text = "YOU NEED A NAME, ASSHOLE";
        return;
    }
    
    var combatSkills = [];
    var stealthSkills = [];
    var magicSpells = [];
    
    for(var i=0; i<charSheetDisplayChosenCombatSkills.length; i++){
        combatSkills.push(charSheetDisplayChosenCombatSkills[i].skillID);
    }
    for(var i=0; i<charSheetDisplayChosenStealthSkills.length; i++){
        stealthSkills.push(charSheetDisplayChosenStealthSkills[i].skillID);
    }
    for(var i=0; i<charSheetDisplayChosenMagicSpells.length; i++){
        magicSpells.push(charSheetDisplayChosenMagicSpells[i].skillID);
    }    


    socket.emit('create new character', {id: clientID, playerName: loginNameText.text, name: charSheetNameText.text, gender: 'male', race: 'human', description: 'TEST DESCRIPTION', level: 1, health: 10, maxhealth: 10, energy: 5, maxenergy: 5, magic: 2, maxmagic: 2, strength: 1, agility: 2, intellect: 3, meleepower: 4, speed: 5, spellpower: 6, hitchance: 7, stealth: 8, criticalchance: 9, defence: 10, attack: 11, combatSkills: combatSkills, stealthSkills: stealthSkills, magicSpells: magicSpells, roomid: 'BBBINN', inventory: { itemCousinsLetter: 1  }, equipment: {           "Body": "armorElCheapoTunic", "Legs": "armorDungarees", "Feet": "armorSandals"  }, money: 100}); //Eventually passed to File Loader

}

function charsheetCancelOnClick () {
    //socket.emit('player login', {id: this.id, name: loginNameText.text, pass: loginPassText.text});
    dePopNewCharacter();
    popLogin();

}


//*****************************************************************************************************************************
//** PLAYER CHOOSES SKILLS
//*****************************************************************************************************************************

function charsheetCombatSkillsOnClick () {
    if(newCharacterSkillPop == undefined || newCharacterSkillPop.visible == false){
      if(charSheetMaleButton != undefined){
          dePopGenderMenu();
      }
      socket.emit('new character skill list', {id: clientID, skills: "combat"});
    }
}

function charsheetStealthSkillsOnClick () {
    if(newCharacterSkillPop == undefined || newCharacterSkillPop.visible == false){
      if(charSheetMaleButton != undefined){
          dePopGenderMenu();
      }
      socket.emit('new character skill list', {id: clientID, skills: "stealth"});
    }
}

function charsheetMagicSpellsOnClick () {
    if(newCharacterSkillPop == undefined || newCharacterSkillPop.visible == false){
      if(charSheetMaleButton != undefined){
          dePopGenderMenu();
      }
      socket.emit('new character skill list', {id: clientID, skills: "magic"});
    }
}


function popChooseSkills (data){
    
  charSheetDisplaySkillPowerSpent = 0;

  charSheetDisplaySkillIcons = [];

  charSheetSelectedSkillType = data.skills;
    
  if(charSheetSelectedSkillType == "combat"){

      menuType = 'newCharacterMenuSelectCombatSkillsMenu';
      skillBuffer = charSheetDisplayChosenCombatSkills.slice(0);
      powerBuffer = charSheetMeleePowerText.text;
  }
  if(charSheetSelectedSkillType == "stealth"){

      menuType = 'newCharacterMenuSelectStealthSkillsMenu';
      skillBuffer = charSheetDisplayChosenStealthSkills.slice(0);
      powerBuffer = charSheetStealthText.text;
  }
  if(charSheetSelectedSkillType == "magic"){

      menuType = 'newCharacterMenuSelectMagicSpellsMenu';
      skillBuffer = charSheetDisplayChosenMagicSpells.slice(0);
      powerBuffer = charSheetSpellPowerText.text;
  }

  newCharacterSkillPop = game.add.sprite((game.world.width/2), (game.world.height/2), menuType);
  newCharacterSkillPop.anchor.x = 0.5;
  newCharacterSkillPop.anchor.y = 0.5;

  charSheetDisplaySkillName = newCharacterSkillPop.addChild( game.add.text(14-(newCharacterSkillPop.width/2), 122-(newCharacterSkillPop.height/2), '', { font: "14px Arial", fill: "#ffffff"}) );

  charSheetDisplaySkillResourceCost = newCharacterSkillPop.addChild( game.add.text(299-(newCharacterSkillPop.width/2), 122-(newCharacterSkillPop.height/2), '', { font: "14px Arial", fill: "#ffffff"}) );

  charSheetDisplaySkillDescription = newCharacterSkillPop.addChild( game.add.text(14-(newCharacterSkillPop.width/2), 156-(newCharacterSkillPop.height/2), '', { font: "14px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: 374}) );

  charSheetDisplaySkillPowerCost = newCharacterSkillPop.addChild( game.add.text(222-(newCharacterSkillPop.width/2), 248-(newCharacterSkillPop.height/2), '', { font: "10px Arial", fill: "#ffffff"}) );
  charSheetDisplaySkillPowerRemaining = newCharacterSkillPop.addChild( game.add.text(222-(newCharacterSkillPop.width/2), 260-(newCharacterSkillPop.height/2), '', { font: "10px Arial", fill: "#ffffff"}) );

  for(var i = 0; i<data.skillList.length; i++){
      charSheetDisplaySkillIcons.push ( game.add.button(newCharacterSkillPop.position.x-188 + ((42 * i)), newCharacterSkillPop.position.y-160, 'skillImages', skillPopClickSkill, {name: data.skillList[i].name, resourceCost: data.skillList[i].resourceCost, description: data.skillList[i].description, powerCost: data.skillList[i].powerCost, imageIndex: data.skillList[i].imageIndex, skillID: data.skillList[i].skillID}) );
      charSheetDisplaySkillIcons[charSheetDisplaySkillIcons.length-1].frame = data.skillList[i].imageIndex;


  }

  charSheetSelectSkillsAddButton = newCharacterSkillPop.addChild( game.add.button( 10-(newCharacterSkillPop.width/2), 249-(newCharacterSkillPop.height/2), 'skillAddButton', skillPopAddOnClick, this) );
  charSheetSelectSkillsRemoveButton = newCharacterSkillPop.addChild( game.add.button( 270-(newCharacterSkillPop.width/2), 249-(newCharacterSkillPop.height/2), 'skillRemoveButton', skillPopRemoveOnClick, this) );

  charSheetSelectSkillsOkButton = game.add.button(newCharacterSkillPop.position.x-190, newCharacterSkillPop.position.y+154, 'okButton', skillPopOkOnClick, this);
  charSheetSelectSkillsCancelButton = game.add.button(newCharacterSkillPop.position.x+76, newCharacterSkillPop.position.y+154, 'cancelButton', skillPopCancelOnClick, this);

  refreshSkillPop();

}

function skillPopClickSkill (data) {
  charSheetDisplaySkillName.text = this.name;
  charSheetDisplaySkillResourceCost.text = this.resourceCost;
  charSheetDisplaySkillDescription.text = this.description;
  charSheetDisplaySkillPowerCost.text = this.powerCost;

  selectedPossibleSkill = this;

}

function skillPopClickChosenSkill (data) {
  charSheetDisplaySkillName.text = this.name;
  charSheetDisplaySkillResourceCost.text = this.resourceCost;
  charSheetDisplaySkillDescription.text = this.description;
  charSheetDisplaySkillPowerCost.text = this.powerCost;

  selectedCharacterSkill = this;

}

function refreshSkillPop (){

  var powerRemaining;

  for(var i=0; i<charSheetDisplayChosenSkillIcons.length; i++){
    charSheetDisplayChosenSkillIcons[i].destroy();
  }

  charSheetDisplayChosenSkillIcons = [];

  charSheetDisplaySkillPowerSpent = 0;

 
  for(var i=0; i < skillBuffer.length; i++){
    charSheetDisplaySkillPowerSpent += skillBuffer[i].powerCost;
  }      

  powerRemaining = parseInt(powerBuffer) - charSheetDisplaySkillPowerSpent;
    
    if(powerRemaining < 0){
      alert('Your power remaining is too low. Resetting Skill Choices');
      skillBuffer = [];
      powerRemaining = parseInt(powerBuffer);
    }

    for(var i = 0; i<skillBuffer.length; i++){
        charSheetDisplaySkillPowerSpent += skillBuffer[i].powerCost;

        charSheetDisplayChosenSkillIcons.push ( newCharacterSkillPop.addChild( game.add.button( 12-(newCharacterSkillPop.width/2) + ((42 * i)), 295-(newCharacterSkillPop.height/2), 'skillImages', skillPopClickChosenSkill, {name: skillBuffer[i].name, resourceCost: skillBuffer[i].resourceCost, description: skillBuffer[i].description, powerCost: skillBuffer[i].powerCost, imageIndex: skillBuffer[i].imageIndex, skillID: skillBuffer[i].skillID}) ) );

        charSheetDisplayChosenSkillIcons[charSheetDisplayChosenSkillIcons.length-1].frame = skillBuffer[i].imageIndex;

      }      
      
  charSheetDisplaySkillPowerRemaining.text = powerRemaining;

}

function skillPopAddOnClick () {
  if(selectedPossibleSkill == undefined){

  } else if(selectedPossibleSkill.powerCost > charSheetDisplaySkillPowerRemaining.text){
    alert('This skill costs '+selectedPossibleSkill.powerCost+ ' but you only have '+charSheetDisplaySkillPowerRemaining.text+' power remaining.')
  } else {
    var skillExists = 0;
      
    for(var i = 0; i<skillBuffer.length; i++){

        if(selectedPossibleSkill.skillID == skillBuffer[i].skillID){
          skillExists = 1;
          alert('You have already chosen this skill.')
          break;
        }

    }
    if(skillExists == 0){
      skillBuffer.push( selectedPossibleSkill )
      charSheetDisplaySkillPowerSpent += selectedPossibleSkill.powerCost;
      refreshSkillPop();
    }
        
      
  }

}

function skillPopRemoveOnClick () {
  if(selectedCharacterSkill == undefined){

  } else {

    for(var i=0; i<skillBuffer.length; i++){
      if(skillBuffer[i].skillID == selectedCharacterSkill.skillID){
        skillBuffer.splice(i, 1 )
        break;
      }
    }
        
    //charSheetDisplayChosenSkills.splice(charSheetDisplayChosenSkills.indexOf(selectedCharacterSkill), 1 )
    charSheetDisplaySkillPowerSpent -= selectedCharacterSkill.powerCost;
    selectedCharacterSkill = undefined;
    refreshSkillPop();
  }
}

function skillPopOkOnClick () {
  if(menuType == 'newCharacterMenuSelectCombatSkillsMenu'){

      charSheetDisplayChosenCombatSkills = skillBuffer.slice(0);
  }
  if(menuType == 'newCharacterMenuSelectStealthSkillsMenu'){

      charSheetDisplayChosenStealthSkills = skillBuffer.slice(0);
  }
  if(menuType == 'newCharacterMenuSelectMagicSpellsMenu'){

      charSheetDisplayChosenMagicSpells = skillBuffer.slice(0);
  }
    skillBuffer = undefined;
    dePopSkillsMenu();

}

function skillPopCancelOnClick () {
    dePopSkillsMenu();
}


//*****************************************************************************************************************************

function dePopRaceMenu () {

    newCharacterRacePop.destroy();

    charSheetRaceHumanButton.destroy();
    charSheetRaceWoodElfButton.destroy();
    charSheetRaceHouseElfButton.destroy();
    charSheetRaceHalflingButton.destroy();
    charSheetRaceOrcButton.destroy();
    charSheetRaceGnomeButton.destroy();
    charSheetRaceDwarfButton.destroy();
    charSheetRaceGillmanButton.destroy();
    charSheetRaceGolemButton.destroy();
    charSheetRaceLizardManButton.destroy();

    charSheetRaceDescription.destroy();
    charSheetRaceOkButton.destroy();

}


function dePopSkillsMenu () {

    newCharacterSkillPop.destroy();

    charSheetDisplaySkillName.destroy();
    charSheetDisplaySkillDescription.destroy();

    charSheetSelectSkillsAddButton.destroy();
    charSheetSelectSkillsRemoveButton.destroy();

    charSheetSelectSkillsOkButton.destroy();
    charSheetSelectSkillsCancelButton.destroy();

    for(var i=0; i<charSheetDisplaySkillIcons.length; i++){
        charSheetDisplaySkillIcons[i].destroy();
    }

}

function dePopNewCharacter () {
    graphics.destroy();

    if(newCharacterRacePop != undefined){
        dePopRaceMenu();
    }

    if(charSheetMaleButton != undefined){
        dePopGenderMenu();
    }

    newCharacterPop.destroy();
    charSheetOkButton.destroy();
    charSheetMakeCharacterButton.destroy();
    charSheetCancelButton.destroy();
    charSheetNameField.destroy();
    charSheetNameText.destroy();
    charSheetErrorText.destroy();
    charSheetRaceField.destroy();
    charSheetRaceText.destroy();
    charSheetGenderField.destroy();
    charSheetGenderText.destroy();
    charSheetDescField.destroy();
    charSheetDescText.destroy();

    charSheetSelectCombatSkillsButton.destroy();
    charSheetSelectStealthSkillsButton.destroy();
    charSheetSelectMagicSpellsButton.destroy();

    charSheetHPText.destroy();
    charSheetEPText.destroy();
    charSheetMPText.destroy();
    charSheetDefenceText.destroy();
    charSheetAttackText.destroy();

    charSheetStatPointsText.destroy();
    charSheetStrPointsText.destroy();
    charSheetAgiPointsText.destroy();
    charSheetIntPointsText.destroy();

    charSheetStrAddButton.destroy();
    charSheetStrSubButton.destroy();
    charSheetAgiAddButton.destroy();
    charSheetAgiSubButton.destroy();
    charSheetIntAddButton.destroy();
    charSheetIntSubButton.destroy();

    charSheetMeleePowerText.destroy();
    charSheetSpeedText.destroy();
    charSheetSpellPowerText.destroy();
    charSheetHitText.destroy();
    charSheetStealthText.destroy();
    charSheetCritText.destroy();
}
