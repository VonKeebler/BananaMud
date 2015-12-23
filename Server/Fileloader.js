// Declare variables
var fs = require('fs')

var validPlayers;
var validRooms;

var validTherusRooms, validTherusCountrysideRooms, validTherusThievesGuildRooms, validTherusSewerRooms;

var validProperties, validCities, validEmployees, validAmenities;

var baseNPCs;
var baseItems;
var validPCs;

var baseSpells;

var util = require('util');

var server = require('./server');

var Player = require('./Player')
var Room = require('./Room')
var Property = require('./Property')
var Amenity = require('./Amenity')
var Employee = require('./Employee')
var City = require('./City')
var Item = require('./Item')
var NPC = require('./NPC')
var PC = require('./PC')

var Spell = require('./Spell')
var Skill = require('./Skill')

// Read the file and send to the callback
fs.readFile('./Files/Players.json', loadLogins);
fs.readFile('./Files/Rooms.json', loadTherusRooms);
fs.readFile('./Files/Rooms.json', loadTherusProperties);
fs.readFile('./Files/TherusCountryside.json', loadTherusCountrysideRooms);
fs.readFile('./Files/TherusThievesGuild.json', loadTherusThievesGuildRooms);
fs.readFile('./Files/TherusSewer.json', loadTherusSewerRooms);
fs.readFile('./Files/NPCBase.json', loadNPCs);
fs.readFile('./Files/ItemsBase.json', loadItems);
fs.readFile('./Files/PCs.json', loadPCs);

fs.readFile('./Files/Properties.json', loadProperties);
fs.readFile('./Files/Amenities.json', loadAmenities);
fs.readFile('./Files/Employees.json', loadEmployees);
fs.readFile('./Files/Cities.json', loadCities);

fs.readFile('./Files/SpellsBase.json', loadSpells);
fs.readFile('./Files/SkillsBase.json', loadSkills);

// Write the callback function
function loadLogins(err, data) {
    if (err) throw err;
    validPlayers = JSON.parse(data);
    // You can now play with your datas
}

function loadTherusRooms(err, data) {
    if (err) throw err;

    validTherusRooms = JSON.parse(data);

    readRooms(validTherusRooms['TherusRooms']);
    // You can now play with your datas

}

function loadTherusCountrysideRooms(err, data) {
    if (err) throw err;

    validTherusCountrysideRooms = JSON.parse(data);

    readRooms(validTherusCountrysideRooms['TherusCountrysideRooms']);
    // You can now play with your datas

}

function loadTherusProperties(err, data) {
    if (err) throw err;

    validTherusRooms = JSON.parse(data);

    readRooms(validTherusRooms['TherusProperties']);
    // You can now play with your datas

}


function loadTherusThievesGuildRooms(err, data) {
    if (err) throw err;

    validTherusThievesGuildRooms = JSON.parse(data);

    readRooms(validTherusThievesGuildRooms['TherusThievesGuildRooms']);
    // You can now play with your datas

}

function loadTherusSewerRooms(err, data) {
    if (err) throw err;

    validTherusSewerRooms = JSON.parse(data);

    readRooms(validTherusSewerRooms['TherusSewerRooms']);
    // You can now play with your datas

}

function loadNPCs(err, data) {
    if (err) throw err;
    baseNPCs = JSON.parse(data);
    readNPCs();
    // You can now play with your datas
}

function loadItems(err, data) {
    if (err) throw err;
    baseItems = JSON.parse(data);
    readItems();
    // You can now play with your datas
}

function loadPCs(err, data) {
    if (err) throw err;
    validPCs = JSON.parse(data);
    readPCs();
    // You can now play with your datas
}

function loadSpells(err, data) {
    if (err) throw err;
    baseSpells = JSON.parse(data);
    readSpells();
    // You can now play with your datas
}

function loadSkills(err, data) {
    if (err) throw err;
    baseSkills = JSON.parse(data);
    readSkills();
    // You can now play with your datas
}

