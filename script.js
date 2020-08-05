
console.log("script.JS");

var city = "";
var searchCities = [];
const apiKey = "6c7bd75f0b7efcb494d549d431b41900";
var queryURL = "api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+apiKey;

function displaynotFound(){
  $("#jumbotron").empty();
  var header = $("<h1 class='header'>").text("City Not Found!"); 
}

function displayWeather(responce){
  //get stored cities
  //clear cities
  $("#search-city").empty();
  //for loop to add cities
  console.log("before for loop" + searchCities)
  for (let i = 0; i < searchCities.length; i++) {
    var listEl = $("<li class='list-group-item'>").text(searchCities[i]);
    $("#search-city").append(listEl);
  };


  //empty all data in display
  $("#display-data").empty();

  //create current day elements
  var cityData = responce;
  var dateString = moment.unix(cityData.current.dt).format("MM/DD/YYYY");
  var dataEl = $("<div class='jumbotron' id='jumbotron'>")
  dataEl.append($("<h1 class='header'>").text(city + "  " + dateString));
  dataEl.append($("<p>").text("Tempurature: "+cityData.current.temp));
  dataEl.append($("<p>").text("Humidity: "+cityData.current.humidity));
  dataEl.append($("<p>").text("WindSpeed: "+cityData.current.wind_speed));
  dataEl.append($("<p>").text("UV index: "+cityData.current.uvi));
  dataEl.append($("<hr>"));
  //append current day to display
  $("#display-data").append(dataEl);

  //create cards for future forcast
  $("#display-data").append($("<h2 id='5-day-header'>").text("5 Day Forcast"));
  var cardsEl = $("<div class='row cards' id='5-day'>");
  
  //for loop to loop through each day
  for(i = 0; i < 5; i++){
    //console.log("for loop " +i);
    var cardEl = $("<div class='card col-md-2.4'>");
    var cardBodyEl =$("<div class='card-body'>");
    cardBodyEl.append($("<h5 class='card-title'>").text(moment.unix(cityData.daily[i].dt).format("MM/DD/YYYY")));
    cardBodyEl.append($("<p>").text("icon goes here"));
    cardBodyEl.append($("<p>").text("Tempurature: "+cityData.daily[i].temp.day));
    cardBodyEl.append($("<p>").text("Humidity: "+cityData.daily[i].humidity));
    //console.log(cardBodyEl);

    //append to document
    cardEl.append(cardBodyEl);
    //console.log(cardEl);
    cardsEl.append(cardEl);
    //console.log(cardsEl);
  };

  $("#display-data").append(cardsEl);
}


function addCity(city){
  storedCities = JSON.parse(localStorage.getItem("storedCities"));
  if(storedCities !== null){
    searchCities = storedCities;
  }

  city = this.city.toUpperCase();
  var index = searchCities.indexOf(city);
  if(index === -1){
    searchCities.push(city);
  };
console.log("sec "+searchCities);
  localStorage.setItem("storedCities", JSON.stringify(searchCities));


}

function weatherAPICalls(city){
  var city = this.city;

  $.ajax({
    url: "http://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+apiKey,
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
      addCity(city);

      //call using lat and long to get the needed data
      $.ajax({
        url: "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units=imperial&exclude=minutely,hourly&appid="+apiKey,
        method: "GET"
      }).then(function(responce){
      //console.log(responce);
        displayWeather(responce);
      });
    };
  });
}

//event listener for search
$("#searchBtn").on("click", function(event){
  event.preventDefault();
    
  city = $("#inputCity").val().trim();

  weatherAPICalls(city);
});

