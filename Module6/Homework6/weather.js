const openWeatherMapAPIKey = "e5f4ecd904720c88a577abf7e089304c";
const usaContryCode = 840;

const WMODataBase = [{ WMOCode: 0, WMOStatus: "Clear Sky", status: "Sun", outlookURL: "Outlooks/Sun.png" },
{ WMOCode: 1, WMOStatus: "Mainly Clear", status: "Sun", outlookURL: "Outlooks/Sun.png" },
{ WMOCode: 2, WMOStatus: "Partly Cloudy", status: "Half Clouds", outlookURL: "Outlooks/HalfClouds.png" },
{ WMOCode: 3, WMOStatus: "Overcast", status: "Half Clouds", outlookURL: "Outlooks/HalfClouds.png" },
{ WMOCode: 45, WMOStatus: "Fog", status: "Clouds", outlookURL: "Outlooks/Clouds.png" },
{ WMOCode: 48, WMOStatus: "Depositing Rime Fog", status: "Clouds", outlookURL: "Outlooks/Clouds.png" },
{ WMOCode: 51, WMOStatus: "Light Drizzle", status: "Clouds", outlookURL: "Outlooks/Clouds.png" },
{ WMOCode: 53, WMOStatus: "Moderate Drizzle", status: "Rain", outlookURL: "Outlooks/Rain.png" },
{ WMOCode: 55, WMOStatus: "Dense Drizzle", status: "Rain", outlookURL: "Outlooks/Rain.png" },
{ WMOCode: 56, WMOStatus: "Light Freezing Drizzle", status: "Clouds", outlookURL: "Outlooks/Clouds.png" },
{ WMOCode: 57, WMOStatus: "Dense Freezing Drizzle", status: "Snow", outlookURL: "Outlooks/Snow.png" },
{ WMOCode: 61, WMOStatus: "Slight Rain", status: "Clouds", outlookURL: "Outlooks/Clouds.png" },
{ WMOCode: 63, WMOStatus: "Moderate Rain", status: "Rain", outlookURL: "Outlooks/Rain.png" },
{ WMOCode: 65, WMOStatus: "Heavy Rain", status: "Rain", outlookURL: "Outlooks/Rain.png" },
{ WMOCode: 66, WMOStatus: "Light Freezing Rain", status: "Clouds", outlookURL: "Outlooks/Clouds.png" },
{ WMOCode: 67, WMOStatus: "Heavy Freezing Rain", status: "Snow", outlookURL: "Outlooks/Snow.png" },
{ WMOCode: 71, WMOStatus: "Slight Snow", status: "Clouds", outlookURL: "Outlooks/Clouds.png" },
{ WMOCode: 73, WMOStatus: "Moderate Snow", status: "Snow", outlookURL: "Outlooks/Snow.png" },
{ WMOCode: 75, WMOStatus: "Heavy Snow", status: "Snow", outlookURL: "Outlooks/Snow.png" },
{ WMOCode: 77, WMOStatus: "Snow Grains", status: "Snow", outlookURL: "Outlooks/Snow.png" },
{ WMOCode: 80, WMOStatus: "Slight Rain Showers", status: "Clouds", outlookURL: "Outlooks/Clouds.png" },
{ WMOCode: 81, WMOStatus: "Moderate Rain Showers", status: "Rain", outlookURL: "Outlooks/Rain.png" },
{ WMOCode: 82, WMOStatus: "Violent Rain Showers", status: "Rain", outlookURL: "Outlooks/Rain.png" },
{ WMOCode: 85, WMOStatus: "Slight Snow Showers", status: "Clouds", outlookURL: "Outlooks/Clouds.png" },
{ WMOCode: 86, WMOStatus: "Heavy Snow Showers", status: "Snow", outlookURL: "Outlooks/Snow.png" },
{ WMOCode: 95, WMOStatus: "Generic Thunderstorm", status: "Rain", outlookURL: "Outlooks/Rain.png" },
{ WMOCode: 96, WMOStatus: "Thunderstorm With Slight Hail", status: "Snow", outlookURL: "Outlooks/Snow.png" },
{ WMOCode: 99, WMOStatus: "Thunderstorm With Heavy Hail", status: "Snow", outlookURL: "Outlooks/Snow.png" },]

// Register the onFormSubmit event once the dom finishes loading.
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
function init() {
    const form = document.querySelector("form");
    form.addEventListener('submit', onFormSubmit);
}

// Gets form data and then querries the api for data which is displayed in the response.
async function onFormSubmit(event) {
    event.preventDefault();

    let formData = getFormData(event);

    let city1Weather = await getWeather(await getCoordinates(formData.city1, formData.state1), formData.units);
    let city2Weather = await getWeather(await getCoordinates(formData.city2, formData.state2), formData.units);

    let compairison = new Compairison(formData.city1, formData.state1, city1Weather, formData.city2, formData.state2, city2Weather, formData.units);

    updateResponse(compairison);
}

