var searchHistoryArray = JSON.parse(localStorage.getItem('historyArray'))||[]
var currentWeatherEl = document.getElementById('#currentweather')
var searchHistoryEl = document.getElementById('searchhistory')

//logic to add search history to local storage
for(var i = 0; i < searchHistoryArray.length; i++){
    var searchBtn = $('<button>').addClass('btn btn-success').text(searchHistoryArray[i])
    $('#searchhistory').append(searchBtn)
}

//clear local storage
$('#clear').on('click', function(){
    localStorage.clear()
    searchHistoryEl.innerHTML = ''
})

//add search input into local storage
$('#searchbutton').on('click', function(){
    var searchIn = $("#searchinput").val()
    var searchButton = $('<button>').addClass('btn').text(searchIn)
    searchHistoryArray.push(searchIn)
    localStorage.setItem('historyArray',JSON.stringify(searchHistoryArray))
    $('#searchhistory').append(searchButton)
    geocode(searchIn)


function geocode(searchinput){
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchinput}&limit=5&appid=6f5354d6c2eb4d8b50da66b8c8c0fcbc`)
    .then(response => response.json())
    .then(data => {
        console.log(data)
      
        currentWeather(data[0].lat,data[0].lon)

    })
}

//display current weather
function currentWeather(lat,lon){
    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=6f5354d6c2eb4d8b50da66b8c8c0fcbc&units=imperial`)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        $('#currentContainer').empty()
       var currentWeatherEl = document.createElement('div')
       currentWeatherEl.setAttribute('id', 'currentweather')
       $('#currentContainer').append(currentWeatherEl)
        var mainCard = $('<div>').addClass('card')
        var cityName = $('<h1>').text('City: ' + data.name)
        var temp = $('<h1>').text('Temp: ' + data.main.temp)
        var feelsLike = $('<h1>').text('Feels Like: ' + data.main.feels_like)
        var humidity = $('<h1>').text('Humidity: ' + data.main.humidity)
        var windSpeed = $('<h1>').text('Wind Speed: ' + data.wind.speed)
        mainCard.append( cityName, temp, feelsLike, humidity, windSpeed)
        $('#currentweather').append(mainCard)
        var forecast = $('<div>').addClass('forecast')
        $('.forecast').html('5 Day Forecast')
        $('#currentweather').append(forecast)
        getforecast(lat,lon)

    })
}

//get forecast
function getforecast(lat,lon){
    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=6f5354d6c2eb4d8b50da66b8c8c0fcbc&units=imperial`)
    .then(response => response.json())
    .then(data => {
        console.log('data', data)

        var day1 = data.list[5]
        var day2 = data.list[13]
        var day3 = data.list[21]
        var day4 = data.list[29]
        var day5 = data.list[37]
        var daysarray = [day1, day2, day3, day4, day5]
        console.log(daysarray)
        for (let i = 0; i < daysarray.length; i++){
        var daydata = daysarray[i].main
        var temp = $('<h1>').text('Temp: ' + daydata.temp)
        var feelslike = $('<h1>').text('Feels Like: ' + daydata.feels_like)
        
        //weather img icon
        var iconurl = `https://openweathermap.org/img/w/${daysarray[i].weather[0].icon}.png`

        var icon = document.createElement('img')
        icon.setAttribute('src', iconurl)


            // adds the elements to 5 day forecast titlecards
            var forecastCard = document.createElement('div')
            var forecastCardTitle = document.createElement('p')
            var forecastTemp = document.createElement('p')
            forecastCardTitle.innerHTML = ('Day ' + (i + 1))
            forecastTemp.innerHTML = daydata.temp
            forecastCard.appendChild(icon)
            forecastCard.appendChild(forecastCardTitle)
            forecastCard.appendChild(forecastTemp)

         $('.forecast').append(forecastCard)
        
        }
    })
}
})
