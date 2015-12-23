var util = require('util')

var server = require('./server');

/* ************************************************
** GAME PROPERTY CLASS
************************************************ */
var Property = function (propertyID, city, owner, status, type, value, upkeep, employees, amenities, inventory) {
    
  this.propertyID = propertyID;

  this.city = city;
  this.owner = owner;
  this.status = status;
  this.type = type;
  this.value = value;
    
  this.upkeep = upkeep;
  this.employees = employees;

  this.amenities = amenities;
  this.inventory = inventory;
    
  this.income = 0;

  var heartbeat = function () {
      //Recalculate weekly income
      var propertyCity = server.cityById(this.city);
      
      var propertyIncome = 0;
      var salesTax = 0;
      
      for(var i=0; i <Object.keys(this.amenities).length; i++){
            var amenityType = Object.keys(this.amenities)[i];
            var amenityData = this.amenities[Object.keys(this.amenities)[i]];

            if(amenityType != 'cooking' && amenityType != 'brewing' && amenityType != 'weapon smithing' && amenityType != 'armor smithing' && amenityType != 'enchanting' && amenityType != 'refinery'){
          
                //THE TOTAL VALUE OF AN AMENITY IN A CITY IS THE MARKET DEMAND TIMES CITY POPULATION TIMES MARKET VALUE
                // EX. 0.125 (THERUS FOOD DEMAND) TIMES 4988 (THERUS POP) IS 623.5. TIMES 25 (THERUS FOOD VALUE) IS 15,587.5

                var amenityCityValue = (propertyCity['market'][Object.keys(this.amenities)[i]].demand * propertyCity.population) * propertyCity['market'][Object.keys(this.amenities)[i]].value;
                
                //THE WEEKLY PROPERTY AMENITY VALUE IS THE TOTAL CITY VALUE TIMES THE MARKETING SHARE OF THE AMENITY
                var amenityPropertyValue = amenityCityValue * amenityData.marketing;
                propertyIncome += Math.round(amenityPropertyValue);
                
                salesTax += amenityPropertyValue * propertyCity['market'][Object.keys(this.amenities)[i]].tax;
            }
      }
      
      this.income = propertyIncome;
      
      this.value = propertyIncome * 10;
      this.upkeep = Math.round( (this.value * propertyCity.propertyTax) + salesTax );      
      
  } 

  // Define which variables and methods can be accessed
  return {
    heartbeat: heartbeat,

    propertyID: this.propertyID,
    city: this.city,
    owner: this.owner,
    status: this.status,
    type: this.type,
    value: this.value,
    upkeep: this.upkeep,
    employees: this.employees,
    amenities: this.amenities,
    inventory: this.inventory,
    income: this.income
  }


}

module.exports = Property