function loadProperties(err, data) {
    if (err) throw err;
    validProperties = JSON.parse(data);
    readProperties();
    // You can now play with your datas
}

function loadAmenities(err, data) {
    if (err) throw err;
    validAmenities = JSON.parse(data);
    readAmenities();
    // You can now play with your datas
}

function loadEmployees(err, data) {
    if (err) throw err;
    validEmployees = JSON.parse(data);
    readEmployees();
    // You can now play with your datas
}

function loadCities(err, data) {
    if (err) throw err;
    validCities = JSON.parse(data);
    readCities();
    // You can now play with your datas
}

module.exports = {

    checkLogin : function (data){
        var userIndex = -1;
        var triedName = data.name;
        var triedPass = data.pass;

        var userInfo = validPlayers['Players'];

        for(var i=0; i<userInfo.length; i++){
            if(triedName === userInfo[i].login){
                userIndex = i;
                break;
            }
        }

        if(userIndex == -1){
            return {result: "Login Not Found"};
        } else if(triedPass != userInfo[userIndex].password){
            return {result: "Password Incorrect"};
        } else {
            return {result: "LOGIN SUCCESSFUL"};
        }
    },

    createLogin : function (data){
        var userIndex = -1;
        var triedName = data.name;
        var triedPass = data.pass;

        var userInfo = validPlayers['Players'];

        for(var i=0; i<userInfo.length; i++){
            if(triedName === userInfo[i].login){
                userIndex = i;
                break;
            }
        }

        if(userIndex != -1){
            return {result: "Login Already Exists"};
        }

        var newData = {id : userInfo.length, login : triedName, password : triedPass, randomotherstuff : "", currentSessionID : "", characterID : "-1"};
        validPlayers['Players'].push(newData);
        /*userInfo.'Players'[userInfo.length]["id"] = userInfo.length;
        userInfo.'Players'[userInfo.length]["login"] = triedName;
        userInfo.'Players'[userInfo.length]["password"] = triedPass;
        userInfo.'Players'[userInfo.length]["randomotherstuff"] = "";
        userInfo.'Players'[userInfo.length]["currentSessionID"] = "";
        userInfo.'Players'[userInfo.length]["characterID"] = "-1";*/

        //fs.writeFile('./Files/PlayersTEST.json', JSON.stringify(validPlayers), function (err) { if (err) throw err;});
        fs.writeFile('./Files/Players.json', JSON.stringify(validPlayers), function (err) { if (err) throw err;});
        //fs.readFile('./Files/Players.json', loadLogins);

        return {result: "CREATION SUCCESSFUL"};
    },

    createCharacter : function (data){

        var playerName = data.playerName;
        var name = data.name;
        var gender = data.gender;
        var race = data.race;
        var description = data.description;
        var level = data.level;
        var health = data.health;
        var maxhealth = data.maxhealth;
        var energy = data.energy;
        var maxenergy = data.maxenergy;
        var magic = data.magic;
        var maxmagic = data.maxmagic;
        var strength = data.strength;
        var agility = data.agility;
        var intellect = data.intellect;
        var meleepower = data.meleepower;
        var speed = data.speed;
        var spellpower = data.spellpower;
        var hitchance = data.hitchance;
        var stealth = data.stealth;
        var criticalchance = data.criticalchance;
        var defence = data.defence;
        var attack = data.attack;
        
        var combatSkills = data.combatSkills;
        var stealthSkills = data.stealthSkills;
        var magicSpells = data.magicSpells;
        
        var roomid = data.roomid;
        var inventory = data.inventory;
        var money = data.money;
        var allegiances = data.allegiances;
        var equipment = data.equipment;
        var messages = data.messages

        if(allegiances == undefined){
            allegiances = {"Evil": -100, "Therus Townsfolk": 50, "Therus Gillmen": 25, "Therus Lizardmen": 25};

        }


        var characterInfo = validPCs['PCs'];

        for(var i=0; i<characterInfo.length; i++){

        }
        var newPCID = server.generateId();

        var newData = {id : newPCID, playerName : playerName, name : name, gender : gender, race : race,  description : description, level: level, health: health, maxhealth: maxhealth, energy: energy, maxenergy: maxenergy, magic: magic, maxmagic: maxmagic, strength: strength, agility: agility, intellect: intellect, meleepower: meleepower, speed: speed, spellpower: spellpower, hitchance: hitchance, stealth: stealth, criticalchance: criticalchance, defence: defence, attack: attack, combatSkills: combatSkills, stealthSkills: stealthSkills, magicSpells: magicSpells, roomid: roomid, inventory: inventory, money: money, allegiances: allegiances, equipment: equipment, messages: messages};
        validPCs['PCs'].push(newData);


        //fs.writeFile('./Files/PlayersTEST.json', JSON.stringify(validPlayers), function (err) { if (err) throw err;});
        fs.writeFile('./Files/PCs.json', JSON.stringify(validPCs), function (err) { if (err) throw err;});
        //fs.readFile('./Files/Players.json', loadLogins);

        var newPC = new PC(newPCID, playerName, name, gender, race, description, level, health, maxhealth, energy, maxenergy, magic, maxmagic, strength, agility, intellect, meleepower, speed, spellpower, hitchance, stealth, criticalchance, defence, attack, combatSkills, stealthSkills, magicSpells, roomid, inventory, money, allegiances, equipment, messages);
        PCs.push(newPC);

        return "CREATION SUCCESSFUL";
    },

    findNPC : function (npcName){

        var foundNPC;
        var townRecords = baseNPCs['Townsfolk'];
        var monstersRecords = baseNPCs['Monsters'];

        for(var i=0; i< townRecords.length; i++){
            if(townRecords[i]['name'] == npcName){
                return townRecords[i];
            }
        }

        for(var i=0; i< monstersRecords.length; i++){
            if(monstersRecords[i]['name'] == npcName){
                return monstersRecords[i];
            }
        }


        return;
    },
    savePCs : function (){

        var savingPCs = {};
        savingPCs.PCs = [];

        for(var i=0; i<PCs.length; i++){
            savingPCs.PCs.push(PCs[i])

        }


        fs.writeFile('./Files/PCs.json', JSON.stringify(savingPCs), function (err) { if (err) throw err;});


        return;
    },
    saveProperties : function (){

        var propertyData = [];

        for(var i=0; i<properties.length; i++){
            propertyData.push(properties[i])

        }
        var savingProperties = {Properties: propertyData};

        fs.writeFile('./Files/Properties.json', JSON.stringify(savingProperties), function (err) { if (err) throw err;});


        return;
    },
    saveEmployees : function (){

        var employeeData = [];
        var employeeCities = [];
        for(var i=0; i<employees.length; i++){
            if(employeeCities.indexOf(employees[i].city) == -1){
                employeeCities.push(employees[i].city);
            }

        }
        var employeeCityObject = {};
        
        for(var i=0; i<employeeCities.length; i++){
            var employeesInCity = server.employeesByCity(employeeCities[i]);

            var employeeNameObject = {};
            
            for(var j=0; j<employeesInCity.length; j++){
                
                var employeeObject = {id: employeesInCity[j].id, race: employeesInCity[j].race, gender: employeesInCity[j].gender, upkeep: employeesInCity[j].upkeep, status: employeesInCity[j].status, employer: employeesInCity[j].employer, skills: employeesInCity[j].skills};
                
                employeeNameObject[[employeesInCity[j].name]] = employeeObject;
                
            }
            
            employeeCityObject[employeeCities[i]] = employeeNameObject;
            
            employeeData.push(employeeCityObject);
        }
        
        var savingEmployees = {Employees: employeeData};

        fs.writeFile('./Files/Employees.json', JSON.stringify(savingEmployees), function (err) { if (err) throw err;});


        return;
    } 

}


