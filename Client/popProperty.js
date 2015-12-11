var managePropertyPop, manageEmployeePop, addEmployeePop, editPropertyPop;

var managePropertyName, managePropertyType;

var manageEmployeeName, manageEmployeeGender, manageEmployeeRace;

var manageEmployeeWage = [];
var manageEmployeeWageText = [];

var manageEmployeeSkillIcon = [];
var manageEmployeeSkillName = [];
var manageEmployeeSkillRating = [];

var managePropertyIncome = [];
var managePropertyCost = [];
var managePropertyUpkeep = [];

var managePropertyIncomeText = [];
var managePropertyCostText = [];
var managePropertyUpkeepText = [];

var managePropertyAmenitiesButtons = [];
var managePropertyEmployeesButtons = [];

var addPropertyEmployeesButtons = [];

var addEmployeeName, addEmployeeGender, addEmployeeRace;

var addEmployeeCost = [];
var addEmployeeCostText = [];

var addEmployeeWage = [];
var addEmployeeWageText = [];

var addEmployeeSkillIcon = [];
var addEmployeeSkillName = [];
var addEmployeeSkillRating = [];

var managePropertyEditButton;

var editPropertyOkButton, editPropertyCancelButton;

var editPropertyNameText, editPropertyDescriptionText;

var editPropertyNameField, editPropertyDescField;

var managePropertyBuySellButton;

function propertyClick () {
    if(managePropertyPop == undefined || managePropertyPop.visible == false){
        menusHide();

        graphics = game.add.graphics(0, 0);
        
        managePropertyPop = game.add.sprite((game.world.width/2)+38, game.world.height-286, 'buyManagePropertyMenu');        
        managePropertyPop.anchor.x = 0;
        managePropertyPop.anchor.y = 0;

        socket.emit('player manage property', {id: clientID });     
        
    } else {
        menusHide();
    }

}

