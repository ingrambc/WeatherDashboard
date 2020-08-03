
console.log("script.JS");

var city = "";
var searchCities = [];
const apiKey = "6c7bd75f0b7efcb494d549d431b41900";
var queryURL = "api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+apiKey;

function displaynotFound(){
console.log(cityData);

}

function addCity(city){
  city = city.toUpperCase();
  var index = searchCities.indexOf(city);
  if(index !== -1){
    searchCities.push(city);
  }

}

function weatherAPICalls(city){
  var city = this.city;

  $.ajax({
    url: "http://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+apiKey;,
    method: "GET"
  }).then(function(responce){
    var lat = responce.coord.lat;
//    console.log("lat = "+lat);
    var lon = responce.coord.lon;
//    console.log("lon = " +lon);

    if(responce === null){
      displaynotFound();
    }else{
      //add city to search array
      addCity(city)

      //call using lat and long to get the needed data
      $.ajax({
        url: "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=minutely,hourly&appid="+apiKey,
        method: "GET"
      }).then(function(responce){
//      console.log(responce);
        displayWeather(responce);
      });
    }
  });
}

//event listener for search

$("#searchBtn").on("click", function(event){
  event.preventDefault();
  console.log("entered Event");
  
  city = $("#inputCity").val().trim();

  weatherAPICalls(city);
});