function readRooms(data){

    var roomInfo = data;
    var id, roomid, name, description, mapx, mapy, transitionx, transitiony, roomexits, roomexitfunctions, flavorobjects, inventory, money, spawns, region, interactiveobjects;
    for(var i=0; i < roomInfo.length; i++){
        id = roomInfo[i]['id'];
        roomid = roomInfo[i]['roomid'];
        name = roomInfo[i]['name'];
        description = roomInfo[i]['description'];
        mapx = roomInfo[i]['mapX'];
        mapy = roomInfo[i]['mapY'];
        transitionx = roomInfo[i]['transitionX'];
        transitiony = roomInfo[i]['transitionY'];        
        roomexits =  roomInfo[i]['roomExits'];
        roomexitfunctions =  roomInfo[i]['roomExitFunctions'];
        flavorobjects = roomInfo[i]['flavorObjects'];
        inventory = roomInfo[i]['inventory'];
        money = roomInfo[i]['money'];
        shop = roomInfo[i]['shop'];
        spawns = roomInfo[i]['spawns'];
        region = roomInfo[i]['region'];
        interactiveobjects = roomInfo[i]['interactiveObjects'];


        newRoom = new Room(id, roomid, name, description, mapx, mapy, transitionx, transitiony, roomexits, roomexitfunctions, flavorobjects, inventory, money, shop, spawns, region, interactiveobjects);
        rooms.push(newRoom);

    }

}