// Property Show Pop
function onPropertyManage(data) {
    
    managePropertyName = managePropertyPop.addChild( game.add.text(12, 42, data.propertyName, { font: "12px Arial", fill: "#ffffff"}));
    
    managePropertyType = managePropertyPop.addChild( game.add.text(12, 76, data.propertyType, { font: "12px Arial", fill: "#ffffff"}));
    
    for(var i=0; i<7; i++){
        
        if(Object.keys(data.propertyAmenities).length > i){
            var amenityType = Object.keys(data.propertyAmenities)[i];
            var amenityData = data.propertyAmenities[Object.keys(data.propertyAmenities)[i]];
            
            managePropertyAmenitiesButtons[i] = managePropertyPop.addChild( game.add.button(10 + (i * 42), 109, 'buyManagePropertyAmenitiesIcons', managePropertyAmenitiesClick, {amenityType: amenityType, amenityData: amenityData}) );   

            
            if(amenityType == 'food'){
                managePropertyAmenitiesButtons[i].frame = 1;
            } else if(amenityType == 'drink'){
                managePropertyAmenitiesButtons[i].frame = 2;
            } else if(amenityType == 'services'){
                managePropertyAmenitiesButtons[i].frame = 3;
            } else if(amenityType == 'inn'){
                managePropertyAmenitiesButtons[i].frame = 4;
            } else if(amenityType == 'housing'){
                managePropertyAmenitiesButtons[i].frame = 5;
            } else if(amenityType == 'weapons'){
                managePropertyAmenitiesButtons[i].frame = 6;
            } else if(amenityType == 'armor'){
                managePropertyAmenitiesButtons[i].frame = 7;
            } else if(amenityType == 'magic'){
                managePropertyAmenitiesButtons[i].frame = 8;
            } else if(amenityType == 'manufacturing'){
                managePropertyAmenitiesButtons[i].frame = 9;
            } else {
                managePropertyAmenitiesButtons[i].frame = 0;
            }
            
              
        } else if(Object.keys(data.propertyAmenities).length == i && data.propertyOwnerCheck == true){
            managePropertyAmenitiesButtons[i] = managePropertyPop.addChild( game.add.button(10 + (i * 42), 109, 'buyManagePropertyAmenitiesIcons', managePropertyAmenitiesClick, this) );   
            managePropertyAmenitiesButtons[i].frame = 10;    
            
            managePropertyEditButton = managePropertyPop.addChild( game.add.button(267, 27, 'buyManagePropertyMenuEditButton', managePropertyEditClick, this) );   
            
        } else {
            managePropertyAmenitiesButtons[i] = managePropertyPop.addChild( game.add.sprite(10 + (i * 42), 109, 'buyManagePropertyAmenitiesIcons') );   
            managePropertyAmenitiesButtons[i].frame = 0;    

        }
                
    }
    
    for(var i=0; i<7; i++){
        
        if(Object.keys(data.propertyEmployees).length > i){
            var employeeName = Object.keys(data.propertyEmployees)[i];
            var employeeData = data.propertyEmployees[Object.keys(data.propertyEmployees)[i]];
            var employeeGender = employeeData.gender;
            
            managePropertyEmployeesButtons[i] = managePropertyPop.addChild( game.add.button(10 + (i * 42), 165, 'buyManagePropertyEmployeesIcons', managePropertyEmployeesClick, {employeeName: employeeName, employeeData: employeeData}) );
            if(employeeGender == 'male'){
                managePropertyEmployeesButtons[i].frame = 1;
            } else if(employeeGender == 'female'){
                managePropertyEmployeesButtons[i].frame = 2;
            }
            
        } else if(Object.keys(data.propertyEmployees).length == i && data.propertyOwnerCheck == true){
            
            managePropertyEmployeesButtons[i] = managePropertyPop.addChild( game.add.button(10 + (i * 42), 165, 'buyManagePropertyEmployeesIcons', addPropertyEmployeesClick, this) );
            managePropertyEmployeesButtons[i].frame = 3;
            
        } else {
            managePropertyEmployeesButtons[i] = managePropertyPop.addChild( game.add.sprite(10 + (i * 42), 165, 'buyManagePropertyEmployeesIcons') );
            managePropertyEmployeesButtons[i].frame = 0;
        }
    }    
    
    managePropertyIncome = currencyExchange(data.propertyIncome);
    managePropertyCost = currencyExchange(data.propertyValue);
    managePropertyUpkeep = currencyExchange(data.propertyUpkeep);

    managePropertyIncomeText[0] = managePropertyPop.addChild( game.add.text(10, 225, managePropertyIncome[0], { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
    managePropertyIncomeText[0].setTextBounds(0, 0, 40, 18);         
    managePropertyIncomeText[1] = managePropertyPop.addChild( game.add.text(46, 225, managePropertyIncome[1], { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
    managePropertyIncomeText[1].setTextBounds(0, 0, 40, 18);     
    managePropertyIncomeText[2] = managePropertyPop.addChild( game.add.text(82, 225, managePropertyIncome[2], { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
    managePropertyIncomeText[2].setTextBounds(0, 0, 40, 18);         
    
    managePropertyUpkeepText[0] = managePropertyPop.addChild( game.add.text(130, 225, managePropertyUpkeep[0], { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
    managePropertyUpkeepText[0].setTextBounds(0, 0, 40, 18);         
    managePropertyUpkeepText[1] = managePropertyPop.addChild( game.add.text(166, 225, managePropertyUpkeep[1], { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
    managePropertyUpkeepText[1].setTextBounds(0, 0, 40, 18);     
    managePropertyUpkeepText[2] = managePropertyPop.addChild( game.add.text(202, 225, managePropertyUpkeep[2], { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
    managePropertyUpkeepText[2].setTextBounds(0, 0, 40, 18);     
    
    managePropertyCostText[0] = managePropertyPop.addChild( game.add.text(10, 259, managePropertyCost[0], { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
    managePropertyCostText[0].setTextBounds(0, 0, 40, 18);     
    managePropertyCostText[1] = managePropertyPop.addChild( game.add.text(46, 259, managePropertyCost[1], { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
    managePropertyCostText[1].setTextBounds(0, 0, 40, 18);     
    managePropertyCostText[2] = managePropertyPop.addChild( game.add.text(82, 259, managePropertyCost[2], { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
    managePropertyCostText[2].setTextBounds(0, 0, 40, 18);     
    
    managePropertyBuySellButton = managePropertyPop.addChild( game.add.button(230, 254, 'buysellButton', managePropertyBuySellClick, {propertyID: data.propertyID}) );    
    
    if(data.propertyOwnerCheck == true){
        managePropertyPop.frame = 1;
        managePropertyBuySellButton.frame = 1;
    } else {
        managePropertyBuySellButton.frame = 0;
        managePropertyPop.frame = 0;
    }
    
    
    
}

function managePropertyBuySellClick(data){
    alert('TRYING TO BUY '+this.propertyID);
    socket.emit('player buy property', {id: clientID, propertyID: this.propertyID });     
}

function managePropertyAmenitiesClick(data){
    alert(this.amenityType)
}

function managePropertyEmployeesClick(data){
        manageEmployeePop = game.add.sprite((game.world.width/2)+38+managePropertyPop.width, game.world.height-341, 'buyManagePropertyManageEmployeeMenu');        
        manageEmployeePop.anchor.x = 0;
        manageEmployeePop.anchor.y = 0; 
        
        manageEmployeeName = manageEmployeePop.addChild( game.add.text(12, 42, this.employeeName, { font: "12px Arial", fill: "#ffffff"}));
        manageEmployeeGender = manageEmployeePop.addChild( game.add.text(239, 42, this.employeeData.gender, { font: "12px Arial", fill: "#ffffff"}));
        manageEmployeeRace = manageEmployeePop.addChild( game.add.text(12, 76, this.employeeData.race, { font: "12px Arial", fill: "#ffffff"}));
        
        manageEmployeeWage = currencyExchange(this.employeeData.upkeep);
        
        manageEmployeeWageText[0] = manageEmployeePop.addChild( game.add.text(130, 110, manageEmployeeWage[0], { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right", boundsAlignH: "right"}));
        manageEmployeeWageText[0].setTextBounds(0, 0, 40, 18);     
        manageEmployeeWageText[1] = manageEmployeePop.addChild( game.add.text(166, 110, manageEmployeeWage[1], { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right", boundsAlignH: "right"}));
        manageEmployeeWageText[1].setTextBounds(0, 0, 40, 18);     
        manageEmployeeWageText[2] = manageEmployeePop.addChild( game.add.text(202, 110, manageEmployeeWage[2], { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right", boundsAlignH: "right"}));
        manageEmployeeWageText[2].setTextBounds(0, 0, 40, 18);      
        
        var employeeSkills = Object.keys(this.employeeData.skills);
        
        for(var i=0; i<employeeSkills.length; i++){
            if(i<4){
                manageEmployeeSkillIcon[i] = manageEmployeePop.addChild( game.add.sprite(10, 133 + (i * 42), 'buyManagePropertyAmenitiesIcons')) ;
            } else {
                manageEmployeeSkillIcon[i] = manageEmployeePop.addChild( game.add.sprite(163, 133 + (i * 42), 'buyManagePropertyAmenitiesIcons')) ;
            }
            
            if(employeeSkills[i] != 'manufacturing'){
            
                if(i<4){
                    manageEmployeeSkillName[i] = manageEmployeePop.addChild( game.add.text(58, 134 + (i * 42), employeeSkills[i], { font: "12px Arial", fill: "#ffffff"}));
                    manageEmployeeSkillRating[i] = manageEmployeePop.addChild( game.add.text(58, 154 + (i * 42), (this.employeeData.skills[employeeSkills[i]]*100) + '%', { font: "12px Arial", fill: "#ffffff"}));
                } else {
                    manageEmployeeSkillName[i] = manageEmployeePop.addChild( game.add.text(211, 134 + (i * 42), employeeSkills[i], { font: "12px Arial", fill: "#ffffff"}));
                    manageEmployeeSkillRating[i] = manageEmployeePop.addChild( game.add.text(211, 154 + (i * 42), (this.employeeData.skills[employeeSkills[i]]*100) + '%', { font: "12px Arial", fill: "#ffffff"}));                    
                }
            }
            
            if(employeeSkills[i] == "food"){
                manageEmployeeSkillIcon[i].frame = 1;
            } else if(employeeSkills[i] == 'drink'){
                manageEmployeeSkillIcon[i].frame = 2;
            } else if(employeeSkills[i] == 'services'){
                manageEmployeeSkillIcon[i].frame = 3;
            } else if(employeeSkills[i] == 'inn'){
                manageEmployeeSkillIcon[i].frame = 4;
            } else if(employeeSkills[i] == 'housing'){
                manageEmployeeSkillIcon[i].frame = 5;
            } else if(employeeSkills[i] == 'weapons'){
                manageEmployeeSkillIcon[i].frame = 6;
            } else if(employeeSkills[i] == 'armor'){
                manageEmployeeSkillIcon[i].frame = 7;
            } else if(employeeSkills[i] == 'magic'){
                manageEmployeeSkillIcon[i].frame = 8;
            } else if(employeeSkills[i] == 'manufacturing'){
                manageEmployeeSkillIcon[i].frame = 9;
            } else {
                manageEmployeeSkillIcon[i].frame = 0;
            }
            
        }

}

function addPropertyEmployeesClick(data){
        addEmployeePop = game.add.sprite((game.world.width/2)+38+managePropertyPop.width, game.world.height-381, 'buyManagePropertyAddEmployeeMenu');        
        addEmployeePop.anchor.x = 0;
        addEmployeePop.anchor.y = 0; 

        socket.emit('player add employee', {id: clientID });   

}

function onEmployeeAdd(data){

    for(var i=0; i<7; i++){
        
        if(data.availableEmployees.length > i){

            var employeeName = data.availableEmployees[i].name;
            var employeeGender = data.availableEmployees[i].gender;
            
            addPropertyEmployeesButtons[i] = addEmployeePop.addChild( game.add.button(10 + (i * 42), 31, 'buyManagePropertyEmployeesIcons', addPropertyPotentialEmployeesClick, {employeeName: employeeName, employeeGender: employeeGender, employeeRace: data.availableEmployees[i].race, employeeCost: data.availableEmployees[i].cost, employeeUpkeep: data.availableEmployees[i].upkeep, employeeSkills: data.availableEmployees[i].skills}) );
            if(employeeGender == 'male'){
                addPropertyEmployeesButtons[i].frame = 1;
            } else if(employeeGender == 'female'){
                addPropertyEmployeesButtons[i].frame = 2;
            }            
            
        } else {
            addPropertyEmployeesButtons[i] = addEmployeePop.addChild( game.add.sprite(10 + (i * 42), 31, 'buyManagePropertyEmployeesIcons') );
            addPropertyEmployeesButtons[i].frame = 0;
        }
        
    }
    
    addEmployeeName = addEmployeePop.addChild( game.add.text(12, 88, '', { font: "12px Arial", fill: "#ffffff"}));
    addEmployeeGender = addEmployeePop.addChild( game.add.text(239, 88, '', { font: "12px Arial", fill: "#ffffff"}));
    addEmployeeRace = addEmployeePop.addChild( game.add.text(12, 122, '', { font: "12px Arial", fill: "#ffffff"}));    

    addEmployeeCostText[0] = addEmployeePop.addChild( game.add.text(130, 123, '', { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
    addEmployeeCostText[0].setTextBounds(0, 0, 40, 18); 
    addEmployeeCostText[1] = addEmployeePop.addChild( game.add.text(166, 123, '', { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
    addEmployeeCostText[1].setTextBounds(0, 0, 40, 18); 
    addEmployeeCostText[2] = addEmployeePop.addChild( game.add.text(202, 123, '', { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
    addEmployeeCostText[2].setTextBounds(0, 0, 40, 18);     
    
    addEmployeeWageText[0] = addEmployeePop.addChild( game.add.text(130, 156, '', { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
    addEmployeeWageText[0].setTextBounds(0, 0, 40, 18); 
    addEmployeeWageText[1] = addEmployeePop.addChild( game.add.text(166, 156, '', { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
    addEmployeeWageText[1].setTextBounds(0, 0, 40, 18); 
    addEmployeeWageText[2] = addEmployeePop.addChild( game.add.text(202, 156, '', { font: "12px Arial", fill: "#ffffff", boundsAlignH: "right"}));
    addEmployeeWageText[2].setTextBounds(0, 0, 40, 18); 
    
    for(var i=0; i<8; i++){
        if(i<4){
            addEmployeeSkillIcon[i] = addEmployeePop.addChild( game.add.sprite(10, 179 + (i * 42), 'buyManagePropertyAmenitiesIcons')) ;
            addEmployeeSkillIcon[i].frame = 0;
            
            addEmployeeSkillName[i] = addEmployeePop.addChild( game.add.text(58, 181 + (i * 42), '', { font: "12px Arial", fill: "#ffffff"}));            
            addEmployeeSkillRating[i] = addEmployeePop.addChild( game.add.text(58, 201 + (i * 42), '', { font: "12px Arial", fill: "#ffffff"}));            
        } else {
            addEmployeeSkillIcon[i] = addEmployeePop.addChild( game.add.sprite(163, 179 + ((i-4) * 42), 'buyManagePropertyAmenitiesIcons')) ;
            addEmployeeSkillIcon[i].frame = 0;
            
            addEmployeeSkillName[i] = addEmployeePop.addChild( game.add.text(211, 181 + ((i-4) * 42), '', { font: "12px Arial", fill: "#ffffff"}));
            addEmployeeSkillRating[i] = addEmployeePop.addChild( game.add.text(211, 201 + ((i-4) * 42), '', { font: "12px Arial", fill: "#ffffff"}));               
        }        
    }

}

function addPropertyPotentialEmployeesClick(data){
    addEmployeeName.text = this.employeeName;
    addEmployeeGender.text = this.employeeGender;
    addEmployeeRace.text = this.employeeRace;

    addEmployeeCost = currencyExchange(this.employeeCost);
    
    addEmployeeCostText[0].text = addEmployeeCost[0];
    addEmployeeCostText[1].text = addEmployeeCost[1];
    addEmployeeCostText[2].text = addEmployeeCost[2];    
    
    addEmployeeWage = currencyExchange(this.employeeUpkeep);
    
    addEmployeeWageText[0].text = addEmployeeWage[0];
    addEmployeeWageText[1].text = addEmployeeWage[1];
    addEmployeeWageText[2].text = addEmployeeWage[2];
    
    var employeeSkills = Object.keys(this.employeeSkills);
        
    for(var i=0; i<8; i++){

        if(employeeSkills[i] == undefined){
            addEmployeeSkillName[i].text = '';
            addEmployeeSkillRating[i].text = '';
            addEmployeeSkillIcon[i].frame = 0;
        } else {        

            if(employeeSkills[i] == "food"){
                addEmployeeSkillIcon[i].frame = 1;
            } else if(employeeSkills[i] == 'drink'){
                addEmployeeSkillIcon[i].frame = 2;
            } else if(employeeSkills[i] == 'services'){
                addEmployeeSkillIcon[i].frame = 3;
            } else if(employeeSkills[i] == 'inn'){
                addEmployeeSkillIcon[i].frame = 4;
            } else if(employeeSkills[i] == 'housing'){
                addEmployeeSkillIcon[i].frame = 5;
            } else if(employeeSkills[i] == 'weapons'){
                addEmployeeSkillIcon[i].frame = 6;
            } else if(employeeSkills[i] == 'armor'){
                addEmployeeSkillIcon[i].frame = 7;
            } else if(employeeSkills[i] == 'magic'){
                addEmployeeSkillIcon[i].frame = 8;
            } else if(employeeSkills[i] == 'manufacturing'){
                addEmployeeSkillIcon[i].frame = 9;
            } else {
                addEmployeeSkillIcon[i].frame = 0;
            }            
            
            if(employeeSkills[i] != 'manufacturing'){

                addEmployeeSkillName[i].text = employeeSkills[i];
                addEmployeeSkillRating[i].text = (this.employeeSkills[employeeSkills[i]]*100) + '%';

            } else if (employeeSkills[i] == 'manufacturing'){

                for(var j=0; j<Object.keys(this.employeeSkills['manufacturing']).length; j++){
                    var manufacturingName = 'Crafting: '+Object.keys(this.employeeSkills['manufacturing'])[j];
                    
                    var manufacturingRating = (this.employeeSkills['manufacturing'][Object.keys(this.employeeSkills['manufacturing'])[j]] * 100) + '%';
                    addEmployeeSkillIcon[i+j].frame = 9;
                    addEmployeeSkillName[i+j].text = manufacturingName;
                    addEmployeeSkillRating[i+j].text = manufacturingRating;
                    
                }
                i = i + Object.keys(this.employeeSkills['manufacturing']).length-1;
                
            }
        }

    }
    
    
}

function managePropertyEditClick(data){
    if(addEmployeePop != undefined){
        dePopAddEmployee();
    }
    if(manageEmployeePop != undefined){
        dePopManageEmployee();
    }
    if(editPropertyPop != undefined){
        dePopPropertyEdit();
    }
    
    editPropertyPop = game.add.sprite((game.world.width/2)-156, (game.world.height/2)-150, 'buyManagePropertyEditMenu');        
    editPropertyPop.anchor.x = 0;
    editPropertyPop.anchor.y = 0;  
    
    editPropertyNameField = editPropertyPop.addChild( game.add.sprite(6, 34, 'PropertyEditMenuNameField') );
    editPropertyNameField.inputEnabled = true;
    editPropertyNameField.events.onInputDown.add(function() { selectedTextBox = editPropertyNameText; }, this);
    editPropertyDescField = editPropertyPop.addChild( game.add.sprite(6, 68, 'PropertyEditMenuDescField') );
    editPropertyDescField.inputEnabled = true;
    editPropertyDescField.events.onInputDown.add(function() { selectedTextBox = editPropertyDescriptionText; }, this);    
    
    editPropertyNameText = editPropertyPop.addChild( game.add.text(10, 38, '', { font: "12px Arial", fill: "#ffffff"}));
    editPropertyDescriptionText = editPropertyPop.addChild( game.add.text(10, 72, '', { font: "12px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: 294}));
    
    editPropertyOkButton = editPropertyPop.addChild( game.add.button(9, 267, 'okButton', editPropertyOkClick, this) );
    editPropertyCancelButton = editPropertyPop.addChild( game.add.button(190, 267, 'cancelButton', editPropertyCancelClick, this) );
    
    socket.emit('player edit property info', {id: clientID });   
}

function onPropertyEditData(data){
    editPropertyNameText.text = data.propertyName;
    editPropertyDescriptionText.text = data.propertyDescription;
    
}

function editPropertyOkClick(data){
    socket.emit('player change property info', {id: clientID, propertyName: editPropertyNameText.text, propertyDescription: editPropertyDescriptionText.text});   
    
    dePopPropertyEdit();
}

function editPropertyCancelClick(data){
    dePopPropertyEdit();
}

function dePopPropertyEdit(){
    
    editPropertyOkButton.destroy();
    editPropertyCancelButton.destroy();
    
    editPropertyNameField.destroy();
    editPropertyDescField.destroy();
    
    editPropertyNameText.destroy();
    editPropertyDescriptionText.destroy();
    
    editPropertyPop.destroy();
    
    selectedTextBox = inputLine;
    
}

function dePopAddEmployee(){
    
    addEmployeeName.destroy();
    addEmployeeGender.destroy();
    addEmployeeRace.destroy();
    
    addEmployeePop.destroy();
}

function dePopManageEmployee(){
    manageEmployeeName.destroy();
    
    manageEmployeeGender.destroy();
    manageEmployeeRace.destroy();
    
    for(var i=0; i<manageEmployeeWageText.length; i++){
        manageEmployeeWageText[i].destroy();
    }
    
    for(var i=0; i<manageEmployeeSkillIcon.length; i++){
        manageEmployeeSkillName[i].destroy();
        manageEmployeeSkillRating[i].destroy();
        manageEmployeeSkillIcon[i].destroy();
        
    }    
    
    manageEmployeePop.destroy();
}

function dePopProperty(){
    
    if(addEmployeePop != undefined){
        dePopAddEmployee();
    }    
    
    managePropertyName.destroy();
    managePropertyType.destroy();
    
    for(var i=0; i<managePropertyAmenitiesButtons.length; i++){
        managePropertyAmenitiesButtons[i].destroy();
    }
    
    for(var i=0; i<managePropertyEmployeesButtons.length; i++){
        managePropertyEmployeesButtons[i].destroy();
    }    

    
    if(managePropertyEditButton != undefined){
        managePropertyEditButton.destroy();
    }
    


    managePropertyIncomeText[0].destroy();
    managePropertyIncomeText[1].destroy();
    managePropertyIncomeText[2].destroy();    
    
    managePropertyUpkeepText[0].destroy();
    managePropertyUpkeepText[1].destroy();
    managePropertyUpkeepText[2].destroy();
    
    managePropertyCostText[0].destroy();
    managePropertyCostText[1].destroy();
    managePropertyCostText[2].destroy();
    
    managePropertyBuySellButton.destroy();
    
    managePropertyPop.destroy();
}