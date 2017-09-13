(function() {
  "use strict";
  // Use for display
  var backgroundImage = {
    "clear sky": 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/368633/clear.jpg',
    "overcast clouds": 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/368633/overcast.jpg',
    "broken clouds": 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/368633/mostly_cloudy.jpg',
    "scattered clouds": 'https://coclouds.com/wp-content/uploads/2011/06/illuminated-scattered-clouds-2011-06-21.jpg',
    "few clouds": 'https://aruba-vacations-674702.c.cdn77.org/slideshow/blue_sky_with_few_clouds.jpg',
    "shower rain": 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/368633/rainy.jpg',
    "rain": 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/368633/rainy.jpg',
    "thunderstorm": 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/368633/thunderstorm.jpg',
    "snow": 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/368633/snow.jpg',
    "mist": 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/368633/mist.jpg'
  }
  
  var displayCity = document.getElementById("city");
  var displayTemp = document.getElementById("temperature");
  var displayWeather = document.getElementById("weather");
  var displayHumidity = document.getElementById("humidity");
  var displayPressure = document.getElementById("pressure");
  var displayWindSpeed = document.getElementById("wind_spped");
  var displayBackground = document.getElementsByClassName("body");
  var displaySunriseAndSundown = document.getElementById("sunrise_sundown");
  
  // Geolocation variables
  var city = "";
  var country = "";
  var latitude = "";
  var longitude = "";
  var sunrise = "";
  var sunset = "";
  var weather = "";
  var icon = "";
  var temperature = "";
  var tempMin = "";
  var tempMax = "";
  var humidity = "";
  var pressure = "";
  var wind = "";
  var unitSystem = "metric";
  var wantedUnitSystem = "";
  var clickedButton = 'false';
  

  // Get geolocation using "https://ipinfo.io/json"
  function getGeolocation() {
    if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(function(locationObject) {
        latitude = locationObject.coords.latitude;
        longitude = locationObject.coords.longitude;
        getWeatherData();
      });
    }
  }

  function getWeatherData() {
    var weatherRequest = new XMLHttpRequest();

    weatherRequest.onreadystatechange = function() {
      if (weatherRequest.readyState == 4 && weatherRequest.status == 200) {
        var weatherData = JSON.parse(weatherRequest.responseText);
        city = weatherData.name;
        country = weatherData.sys.country;
        sunrise = convertTimeStamp(weatherData.sys.sunrise) + " am";
        sunset = convertTimeStamp(weatherData.sys.sunset) + " pm"; 
        weather = weatherData.weather[0].description;
        /* displayBackground.style.backgroundImage = 'url(' + backgroundImage[weather] + ')'; */
        document.body.style.backgroundImage = 'url(' + backgroundImage[weather] + ')';

        icon = weatherData.weather[0].icon;
        temperature = parseFloat(weatherData.main.temp).toFixed(2);
        tempMin = parseFloat( weatherData.main.temp_min).toFixed(2);
        tempMax = parseFloat(weatherData.main.temp_max).toFixed(2);
        humidity = weatherData.main.humidity;
        pressure = weatherData.main.pressure;
        wind = weatherData.wind.speed;
        displayData();
      }
    };
    weatherRequest.open(
      "GET",
      "https://cors.5apps.com/?uri=http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&units=" + unitSystem +
        "&APPID=33455b1b0fde934b097cbb5e74e6fabb",
      true
    );
    weatherRequest.send();
  }

  function convertTimeStamp(unixTime) {
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(unixTime * 1000);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

    // Will display time in 10:30:23 format
    var formattedTime =
      hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);

    return formattedTime;
  }

  function displayData() {
    if (((country==='US' || country==='LY' || country==='MMR') && clickedButton==='false') || wantedUnitSystem === 'imperial') {
      unitSystem = 'imperial';
      temperature = convertTempToImperial(temperature);
      tempMin = convertTempToImperial(tempMin);
      tempMax = convertTempToImperial(tempMax);
      wind = convertWindToImperial(wind);
    } 
    
    if (wantedUnitSystem === 'metric'){
      unitSystem = 'metric';
      temperature = convertTempToMetric(temperature);
      tempMin = convertTempToMetric(tempMin);
      tempMax = convertTempToMetric(tempMax);
      wind = convertWindToMetric(wind);
    }
    
    //display city and country
    displayCity.innerHTML = city + ", " + country;
    
    // display temperature
    var tempSymbol = '°F';
    var windSymbol = 'miles/hr';
    
    if (unitSystem === 'metric') {
      tempSymbol = '°C';
      windSymbol = 'meters/sec';
    }
    
    var tempSummary = "Current Temperature: <b>" + temperature + tempSymbol + "</b>\nMin Temperature: <b>" + tempMin + tempSymbol + "</b>\nMax Temperature: <b>" + tempMax  + tempSymbol + "</b>";
    displayTemp.innerHTML = tempSummary.replace(/(\r\n|\n|\r)/gm, "<br>");
    
    // display weather condition
    var iconUrl = "http://openweathermap.org/img/w/" + icon + ".png";
    displayWeather.innerHTML = "<b style='font-size: 20px'>" + weather + "</b><img src=\"" + iconUrl + "\">";
    
    // display humidity
    displayHumidity.innerHTML = "Humidity: <b>" + humidity + "%</b>";
    displayPressure.innerHTML = "Atmospheric Pressure: <b>" + pressure + " hPa</b>";
    
    // display wind speed
    displayWindSpeed.innerHTML = "Wind Speed: <b>" + wind +  " " + windSymbol + "</b>";
    
    // display sunrise and sundown 
    var timeSummary = "Sunrise: <b>" + sunrise + "</b>\nSunset: <b>" + sunset + "</b>";
    displaySunriseAndSundown.innerHTML = timeSummary.replace(/(\r\n|\n|\r)/gm, "<br>");
  }

  function convertTempToImperial(temp) {
    temp = temp * 1.8 + 32;
    return temp.toFixed(2);
  }
  
  function convertTempToMetric(temp) {
    temp = (temp - 32) / 1.8;
    return temp.toFixed(2);
  }
  
  function convertWindToImperial(speed) {
    speed = speed * 2.2369;
    return speed.toFixed(2);
  }
  
  function convertWindToMetric(speed) {
    speed = speed / 2.2369;
    return speed.toFixed(2);;
  }
  
  $( "button" ).click(function() {
    clickedButton = 'true';
    if(unitSystem==='metric') {
      // need to convert to imperial
      wantedUnitSystem = 'imperial';
      displayData();
    } else {
      wantedUnitSystem = 'metric';
      displayData();
    }
  });
  
  getGeolocation(); // starts the whole application
})();