function readNPCs(){
    var townsInfo = baseNPCs['Townsfolk'];
    var monstersInfo = baseNPCs['Monsters'];
    npcs = [];
    var id, name, alias, roomdescription, description, startingroom, inventory, money, dialog, secretdialog, idleEmotes, allegiance, currentBattle, health, maxhealth, energy, maxenergy, magic, maxmagic, strength, agility, intellect, meleepower, speed, spellpower, hitchance, stealth, criticalchance, defence, attack, roaming, equipment, visibility;
    for(var i=0; i < townsInfo.length; i++){ // LOAD "TOWNSFOLK"
        id = townsInfo[i]['id'];
        name = townsInfo[i]['name'];
        alias = townsInfo[i]['alias'];
        roomdescription = townsInfo[i]['roomdescription'];
        description = townsInfo[i]['description'];
        startingroom = townsInfo[i]['startingroom'];
        inventory = townsInfo[i]['inventory'];
        money = townsInfo[i]['money'];
        dialog = townsInfo[i]['dialog'];
        secretdialog = townsInfo[i]['secretdialog'];
        idleEmotes = townsInfo[i]['idleEmotes'];
        allegiance = townsInfo[i]['allegiance'];
        currentBattle = null;

        health = townsInfo[i]['health'];
        maxhealth = townsInfo[i]['maxhealth'];
        energy = townsInfo[i]['energy'];
        maxenergy = townsInfo[i]['maxenergy'];
        magic = townsInfo[i]['magic'];
        maxmagic = townsInfo[i]['maxmagic'];

        strength = townsInfo[i]['strength'];
        agility = townsInfo[i]['agility'];
        intellect = townsInfo[i]['intellect'];

        meleepower = townsInfo[i]['meleepower'];
        speed = townsInfo[i]['speed'];
        spellpower = townsInfo[i]['spellpower'];

        hitchance = townsInfo[i]['hitchance'];
        stealth = townsInfo[i]['stealth'];
        criticalchance = townsInfo[i]['criticalchance'];

        defence = townsInfo[i]['defence'];
        attack = townsInfo[i]['attack'];

        roaming = townsInfo[i]['roaming'];
        equipment = townsInfo[i]['equipment'];

        visibility = townsInfo[i]['visibility'];

        newNPC = new NPC(id, name, alias, roomdescription, description, startingroom, inventory, money, dialog, secretdialog, idleEmotes, allegiance, currentBattle, health, maxhealth, energy, maxenergy, magic, maxmagic, strength, agility, intellect, meleepower, speed, spellpower, hitchance, stealth, criticalchance, defence, attack, roaming, equipment, visibility);
        npcs.push(newNPC);

    }

    for(var i=0; i < monstersInfo.length; i++){ // LOAD "MONSTERS"
        id = monstersInfo[i]['id'];
        name = monstersInfo[i]['name'];
        alias = monstersInfo[i]['alias'];
        roomdescription = monstersInfo[i]['roomdescription'];
        description = monstersInfo[i]['description'];
        startingroom = monstersInfo[i]['startingroom'];
        inventory = monstersInfo[i]['inventory'];
        money = monstersInfo[i]['money'];
        dialog = monstersInfo[i]['dialog'];
        secretdialog = monstersInfo[i]['secretdialog'];
        idleEmotes = monstersInfo[i]['idleEmotes'];
        allegiance = monstersInfo[i]['allegiance'];
        currentBattle = null;

        health = monstersInfo[i]['health'];
        maxhealth = monstersInfo[i]['maxhealth'];
        energy = monstersInfo[i]['energy'];
        maxenergy = monstersInfo[i]['maxenergy'];
        magic = monstersInfo[i]['magic'];
        maxmagic = monstersInfo[i]['maxmagic'];

        strength = monstersInfo[i]['strength'];
        agility = monstersInfo[i]['agility'];
        intellect = monstersInfo[i]['intellect'];

        meleepower = monstersInfo[i]['meleepower'];
        speed = monstersInfo[i]['speed'];
        spellpower = monstersInfo[i]['spellpower'];

        hitchance = monstersInfo[i]['hitchance'];
        stealth = monstersInfo[i]['stealth'];
        criticalchance = monstersInfo[i]['criticalchance'];

        defence = monstersInfo[i]['defence'];
        attack = monstersInfo[i]['attack'];

        roaming = monstersInfo[i]['roaming'];
        equipment = monstersInfo[i]['equipment'];

        visibility = monstersInfo[i]['visibility'];

        newNPC = new NPC(id, name, alias, roomdescription, description, startingroom, inventory, money, dialog, secretdialog, idleEmotes, allegiance, currentBattle, health, maxhealth, energy, maxenergy, magic, maxmagic, strength, agility, intellect, meleepower, speed, spellpower, hitchance, stealth, criticalchance, defence, attack, roaming, equipment, visibility);
        npcs.push(newNPC);

    }

}

