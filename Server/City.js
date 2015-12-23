var util = require('util')

var server = require('./server');

var Employee = require('./Employee')

/* ************************************************
** GAME CITY CLASS
************************************************ */
var City = function (cityID, name, description, population, propertyTax, market) {
    
  this.cityID = cityID;

  this.name = name;
  this.description = description;
  this.population = population;
  this.propertyTax = propertyTax;
  this.market = market;

  var heartbeat = function () {
      //Recalculate market supply and demand ******************************************************************************************
      var marketSectors = Object.keys(this.market);
      
      for(var i=0; i<marketSectors.length; i++){

          var totalMarketSectorDemand = .125;
          
          this.market[marketSectors[i]].demand = totalMarketSectorDemand;          
          
          var marketSectorSupply = 0;
          var marketSectorCount = 0;
          var totalMarketSectorSupply = 0;
          
          for(var j=0; j<properties.length; j++){
              if(properties[j].city == this.cityID){
                  marketSectorCount += server.getAmenityRankCount(marketSectors[i]); // TOTAL AMOUNT OF POSSIBLE SPACES FOR MARKET SECTOR (SHOULD BE A COUNT OF ALL RANKS TIMES NUMBER OF PROPERTIES IN CITY)
                  
                  if(properties[j].amenities[marketSectors[i]] != undefined){
                      marketSectorSupply += properties[j].amenities[marketSectors[i]].rank; // A RUNNING TOTAL OF THE ACTUAL AMOUNT OF USED MARKET SECTOR SPACE
                  }
              }
          }
          
          totalMarketSectorSupply = marketSectorSupply / marketSectorCount; //PERCENT OF USAGE
          
          totalMarketSectorSupply = totalMarketSectorSupply / totalMarketSectorDemand; // PERCENT OF USAGE BASED ON DEMAND. MAY GO ABOVE 100%
          
          this.market[marketSectors[i]].supply = totalMarketSectorSupply;
          


      }
      
      //Refresh Employee List *************************************************************************************************************
      
      if(server.getAvailableEmployeeCount(this.cityID) < 7){
        Employee.createEmployee(this.cityID);
      }

      
  } 

  // Define which variables and methods can be accessed
  return {
    heartbeat: heartbeat,

    cityID: this.cityID,
    name: this.name,
    description: this.description,
    population: this.population,
    propertyTax: this.propertyTax,
    market: this.market
  }


}

module.exports = City