// Updates the response html to reflect comparison data.
function updateResponse(compairison) {
    document.querySelector("#response").style.removeProperty("display");

    if (compairison.weather1 !== undefined) {
        document.querySelector("#table1").style.removeProperty("display");
        document.querySelector("#response1-city").textContent = compairison.city1 + " " + compairison.state1;

        document.querySelector("#response1-high1").textContent = compairison.weather1[0].high + "\u00B0";
        document.querySelector("#response1-high2").textContent = compairison.weather1[1].high + "\u00B0";
        document.querySelector("#response1-high3").textContent = compairison.weather1[2].high + "\u00B0";
        document.querySelector("#response1-high4").textContent = compairison.weather1[3].high + "\u00B0";
        document.querySelector("#response1-high5").textContent = compairison.weather1[4].high + "\u00B0";

        document.querySelector("#response1-low1").textContent = compairison.weather1[0].low + "\u00B0";
        document.querySelector("#response1-low2").textContent = compairison.weather1[1].low + "\u00B0";
        document.querySelector("#response1-low3").textContent = compairison.weather1[2].low + "\u00B0";
        document.querySelector("#response1-low4").textContent = compairison.weather1[3].low + "\u00B0";
        document.querySelector("#response1-low5").textContent = compairison.weather1[4].low + "\u00B0";

        document.querySelector("#response1-outlook1").src = parseWMOCode(compairison.weather1[0].WMOCode);
        document.querySelector("#response1-outlook2").src = parseWMOCode(compairison.weather1[1].WMOCode);
        document.querySelector("#response1-outlook3").src = parseWMOCode(compairison.weather1[2].WMOCode);
        document.querySelector("#response1-outlook4").src = parseWMOCode(compairison.weather1[3].WMOCode);
        document.querySelector("#response1-outlook5").src = parseWMOCode(compairison.weather1[4].WMOCode);
    } else {
        document.querySelector("#table1").style.display = "none";
        document.querySelector("#response1-city").textContent = "Unable to get weather in " + compairison.city1 + " " + compairison.state1;
    }


    if (compairison.weather2 !== undefined) {
        document.querySelector("#table2").style.removeProperty("display");
        document.querySelector("#response2-city").textContent = compairison.city2 + " " + compairison.state2;

        document.querySelector("#response2-high1").textContent = compairison.weather2[0].high + "\u00B0";
        document.querySelector("#response2-high2").textContent = compairison.weather2[1].high + "\u00B0";
        document.querySelector("#response2-high3").textContent = compairison.weather2[2].high + "\u00B0";
        document.querySelector("#response2-high4").textContent = compairison.weather2[3].high + "\u00B0";
        document.querySelector("#response2-high5").textContent = compairison.weather2[4].high + "\u00B0";

        document.querySelector("#response2-low1").textContent = compairison.weather2[0].low + "\u00B0";
        document.querySelector("#response2-low2").textContent = compairison.weather2[1].low + "\u00B0";
        document.querySelector("#response2-low3").textContent = compairison.weather2[2].low + "\u00B0";
        document.querySelector("#response2-low4").textContent = compairison.weather2[3].low + "\u00B0";
        document.querySelector("#response2-low5").textContent = compairison.weather2[4].low + "\u00B0";

        document.querySelector("#response2-outlook1").src = parseWMOCode(compairison.weather2[0].WMOCode);
        document.querySelector("#response2-outlook2").src = parseWMOCode(compairison.weather2[1].WMOCode);
        document.querySelector("#response2-outlook3").src = parseWMOCode(compairison.weather2[2].WMOCode);
        document.querySelector("#response2-outlook4").src = parseWMOCode(compairison.weather2[3].WMOCode);
        document.querySelector("#response2-outlook5").src = parseWMOCode(compairison.weather2[4].WMOCode);
    } else {
        document.querySelector("#table2").style.display = "none";
        document.querySelector("#response2-city").textContent = "Unable to get weather in " + compairison.city2 + " " + compairison.state2;
    }

    updateLayout();
}

// Takes a numerical WMO code and returns a url to the coorisponding outlook image.
function parseWMOCode(code) {
    for (let i = 0; i < WMODataBase.length; i++) {
        if (WMODataBase[i].WMOCode == code) {
            return WMODataBase[i].outlookURL;
        }
    }
    return "Outlooks/AwSnap.png";
}

// Takes an onFormSumbit event and returns the data of that form.
function getFormData(event) {
    let formData = new FormData(event.target);
    let output = {};
    formData.forEach((value, key) => {
        output[key] = value;
    });
    return output;
}

// Returns a 5 day weather report for the given coordinates.
async function getWeather(coordinates, units) {
    if (coordinates === undefined) {
        return undefined;
    }

    let requestURL = "https://api.open-meteo.com/v1/forecast?latitude=" + coordinates.latitude + "&longitude=" + coordinates.longitude + "&daily=weather_code,temperature_2m_max,temperature_2m_min";
    if (units == "fahrenheit" || units == "Fahrenheit") {
        requestURL += "&temperature_unit=fahrenheit";
    }
    let result = await queryAPI(requestURL);

    let output = [];
    for (let i = 0; i < 5; i++) {
        let weather = new Weather(result.daily.temperature_2m_max[i], result.daily.temperature_2m_min[i], result.daily.weather_code[i]);
        output.push(weather);
    }

    return output;
}

// Returns a coorinates object containing the location of the specified city or undefined if there is an error.
async function getCoordinates(city, state) {
    let result = await queryAPI("https://api.openweathermap.org/geo/1.0/direct?q=" + city + "," + state + "," + usaContryCode + "&appid=" + openWeatherMapAPIKey);
    if (result === undefined || result.length === 0) {
        return undefined;
    }
    return new Coordinates(result[0].lat, result[0].lon);
}

// Fetches a url and returns the result as a javascript object.
async function queryAPI(url) {
    let response = await fetch(url);
    return response.json();
}

class Compairison {
    constructor(city1, state1, weather1, city2, state2, weather2, units) {
        this.city1 = city1;
        this.state1 = state1;
        this.weather1 = weather1;
        this.city2 = city2;
        this.state2 = state2;
        this.weather2 = weather2;
        this.units = units;
    }
}

// A class for storing a weather report for a given day.
class Weather {
    constructor(high, low, WMOCode) {
        this.high = high;
        this.low = low;
        this.WMOCode = WMOCode;
    }
}

// A class for storing latitude and longitude coordinates.
class Coordinates {
    constructor(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
}