function readItems(){
    var itemInfo = baseItems['Items'];
    items = [];
    var id, itemID, name, description, type, imageIndex, baseValue, stats, use;
    for(var i=0; i < itemInfo.length; i++){
        id = itemInfo[i]['id'];
        itemID = itemInfo[i]['itemID'];
        name = itemInfo[i]['name'];
        description = itemInfo[i]['description'];
        type = itemInfo[i]['type'];
        imageIndex = itemInfo[i]['imageIndex'];
        baseValue = itemInfo[i]['baseValue'];
        stats = itemInfo[i]['stats'];
        use = itemInfo[i]['use'];

        newItem = new Item(id, itemID, name, description, type, imageIndex, baseValue, stats, use);
        items.push(newItem);

    }

}

function readPCs(){
    var pcInfo = validPCs['PCs'];
    PCs = [];
    var id, playerName, name, gender, race, description, level, health, maxhealth, energy, maxenergy, magic, maxmagic, strength, agility, intellect, meleepower, speed, spellpower, hitchance, stealth, criticalchance, defence, attack, combatSkills, stealthSkills, magicSpells, roomid, inventory, money, allegiances, equipment, messages, secretdialog, movementfunctions;

    for(var i=0; i < pcInfo.length; i++){
        id = pcInfo[i]['id'];
        playerName = pcInfo[i]['playerName'];
        name = pcInfo[i]['name'];
        gender = pcInfo[i]['gender'];
        race = pcInfo[i]['race'];
        description = pcInfo[i]['description'];
        level = pcInfo[i]['level'];
        health = pcInfo[i]['health'];
        maxhealth = pcInfo[i]['maxhealth'];
        energy = pcInfo[i]['energy'];
        maxenergy = pcInfo[i]['maxenergy'];
        magic = pcInfo[i]['magic'];
        maxmagic = pcInfo[i]['maxmagic'];
        strength = pcInfo[i]['strength'];
        agility = pcInfo[i]['agility'];
        intellect = pcInfo[i]['intellect'];
        meleepower = pcInfo[i]['meleepower'];
        speed = pcInfo[i]['speed'];
        spellpower = pcInfo[i]['spellpower'];
        hitchance = pcInfo[i]['hitchance'];
        stealth = pcInfo[i]['stealth'];
        criticalchance = pcInfo[i]['criticalchance'];
        defence = pcInfo[i]['defence'];
        attack = pcInfo[i]['attack'];
        combatSkills = pcInfo[i]['combatSkills'];
        stealthSkills = pcInfo[i]['stealthSkills'];
        magicSpells = pcInfo[i]['magicSpells'];
        roomid = pcInfo[i]['roomid'];
        inventory = pcInfo[i]['inventory'];
        money = pcInfo[i]['money'];
        allegiances = pcInfo[i]['allegiances'];
        equipment = pcInfo[i]['equipment'];
        messages = pcInfo[i]['messages'];
        secretdialog = pcInfo[i]['secretDialog'];
        movementfunctions = pcInfo[i]['movementFunctions'];

        newPC = new PC(id, playerName, name, gender, race, description, level, health, maxhealth, energy, maxenergy, magic, maxmagic, strength, agility, intellect, meleepower, speed, spellpower, hitchance, stealth, criticalchance, defence, attack, combatSkills, stealthSkills, magicSpells, roomid, inventory, money, allegiances, equipment, messages, secretdialog, movementfunctions);
        PCs.push(newPC);

    }
}

function readSpells(){
    var spellInfo = baseSpells['Spells'];
    spells = [];
    var skillID, name, description, imageIndex, powerCost, magicCost, type, time, onHitValue, totalValue;

    for(var i=0; i < spellInfo.length; i++){
        skillID = spellInfo[i]['skillID'];
        name = spellInfo[i]['name'];
        description = spellInfo[i]['description'];
        imageIndex = spellInfo[i]['imageIndex'];
        powerCost = spellInfo[i]['powerCost'];
        magicCost = spellInfo[i]['magicCost'];
        type = spellInfo[i]['type'];
        time = spellInfo[i]['time'];
        onHitValue = spellInfo[i]['onHitValue'];
        totalValue = spellInfo[i]['totalValue'];

        newSpell = new Spell(skillID, name, description, imageIndex, powerCost, magicCost, type, time, onHitValue, totalValue);
        spells.push(newSpell);

    }
}

function readSkills(){
    var combatSkillInfo = baseSkills['Combat'];
    combatSkills = [];
    var skillID, name, description, imageIndex, powerCost, magicCost, type, time, onHitValue, totalValue;

    for(var i=0; i < combatSkillInfo.length; i++){
        skillID = combatSkillInfo[i]['skillID'];
        name = combatSkillInfo[i]['name'];
        description = combatSkillInfo[i]['description'];
        imageIndex = combatSkillInfo[i]['imageIndex'];
        powerCost = combatSkillInfo[i]['powerCost'];
        energyCost = combatSkillInfo[i]['energyCost'];
        type = combatSkillInfo[i]['type'];
        time = combatSkillInfo[i]['time'];
        onHitValue = combatSkillInfo[i]['onHitValue'];
        totalValue = combatSkillInfo[i]['totalValue'];

        newSkill = new Skill(skillID, name, description, imageIndex, powerCost, energyCost, type, time, onHitValue, totalValue);
        combatSkills.push(newSkill);

    }

    var stealthSkillInfo = baseSkills['Stealth'];
    stealthSkills = [];

    for(var i=0; i < stealthSkillInfo.length; i++){
        skillID = stealthSkillInfo[i]['skillID'];
        name = stealthSkillInfo[i]['name'];
        description = stealthSkillInfo[i]['description'];
        imageIndex = stealthSkillInfo[i]['imageIndex'];
        powerCost = stealthSkillInfo[i]['powerCost'];
        energyCost = stealthSkillInfo[i]['energyCost'];
        type = stealthSkillInfo[i]['type'];
        time = stealthSkillInfo[i]['time'];
        onHitValue = stealthSkillInfo[i]['onHitValue'];
        totalValue = stealthSkillInfo[i]['totalValue'];

        newSkill = new Skill(skillID, name, description, imageIndex, powerCost, energyCost, type, time, onHitValue, totalValue);
        stealthSkills.push(newSkill);

    }
}

function readProperties(){
    var propertyInfo = validProperties['Properties'];

    var propertyID, city, owner, status, type, value, upkeep, employees, amenities, inventory;

    for(var i=0; i < propertyInfo.length; i++){
        propertyID = propertyInfo[i]['propertyID'];
        city = propertyInfo[i]['city'];
        owner = propertyInfo[i]['owner'];
        status = propertyInfo[i]['status'];
        type = propertyInfo[i]['type'];
        value = propertyInfo[i]['value'];
        upkeep = propertyInfo[i]['upkeep'];
        employees = propertyInfo[i]['employees'];
        amenities = propertyInfo[i]['amenities'];
        inventory = propertyInfo[i]['inventory'];

        newProperty = new Property(propertyID, city, owner, status, type, value, upkeep, employees, amenities, inventory);
        properties.push(newProperty);

    }
}

function readAmenities(){
    var amenityInfo = validAmenities['Amenities'];

    var amenityID, name, imageIndex, description, upgrades;

    for(var i=0; i < amenityInfo.length; i++){
        amenityID = amenityInfo[i]['amenityID'];
        name = amenityInfo[i]['name'];
        imageIndex = amenityInfo[i]['imageIndex'];
        description = amenityInfo[i]['description'];
        upgrades = amenityInfo[i]['upgrades'];

        newAmenity = new Amenity(amenityID, name, imageIndex, description, upgrades);
        amenities.push(newAmenity);

    }
}

function readCities(){
    var cityInfo = validCities['Cities'];

    var cityID, name, description, population, propertyTax, market;

    for(var i=0; i < cityInfo.length; i++){
        cityID = cityInfo[i]['cityID'];
        name = cityInfo[i]['name'];
        description = cityInfo[i]['description'];
        population = cityInfo[i]['population'];
        propertyTax = cityInfo[i]['propertyTax'];
        market = cityInfo[i]['market'];

        newCity = new City(cityID, name, description, population, propertyTax, market);
        cities.push(newCity);

    }
}

function readEmployees(){
    var employeeInfo = validEmployees['Employees'];

    var name, city, race, gender, upkeep, skills;

    for(var i=0; i < employeeInfo.length; i++){
        var employeeCities = Object.keys(employeeInfo[i]);
        var employeeCity = employeeCities[0];
        var employeeNames = Object.keys(employeeInfo[i][employeeCity])
        
        for (var j=0; j<employeeNames.length; j++){
        
            var employeeData = employeeInfo[i][employeeCity][employeeNames[j]];
            
            id = employeeData['id'];
            name = employeeNames[j];
            race = employeeData['race'];
            gender = employeeData['gender'];
            upkeep = employeeData['upkeep'];
            status = employeeData['status'];
            employer = employeeData['employer'];
            skills = employeeData['skills'];
            
            newEmployee = new Employee(id, name, employeeCity, race, gender, upkeep, status, employer, skills);
            employees.push(newEmployee);
            
        }

    }
}
